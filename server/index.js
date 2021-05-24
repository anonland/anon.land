// import things..
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const firebase = require("./db/firebase");
const http = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const fireDate = require("@google-cloud/firestore");
const fs = require("fs");
const io = require("socket.io")(5000, { cors: true, origins: ["http://localhost:5000", "https://anon.land"] });
const { FieldValue } = require("@google-cloud/firestore");
const { body, validationResult } = require('express-validator');

// set cors policy
app.use(cors({ origin: ["http://localhost:5000", "https://anon.land"] }));

app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
  })
});

const storage = multer.diskStorage({
  destination: "../site/www/images",
  filename: function (req, file, cb) {
    const parts = file.mimetype.split("/");
    cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
  }
});

const categoryValidate = (value) => {
  let categories = ['off', 'prg', 'mus', 'cin', 'sci', 'pol', 'art', 'his', 'nor', 'uff', 'anm'];
  return categories.includes(value);
};

const upload = multer({
  storage,
  limits: { fileSize: 15000000 },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.webm' && ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return cb(null, false)
    }
    cb(null, true)
  }
});

const middleware = (req, res, next) => {
  if (req.originalUrl == "/" || "/create" || "/session" || "/comment") {
    const cb = (err, data) => {
      const userIP = req.headers["x-forwarded-for"];
      let bool = false;
      if (err) {
        console.log(err);
        return false;
      } else {
        data = JSON.parse(data);
        data.ips.forEach((element) => {
          if (element == userIP) bool = true;
        });
      }
      if (bool) res.sendFile(path.join(__dirname, "../site/www/assets/ban/banned-user.html"));
      else next();
    };
    fs.readFile(pathBanList, "utf8", cb);
  } else {
    next();
  }
};

// path public..
app.use('/images', express.static('../site/www/images'));
app.use(middleware, express.static(path.join(__dirname, "../site/www")));
let pathBanList = __dirname + "/blacklist.json";

// main endpoint..
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../site/www/index.html"));
});

async function getAdminData(token) {
  try {
    const decodedToken = await firebase.admin.auth().verifyIdToken(token)
    const mod = await firebase.db.collection('mods').doc(decodedToken.email).get();
    return mod.exists ? decodedToken : null;
  } catch (error) {
    return null;
  }
}

app.post("/session", async (req, res) => {
  if (res.status(200)) {
    const userIP = req.headers["x-forwarded-for"] || req.ip;
    //verificar que no exista en el blacklist de baneos

    const userID = uuidv4().slice(-6);

    const userData = { userIP, userID };
    await firebase.db.collection("users").add(userData);

    res.json(userID);
  } else {
    console.log("Error de conexión");
  }
});

app.post("/create",
  upload.single("post-img-upload"),
  body("category").custom(categoryValidate),
  body("body").isLength({ max: 1500 }),
  body("title").isLength({ min: 5, max: 100 }),
  async (req, res) => {
    if (res.status(200)) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors, req.body);
        return res.status(400).json({ errors: errors.array() });
      }

      const img = req.file;
      if (img == undefined) return res.sendStatus(400);

      const { category, title, body, opid } = req.body;

      const postData = {
        category,
        imgPath: '/images/' + req.file.filename,
        title,
        body,
        opid,
        createdAt: fireDate.Timestamp.now(),
      };

      await firebase.db.collection("posts").add(postData);

      io.emit('newPostCreated');

      return res.sendStatus(200);
    } else {
      console.log("Error de conexión");
    }
  });

app.post("/comment", upload.single("post-img-upload"), body("body").isLength({ min: 1, max: 1500 }), async (req, res) => {
  if (res.status(200)) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.file) {
      var imgPath = '/images/' + req.file.filename;
    }

    const { body, postId, userId } = req.body;
    const commentData = {
      body,
      imgPath: imgPath || '',
      postId,
      userId,
      anonType: Math.floor(Math.random() * 9) + 1,
      reports: 0,
      createdAt: fireDate.Timestamp.now(),
    };

    await firebase.db.collection("comments").add(commentData);
    io.emit(`${postId}/newComment`);

    return res.sendStatus(200);
  } else {
    console.log("Error de conexión");
  }
});

app.post("/report", async (req, res) => {

  await firebase.db
    .collection("posts")
    .doc(req.body.postID)
    .update({ reports: FieldValue.increment(1) });

  res.sendStatus(200);
});

app.post("/reportComment", async (req, res) => {
  await firebase.db
    .collection("comments")
    .doc(req.body.commentID)
    .update({ reports: FieldValue.increment(1) });

  res.sendStatus(200);
});


app.post("/delete", async (req, res) => {
  if (req.body.token == null) {
    res.sendStatus(401);
    return;
  }

  const adminData = await getAdminData(req.body.token);
  if (!adminData) {
    res.sendStatus(401);
  }

  await firebase.db.collection("posts").doc(req.body.postID).delete();
  console.log('post borrado por ADMIN' + adminData.email);

  io.emit('deletedPost', req.body.postID);

  res.sendStatus(200);
});

app.post("/delete-comment", async (req, res) => {
  console.log(req.body);
  if (req.body.token == null) {
    res.sendStatus(401);
    return;
  }

  const adminData = await getAdminData(req.body.token);
  if (!adminData) res.sendStatus(401);

  await firebase.db.collection("comments").doc(req.body.commentID).delete();

  io.emit(`${req.body.postID}/deletedComment`, req.body.commentID);

  res.sendStatus(200);
});

app.post("/move", async (req, res) => {
  if (req.body.token == null) {
    res.sendStatus(401);
    return;
  }

  const adminData = await getAdminData(req.body.token);
  if (!adminData) {
    res.sendStatus(401);
  }

  await firebase.db.collection("posts").doc(req.body.postID).update({ category: req.body.category });

  io.emit('movedPost', req.body.postID, req.body.category);

  res.sendStatus(200);
});

app.post("/ban", async (req, res) => {
  //admin ban IP
  if (req.body.token == null) {
    res.sendStatus(401);
    return;
  }

  const adminData = await getAdminData(req.body.token);
  if (!adminData) {
    res.sendStatus(401);
  }

  const { userID } = req.body;
  let search = await firebase.db.collection("users").where('userID', '==', userID).get();
  const file = fs.readFileSync(pathBanList, "utf8");
  const bans = JSON.parse(file);
  bans.ips.push(search.docs[0].data().userIP);
  fs.writeFileSync(pathBanList, JSON.stringify(bans));
  console.log(`usuario ${userID} baneado por ADMIN ${adminData.email}`);

  io.emit('ban', userID);

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('SERVER OPEN ' + Date(Date.now()).toString());
});
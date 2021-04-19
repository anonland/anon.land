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
const io = require("socket.io")(http, { cors: { origin: '*' } });
const { json } = require("express");
const { type } = require("os");
const { FieldValue } = require("@google-cloud/firestore");
const { body, validationResult } = require('express-validator');
// set cors policy
app.use(cors());

app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
  })
});

const storage = multer.diskStorage({
  //destination: "uploads",
  filename: function (req, file, cb) {
    const parts = file.mimetype.split("/");
    cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
  }


});

const categoryValidate = (value)=>{
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
      const userIP = req.headers["x-fo  rwarded-for"];
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
      if (bool) res.sendStatus(401);
      else next();
    };
    fs.readFile(pathBanList, "utf8", cb);
  } else {
    next();
  }
};

// path public..
app.use(middleware, express.static(path.join(__dirname, "../site/www")));
let pathBanList = __dirname + "/blacklist-historic.json";

// main endpoint..
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../site/www/index.html"));
});

async function getAdminData(token) {
  try {
    const decodedToken = await firebase.admin.auth().verifyIdToken(token)
    return decodedToken;
  } catch (error) {
    return null;
  }
}

app.post("/session", async (req, res) => {
  if (res.status(200)) {
    const userIP = req.headers["x-forwarded-for"] || req.ip;
    //verificar que no exista en el baneo historico + el baneo diario

    const userID = uuidv4().slice(-6);
  
    const userData = { userIP, userID };
    await firebase.db.collection("users").add(userData);
    res.json(userID);
  } else {
    console.log("Error de conexión");
  }
});

app.post("/create", upload.single("post-img-upload"), body("category").custom(categoryValidate),
body("body").isLength({  min: 5, max: 1500}), body("title").isLength({  min: 5, max: 50}) , async (req, res) => {
  if (res.status(200)) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors, req.body);
      return res.status(400).json({ errors: errors.array() });
    }
    const img = req.file;
    if (img == undefined) return res.sendStatus(400);
    const imgPath = req.file.path;
    const { category, title, body, opid } = req.body;
    const uploadedFile = await firebase.admin.storage().bucket().upload(imgPath, { public: true });
    const signedUrls = await uploadedFile[0].getSignedUrl({ action: 'read', expires: '01-01-4499' })
    const publicUrl = signedUrls[0];
    const postData = {
      category,
      imgPath: publicUrl,
      title,
      body,
      opid,
      createdAt: fireDate.Timestamp.now(),
    };

    await firebase.db.collection("posts").add(postData);
    io.emit('newPostCreated')
    return res.sendStatus(200);
  } else {
    console.log("Error de conexión");
  }
});

app.post("/comment", upload.single("post-img-upload"), body("body").isLength({min: 1, max: 1500}), async (req, res) => {
  if (res.status(200)) {
    const userIP = req.headers["x-forwarded-for"];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.file) {
      const uploadedFile = await firebase.admin.storage().bucket().upload(req.file.path, { public: true });
      const signedUrls = await uploadedFile[0].getSignedUrl({ action: 'read', expires: '01-01-4499' })
      var publicUrl = signedUrls[0];
    }

    const { body, postId, userId } = req.body;

    const commentData = {
      body,
      imgPath: publicUrl || '',
      postId,
      userId,
      anonType: Math.floor(Math.random() * 9) + 1,
      reports: 0,
      createdAt: fireDate.Timestamp.now(),
    }

    await firebase.db.collection("comments").add(commentData);
    io.emit(`${postId}/newComment`)
    return res.sendStatus(200);
  } else {
    console.log("Error de conexión");
  }
});

app.post("/report", async (req, res) => {
  console.log(req.body.postID);
  await firebase.db
    .collection("posts")
    .doc(req.body.postID)
    .update({ reports: FieldValue.increment(1) });
  console.log("asdasd");
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
  //admin delete post
  console.log(req.body);
  if (req.body.token == null) {
    res.sendStatus(401);
    return;
  }

  const adminData = await getAdminData(req.body.token);
  if (!adminData) {
    res.sendStatus(401);
    console.log("no se pudo borrar post");
  }

  await firebase.db.collection("posts").doc(req.body.postID).delete();
  console.log('post borrado por ADMIN' + adminData.email);
  res.sendStatus(200);
});

app.post("/move", async (req, res) => {
  //admin delete post
  console.log(req.body);
  if (req.body.token == null) {
    res.sendStatus(401);
    return;
  }

  const adminData = await getAdminData(req.body.token);
  if (!adminData) {
    res.sendStatus(401);
  }

  await firebase.db.collection("posts").doc(req.body.postID).update({ category: req.body.category });
  console.log('post updateado por ADMIN' + adminData.email);
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
      console.log("no se pudo banear la IP");
    }
  
  const {userID, userIP } = req.body;
  let search = await firebase.db.collection("users").where('userId','==', req.body.userId).get();
  console.log(search.data().userIP);
  fs.appendFile("/blacklist-historic.json",`'\n'${search.data().userIP}`, (error)=>{
    if(error) console.log(`Error al appendear IP al FILESYSTEM: ${error}`);
  });
});



// heroku port access..
app.set("port", process.env.PORT || 3000);

// Opening port..
http.listen(app.get("port"), () => {
  console.log("Opening in port 3000");
});
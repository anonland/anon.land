// import things..
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer");
const firebase = require("./db/firebase");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const fireDate = require("@google-cloud/firestore");
const fs = require("fs");
const { json } = require("express");
const { type } = require("os");
const { FieldValue } = require("@google-cloud/firestore");
// set cors policy
app.use(cors());

app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
      const parts = file.mimetype.split("/");
      cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
  }
});
const upload = multer({
  storage,
  limits: {fileSize: 15000000},
  fileFilter: (req, file, cb)=>{
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    cb(new Error('Subí solo imagenes'))
  } {
    cb(undefined, true);
    }
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
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname));
});

app.post("/session", async (req, res) => {
  if (res.status(200)) {
    const userIP = req.headers["x-forwarded-for"];
    //verificar que no exista en el baneo historico + el baneo diario

    const userID = uuidv4().slice(-6);

    const userData = { userIP, userID };
    await firebase.db.collection("users").add(userData);
    res.json(token);
  } else {
    console.log("Error de conexión");
  }
});



app.post("/create", upload.single("post-img-upload") , async (req, res) => {

  if (res.status(200)) {
    const img = req.file;
    const imgPath = req.file.path;
    const { category, title, body, opid } = req.body;
    const postData = {
      category,
      imgPath,
      title,
      body,
      opid,
      createdAt: fireDate.Timestamp.now(),
    };
    console.log("body", req.body);
    console.log('image', imgPath)
  
    await firebase.db.collection("posts").add(postData);
    return res.sendStatus(200);
  } else {
    console.log("Error de conexión");
  }
});

app.post("/comment", async (req, res) => {
  // chequear archivo de baneos diarios

  // console.log(req.headers["x-forwarded-for"]);
  console.log("body", req.body);

  if (res.status(200)) {
    const userIP = req.headers["x-forwarded-for"];
    const { body, img, postId, userId } = req.body;
    const commentData = {
      body,
      img,
      postId,
      userId,
      createdAt: fireDate.Timestamp.now(),
    };
    await firebase.db.collection("comments").add(commentData);
    return res.status(200);
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

// aca

const server = http.createServer(app);
// heroku port access..
app.set("port", process.env.PORT || 3000);
// Opening port..
app.listen(app.get("port"), () => {
  console.log("Opening in port 3000");
});

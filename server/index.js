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

// set cors policy
app.use(cors());

app.use(bodyParser.json());

const middleware = async (req, res, next) => {
  if (req.originalUrl == '/') {
    const banned = await checkBlackList("192.168.0.1");
    if (banned)
      res.sendStatus(401);
    else
      next();
  } else {
    next();
  }
};

// path public
app.use(middleware, express.static(path.join(__dirname, "../site/www")));

async function checkBlackList(userIP) {
  let blackDoc = (await firebase.db.collection(`blacklist`).doc(userIP).get())
    .exists;
  console.log(blackDoc);
  return blackDoc;
}

// main endpoint..
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname));
});

//
app.post("/session", async (req, res) => {
  if (res.status(200)) {
    const userIP = req.headers["x-forwarded-for"];
    const userID = uuidv4().slice(-6);
    const userData = { userIP, userID };

    res.json(userID);
    await firebase.db.collection("users").add(userData);
    console.log("user agregado!");
  } else {
    console.log("Error de conexión");
  }
});

app.post("/create", async (req, res) => {
  // console.log(req.headers["x-forwarded-for"]);
  console.log("body", req.body);

  if (res.status(200)) {
    const userIP = req.headers["x-forwarded-for"];
    const { category, img, title, body, opid} = req.body;
    const postData = {
      category,
      img,
      title,
      body,
      opid,
      createdAt: fireDate.Timestamp.now(),
    };
    await firebase.db.collection("posts").add(postData);
    console.log("post agregado!");
    return res.status(200);
  } else {
    console.log("Error de conexión");
  }
});


app.post("/comment", async (req, res) => {
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
    console.log("comentario agregado!");
    return res.status(200);
  } else {
    console.log("Error de conexión");
  }
});

// aca

const server = http.createServer(app);
// heroku port access..
app.set("port", process.env.PORT || 3000);
// Opening port..
app.listen(app.get("port"), () => {
  console.log("Opening..");
});

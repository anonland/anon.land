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
// path public
app.use(express.static(path.join(__dirname, "../site/www")));

// session key
app.use(
  session({
    secret: "jejetabien",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());
let userList = [];

// main endpoint..
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname));
});

//
app.post("/session", async (req, res) => {
  if (res.status(200)) {
    const userIP = req.headers["x-forwarded-for"];
    const userID = uuidv4().slice(-6);
    const userData = {
      userIP,
      userID,
    };
    res.json(userData);
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
    const { category, img, title, body } = req.body.data;
    const postData = {
      category,
      img,
      title,
      body,
      //  createdAt: Timestamp.now(),
    };
    await firebase.db.collection("posts").add(postData);
    console.log("post agregado!");
    return res.status(200);
  } else {
    console.log("Error de conexión");
  }
});

// testeo firebase
app.get("/test", (req, res) => {
  console.log(req.body);
  //const obj = JSON.parse(result.body);
  const quoteData = {
    quote: "",
    author: "",
  };
  return firebase.db
    .collection("exampleData")
    .doc("testing")
    .set(quoteData)
    .then(() => {
      console.log("nueva cita textual agregada a la DB");
    });
});

// aca

const server = http.createServer(app);
// heroku port access..
app.set("port", process.env.PORT || 3000);
// Opening port..
app.listen(app.get("port"), () => {
  console.log("Opening..");
});

// import things..
const express = require('express')
const app = express()
const port = 3000;
const path = require("path");
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// main endpoint..
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

// home endpoint..
app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/home.html"));
})










// Opening port..
app.listen(port, function () {
    console.log("Opening port at " + port + ` http://localhost:${port}`);
})

// import things..
const express = require('express')
const app = express()
const port = 3000;
const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));

// endpoint..   
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})











// Opening port..
app.listen(port, function() {
    console.log("Opening port at " + port + ` http://localhost:${port}`);
})

// import things..
const express = require('express')
const app = express()
const port = 3000;
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./userDB.js');
const dbPost = require('./postDB.js');
const expHbs = require("express-handlebars");

// Setting HBS engine
app.set("view engine", "handlebars");
app.engine("handlebars", expHbs({
    defaultLayout: "public",
    layoutsDir: path.join(__dirname, "views/layouts")
}));
app.set('views', path.join(__dirname, "views"))

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
let userList = [];
// main endpoint..
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

// home endpoint..
app.get('/home', function (req, res) {
    res.render('posting', {
        layout: 'public'
    });
 //   res.sendFile(path.join(__dirname, "/public/home.html"));
})

// post register
app.post('/register', function (req, res) {
    // Verificar si recibí los datos y validarlos
    if (!req.body) {
        res.status(400).send("No se recibieron bien los datos");
        return;
    } else {
        userList.push({ password: req.body.newPW, points: req.body.points, userid: req.body._id });
        db.register(req.body.newPW, (bool) => {
            if (bool) {
                console.log("asdasd " + req.body._id); // me tira undefined !!!! QUE HAGO
                return res.status(200).json({
                    success: true,
                    redirect: "/home",
                    userid: req.body._id
                  //  points: req.body.points
                });

            }
            else { console.log('error in DB') }
        });
        console.log(userList);
        console.log(req.body);
        //  res.status(200)
    }
})

// post para publicar incompleto
app.post('/exp', function (req, res) {
    if (!req.body) {
        res.status(400).send("Error al publicar");
    } else {
        dbPost.createPost(req.body, (bool) => {
            if (bool) {
                return res.status(200).json({
                    success: true,
                    redirect: `/exp/${req.body.section}`
                });
            }
        });
    }

});







// Opening port..
app.listen(port, function () {
    console.log("Opening port at " + port + ` http://localhost:${port}`);
})

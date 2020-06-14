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
const { register } = require('./userDB.js');
const session = require('express-session');
// Setting HBS engine
app.set("view engine", "handlebars");
app.engine("handlebars", expHbs({
    defaultLayout: "public",
    layoutsDir: path.join(__dirname, "views/layouts")
}));
app.set('views', path.join(__dirname, "views"))

// set cors policy
app.use(cors());
// path public
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json

app.use(session({
    secret: 'jejetabien',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

app.use(bodyParser.json())
let userList = [];
// main endpoint..
app.get('/', function (req, res) {
    if (req.session.loggedUser) {
        res.redirect('/home');
    } else { res.sendFile(path.join(__dirname, "/public/index.html")); }

})

// home endpoint..
app.get('/home', function (req, res) {
    if (req.session.loggedUser) {
        res.render('posting', {
            layout: 'public',
            
        });
    } //   res.sendFile(path.join(__dirname, "/public/home.html"));
    else { res.redirect('/'); }
})

// post register
app.post('/register', function (req, res) {
    // Verificar si recibí los datos y validarlos
    if (!req.body) {
        res.status(400).send("No se recibieron bien los datos");
        return;
    } else {
        //   userList.push({ password: req.body.newPW, points: req.body.points, userid: req.body._id });
        db.register(req.body.newPW, (bool, userid) => {
            if (bool) {
                //  console.log(db.register.result.insertedId);
                // userid = req.body.insertedId.toString().slice(0,5);
                //     console.log("asdasd " + userid); // me tira undefined !!!! QUE HAGO
                return res.status(200).json({
                    success: true,
                    redirect: "/home",
                    userid
                    //  points: req.body.points
                });

            }
            else {
                req.session.message = {
                    success: false,
                    text: "Error al registrarse intentelo de nuevo"
                };
                res.redirect('/');
            }
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

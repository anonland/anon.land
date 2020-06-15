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
const { debug } = require('console');
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
    saveUninitialized: false
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
        console.log("session, "+req.session.loggedUser);
        db.getUser(req.session.loggedUser, (response) => {
            if (response.success) {
                let points = response.user.points;
                let rank = response.user.rank;
                let shortId = req.session.loggedUser.slice(0, 5);
                res.render('posting', {
                    layout: 'public',
                    userid: shortId,
                    points,
                    rank
                });
            } else {
                return res.json({
                    message: "error bad"
                })
            }

        });

    } //
    else { res.redirect('/'); }
})

// post register
app.post('/register', function (req, res) {
    // Verificar si recibí los datos y validarlos
    if (!req.body) {
        res.status(400).send("No se recibieron bien los datos");
        return;
    } else {
        db.register(req.body.newPW, (bool, userid) => {
            if (bool) {
                req.session.loggedUser = userid;
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

        //  res.status(200)
    }
})
// login post..
app.post('/login', function (req, res) {
    db.login(req.body.userid, req.body.password, result => {
        console.log(result.userid);
        if (result.userid) {
            req.session.loggedUser = result.userid;
            res.redirect('/home');
        } else {
            req.session.message = {
                class: "failure",
                text: "No se pudo iniciar la sesion"
            };
            res.redirect('/');
        }
    });

});

// post para publicar incompleto..
app.post('/exp', function (req, res) {
    if (!req.body) {
        res.status(400).send("Error al publicar");
    } else {
        dbPost.createPost(req.body, (bool) => {
            if (bool) {
                return res.status(200).json({
                    success: true,
                    redirect: `/exp/${req.body.section}`
                    // ejemplo: /exp/off
                    // ejemplo de publicacion: /exp/off/jlkaJSLKjasl id de mongo del post
                });
            }
        });
    }

});

// posting endpoint..
app.get('/exp/:section/:postId?', function (req, res) {
   // console.log(req.params);
});





// Opening port..
app.listen(port, function () {
    console.log("Opening port at " + port + ` http://localhost:${port}`);
})

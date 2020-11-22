// import things..
const express = require('express')
const app = express()
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { debug } = require('console');
const multer = require('multer');

app.set('views', path.join(__dirname, "s"))

// set cors policy
app.use(cors());
// path public
app.use(express.static(path.join(__dirname, 'public')));

// session key
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

    }
    else { res.redirect('/'); }
})

// post register
app.post('/register', function (req, res) {
    // Verificar si recibí los datos y validarlos
    if (!req.body) {
        res.status(400).send("No se recibieron bien los datos");
        return;
    } else {


    }
})
// login post..
app.post('/login', function (req, res) {


});

// post for pusblish incomplete..
app.post('/exp', function (req, res) {
    if (!req.body) {
        res.status(400).send("Error al publicar");
    } else {
        if (req.session.loggedUser) {
            req.body.userid = req.session.loggedUser.userid;
            req.body.rank = req.session.loggedUser.rank;

        } else { res.redirect('/'); }

    }
});

// filter posting endpoint..
app.get('/exp/:section/:postid?', function (req, res) {
    // if the section and the post id EXISTS render it..
    if (req.session.loggedUser) {
        if (req.params.section && req.params.postid) {

        }

        if (req.params.section) {

        }
    } else {
        res.redirect('/');
    }
})

// coments post..
app.post('/exp/:section/:postid?'), function (req, res) {
    if (!req.body) {
        res.status(400).send("Error");
    } else {
        if (req.session.loggedUser) {
            console.log(req.body);


        } else {
            req.session.message = {
                class: "failure",
                text: "No se pudo iniciar la sesion"
            };
        }
    }
}



// heroku port access..
app.set('port', process.env.PORT || 3000);
// Opening port..
app.listen(app.get('port'),()=> {
    console.log("Opening..");
})

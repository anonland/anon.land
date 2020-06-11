// import things..
const express = require('express')
const app = express()
const port = 3000;
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./userDB.js');
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
    res.sendFile(path.join(__dirname, "/public/home.html"));
})

app.post('/register', function (req, res) {

    

    // Verificar si recibí los datos y validarlos
    if(!req.body){
        res.status(400).send("No se recibieron bien los datos");
        return;
    }else{
    userList.push({password: req.body.newPW});
    db.register(req.body.newPW, (bool) => {
        if(bool)console.log('success');
        else{console.log('error in DB')}
    });
    console.log(userList);
    console.log(req.body);
    res.status(200).send('registrado satisfactoriamente!');
    }
  /**  let { newPW } = req.body;
    console.log(req.body);
    
    
     
    const erros = [];
    if(newPW<=0){}
    if (newPW.length <= 4) { erros.push({ text: "la contraseña tiene que ser de mas de 4 caracteres" }); }
    if (erros.length > 0){res.render('/register',{newPW});}
    else{res.send('ok');}
        
    ;*/
})








// Opening port..
app.listen(port, function () {
    console.log("Opening port at " + port + ` http://localhost:${port}`);
})

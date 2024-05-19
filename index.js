const express = require('express');
const {engine} = require('express-handlebars');

// comme ça la BD sera accessible dans tous les routeurs 
const db = require("./db")

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static("static"));
app.use(express.urlencoded({extended: true}));

const routerFacture = require('./routerFacture');
app.use('/', routerFacture);

const routerEmploye = require("./routerEmploye");

app.use("/", routerEmploye);

app.get('/', function(req, res){
    res.render("employe")
})

app.listen(3000, function(){
    console.log('Fonctionne');
})
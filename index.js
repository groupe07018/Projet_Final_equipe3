const express = require('express');
const {engine} = require('express-handlebars');
const chantierRouter = require("./chantiertouter");
// comme ça la BD sera accessible dans tous les routeurs 
const db = require("./db")

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use('/chantier', chantierRouter);
app.use(express.static("static"));
app.use(express.urlencoded({extended: true}));

//pour dire utiliser routerchantier.js
app.use ("/", routerchantier);

const routerFacture = require("./routerFacture");
app.use('/', routerFacture);


app.get('/', function(req, res){
    res.render("index")
})

app.listen(3000, function(){
    console.log('Fonctionne');
})
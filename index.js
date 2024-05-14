const express = require('express');
const {engine} = require('express-handlebars');

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static("static"));

const { createClient } = require("@libsql/client");
const db = createClient({
    url:"file:bd_projet.db"
});

app.get('/', function(req, res){
    res.render("index")
})

app.listen(3000, function(){
    console.log('Fonctionne');
})
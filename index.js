const express = require('express');
const { engine } = require('express-handlebars');
const cookieParser = require("cookie-parser");
const session = require("./sessions");


const db = require("./db");
const ajoutEmploye = require('./ajoutEmploye');
const routerchantier = require('./routerchantier');
const app = express();


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static("static"));
// Ajoute les middleware pour les formulaires et cookie
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/', ajoutEmploye); 
//pour dire utiliser routerchantier.js
app.use ("/", routerchantier);

// Middleware pour la gestion des sessions (sessions.js)
app.use(session.middleware);
const routerFacture = require("./routerFacture");
app.use('/', routerFacture);

// Routeurs
app.use("/signup", require("./auth/signup"));
app.use("/ajoutPremierUtilisateur", require("./auth/signup"));
app.use("/login", require("./auth/login"));
app.use('/employe', require('./routerEmploye'));
app.use('/patron', require('./routerPatron'));

app.get('/', function(req, res) {
    res.render("index");
});


app.get('/liste-employes', async (req, res) => {
    try {
        const result = await db.execute({
            sql: "SELECT * FROM utilisateur"
        });

        console.log('Query result:', result.rows);

        if (result.rows.length > 0) {
            res.render("listeEmployes", { employees: result.rows });
        } else {
            res.send("<h2>Il n'y a aucun employé enregistré.</h2>"); 
        }
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/nouvel-employe', (req, res) => {

    res.render('ajoutEmploye'); 
});


app.get('/liste-contracteurs', async (req, res) => {
    try {
        const result = await db.execute({
            sql: "SELECT nom_compagnie, courriel FROM contracteur"
        });

        console.log('Query result:', result.rows);

        if (result.rows.length > 0) {
            res.render("listeContracteurs", { contractors: result.rows });
        } else {
            res.send('<h2>Aucun contracteur enregistré.'); 
        }
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/nouveau-contracteur', (req, res) => {

    res.render('ajoutContracteur'); 
});

app.post('/nouveau-contracteur', async (req, res) => {
    const { nom_compagnie, courriel } = req.body;

    try {

        const checkResult = await db.execute({
            sql: "SELECT * FROM contracteur WHERE nom_compagnie = ? AND courriel = ?",
            args: [nom_compagnie, courriel]
        });

        if (checkResult.rows.length > 0) {

            res.send(`<h2>Le contracteur existe déjà. Veuillez saisir des informations différentes.</h2>
                      <a href="/nouveau-contracteur">Retour</a>`);
        } else {
            await db.execute({
                sql: "INSERT INTO contracteur (nom_compagnie, courriel) VALUES (?, ?)",
                args: [nom_compagnie, courriel]
            });

            res.redirect('/liste-contracteurs');
        }
    } catch (err) {
        console.error('Database insertion error: ', err);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/chantiers-en-cours', (req, res) => {

    res.render('listeChantier'); 
});





app.listen(3000, function(){
    console.log('Fonctionne');
})
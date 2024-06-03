const express = require('express');
const { engine } = require('express-handlebars');
const cookieParser = require("cookie-parser");
const session = require("./sessions");


const db = require("./db");;
const app = express();


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static("static"));
// Ajoute les middleware pour les formulaires et cookie
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware pour la gestion des sessions (sessions.js)
app.use(session.middleware);
const routerFacture = require("./routerFacture");
const routerChantier = require("./routerchantier");

app.use('/', routerFacture);
app.use('/', routerChantier);
// Routeurs
app.use("/signup", require("./auth/signup"));
app.use("/ajoutPremierUtilisateur", require("./auth/signup"));
app.use("/login", require("./auth/login"));
app.use('/employe', require('./routerEmploye'));

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

    res.render('ajoutUtilisateur'); 
});


app.get('/liste-contracteurs', async (req, res) => {
    try {
        const result = await db.execute({
            sql: "SELECT nom, courriel, adresse_client FROM client"
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

    res.render('ajoutClient'); 
});

app.post('/nouveau-contracteur', async (req, res) => {
    const { nom, courriel, adresse_client } = req.body;

    try {

        const checkResult = await db.execute({
            sql: "SELECT * FROM client WHERE nom = ? AND courriel = ?",
            args: [nom, courriel]
        });

        if (checkResult.rows.length > 0) {

            res.send(`<h2>Le client existe déjà. Veuillez saisir des informations différentes.</h2>
                      <a href="/nouveau-contracteur">Retour</a>`);
        } else {
            await db.execute({
                sql: "INSERT INTO client (nom, courriel, adresse_client) VALUES (?, ?, ?)",
                args: [nom, courriel, adresse_client]
            });

            res.render('/listeContracteurs');
        }
    } catch (err) {
        console.error('Database insertion error: ', err);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/chantiers-en-cours', (req, res) => {

    res.render('listeChantier'); 
});




app.post('/login', async function(req, res) {
    const login = req.body.userLogin;
    const mdp = req.body.MDP;

    if (login.length === 0 || mdp.length === 0) {
        res.redirect('/');
        return;
    }

    try {
        const result = await db.execute({
            sql: "SELECT * FROM utilisateur WHERE login = ? AND mot_de_passe = ?",
            args: [login, mdp]
        });

        if (result.rows.length > 0) {
            res.redirect('/chantiers-en-cours'); // redirige vers la page de gestion des chantiers en cas de succès
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error("Erreur", err);
        res.status(500).send("Erreur dans la base de données interne");
    }
});

app.listen(3000, function() {
    console.log("Fonctionne");
});


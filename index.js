const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const db = require("./db");
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: false }));

const routerFacture = require("./routerFacture");
const routerChantier = require("./routerchantier");

app.use('/', routerFacture);
app.use('/', routerChantier);

app.get('/', function(req, res) {
    res.render("index");
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


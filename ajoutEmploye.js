const express = require('express');
const router = express.Router();
const db = require("./db");

router.post('/nouvel-employe', async (req, res) => {
    const nom = req.body.login;
    const mdp = req.body.mdp;

    console.log('Nom:', nom);
    console.log('Mot de passe:', mdp);

    try {
        const checkResult = await db.execute({
            sql: "SELECT * FROM utilisateur WHERE login = ?",
            args: [nom]
        });

        if (checkResult.rows.length > 0) {
            res.send('<h2>Le nom existe déjà. Veuillez entrer un nom différent.</h2><a href="/nouvel-employe">Retour</a>');
        } else {
            await db.execute({
                sql: "INSERT INTO utilisateur (login, mot_de_passe) VALUES (?, ?)",
                args: [nom, mdp]
            });
            res.redirect('/liste-employes');
        }
    } catch (err) {
        console.error('Database query/insertion error:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

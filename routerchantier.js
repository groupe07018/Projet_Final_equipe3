const express = require('express');
const router = express.Router();
const { createClient } = require('@libsql/client');

// Base de données LibSQL
const db = createClient({
    url: "./bd_projet.db"
});
/* rien functionne jusqua present moi je l' ai travailler de mon coter autre que sur git donner moi vos commentaire
// Routes pour les chantiers

// Route pour afficher le formulaire d'ajout de chantier
router.get('/ajoute', async function(req, res) {
    try {
        const employes = await db.query('SELECT * FROM employé');
        const villes = await db.query('SELECT * FROM ville');
        const contracteurs = await db.query('SELECT * FROM contracteur');
        res.render("ajoutechantier", { employes: employes.rows, villes: villes.rows, contracteurs: contracteurs.rows });
    } catch (err) {
        
        res.status(500).send("Une erreur serveur");
    }
});

// route pour ajouter un chantier
router.post('/ajoute', async function(req, res) {
    const { adresse, ville, date_debut, date_fin, contracteur, employes } = req.body;
    try {
        const result = await db.query('INSERT INTO chantier (adresse, id_ville, date_debut, date_fin, id_contracteur) VALUES (?, ?, ?, ?, ?)', [adresse, ville, date_debut, date_fin, contracteur]);
        //j ai ree un chatierid local 
        const chantierId = result.insertId;
        if (employes) {
            for (const empId of employes) {
                await db.query('INSERT INTO hodorateur (id_chantier, id_employe) VALUES (?, ?)', [chantierId, empId]);
            }
        }
        res.redirect('/');
    } catch (err) {
        
        res.status(500).send("Une erreur serveur");
    }
});

// Route pour afficher le sommaire d'un chantier dans la encadrer de la page
router.get('/sommaire/:id', async function(req, res) {
    const id = req.params.id;
    try {
        const chantier = await db.query('SELECT * FROM chantier WHERE id = ?', [id]);
        res.render("sommairechantier", { chantier: chantier.rows[0] });
    } catch (err) {
        
        res.status(500).send("Une erreur serveur");
    }
});

// Routes pour les clients

// Route pour afficher le formulaire d'ajout de client
router.get('/ajouteclient', async function(req, res) {
    try {
        const villes = await db.query('SELECT * FROM ville');
        res.render('ajouteclient', { villes: villes.rows });
    } catch (err) {
       
        res.status(500).send("Une erreur serveur");
    }
});

//voici la route que j ai cree pour ajouter un nouveau client dans la base de données
router.post('/ajouteclient', async function(req, res) {
    const { nom, courriel, adresse, ville } = req.body;
    try {
        //fait ma requete pour la base de donné pour obtenir tout les ville
        await db.query('INSERT INTO client (nom, courriel, adresse, id_ville) VALUES (?, ?, ?, ?)', [nom, courriel, adresse, ville]);
        res.redirect('/');
    } catch (err) {
        
        //permet de d envoyer un message d' erreur au client dit serveur
        res.status(500).send("Une erreur serveur");
    }
});

module.exports = router;

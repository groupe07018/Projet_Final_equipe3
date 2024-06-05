


// Route pour afficher la liste des chantiers
const express = require('express');
const router = express.Router();
const db = require("./db");
const autorisation = require("./autorisation");

// Route pour afficher la liste des chantiers
router.get('/chantiers-en-cours', autorisation, async function(req, res) {
    try {
        const chantiersEnCours = await db.execute(
            `SELECT ch.*, cl.*
            FROM chantier ch
            JOIN client cl
                ON ch.id_client = cl.id
            WHERE ch.statut = 'actif'`
        )

        const chantiersArchives = await db.execute(
            `SELECT ch.*, cl.*
            FROM chantier ch
            JOIN client cl
                ON ch.id_client = cl.id
            WHERE ch.statut = 'inactif'`
        )

        const clients = await db.execute({
            sql: "SELECT * FROM client"
        });

        res.render('listeChantier', {
            chantiersEnCours: chantiersEnCours.rows,
            chantiersArchives: chantiersArchives.rows,
            clients: clients.rows,
        });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route pour afficher le formulaire d'ajout de client
router.get('/ajoutClient', autorisation, async function(req, res) {
    res.render('ajoutClient');
});

// Route pour afficher le formulaire d'ajout de chantier
router.get('/ajoutChantier', autorisation, async function(req, res) {
    try {
        const clients = await db.execute({ sql: 'SELECT * FROM client' });
        res.render('ajoutChantier', { clients: clients.rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Une erreur serveur');
    }
});

// Route pour ajouter un nouveau client
router.post('/ajoutclient', autorisation, async function(req, res) {
    const { nom, courriel, adresse_client } = req.body;
    try {
        await db.execute({
            sql: 'INSERT INTO client (nom, courriel, adresse_client) VALUES (?, ?, ?)',
            args: [nom, courriel, adresse_client]
        });
        res.redirect('/patron');
    } catch (err) {
        console.error('Erreur lors de l\'insertion dans la base de données:', err.message); // on ne veut pas afficher le message dans la console.
        res.status(500).send('Erreur interne du serveur');
    }
});

// Route pour ajouter un nouveau chantier
router.post('/ajoutchantier', autorisation, async function(req, res) {
    const { nom_projet, adresse_chantier, client, statut } = req.body;
    try {
        console.log("Données reçues pour l'ajout du chantier:", req.body);

        // Vérification des données reçues
        if (!nom_projet || !adresse_chantier || !client || !statut) {
            throw new Error('Toutes les données requises ne sont pas présentes');
        }

        const result = await db.execute({
            sql: 'INSERT INTO chantier (nom_projet, adresse_chantier, id_client, statut) VALUES (?, ?, ?, ?)',
            args: [nom_projet, adresse_chantier, client, statut]
        });
        console.log("Chantier ajouté avec succès:", result);
        res.redirect('/chantiers-en-cours');
    } catch (err) {
        console.error('Erreur lors de l\'insertion dans la base de données:', err.message);
        res.status(500).send('Erreur interne du serveur');
    }
});

module.exports = router;

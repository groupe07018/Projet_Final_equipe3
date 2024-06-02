


// Route pour afficher la liste des chantiers
const express = require('express');
const router = express.Router();
const db = require("./db");

// Route pour afficher la liste des chantiers
router.get('/chantiers-en-cours', async function(req, res) {
    try {

        /* 
        https://stackoverflow.com/questions/42908654/calculating-time-difference-between-two-sqlite-columns-and-showing-the-result-on
        https://learnsql.com/cookbook/how-to-calculate-the-difference-between-two-timestamps-in-sqlite/
        https://stackoverflow.com/questions/53813220/calculation-of-the-difference-between-two-dates-in-sqlite-based-on-multiple-cond
        https://stackoverflow.com/questions/70186801/how-do-i-measure-the-difference-between-two-dates-in-sqlite
        https://stackoverflow.com/questions/44075758/sqlite-difference-between-dates
        https://stackoverflow.com/questions/36918511/difference-of-year-between-two-date
        https://sqlite.org/forum/forumpost/f3c7cac8a7
        https://learnsql.com/cookbook/how-to-calculate-the-difference-between-two-timestamps-in-mysql/#:~:text=To%20calculate%20the%20difference%20between%20the%20timestamps%20in%20MySQL%2C%20use,have%20done%20here%2C%20choose%20SECOND%20.
        https://stackoverflow.com/questions/289680/difference-between-2-dates-in-sqlite
        https://www.sqlite.org/lang_datefunc.html
        j ai trouver tout ces site la mais j arrive pas a enlever les sec infini 
        */
        const chantiersEnCours = await db.execute({
            sql: `
                SELECT chantier.*, client.nom AS client_nom, client.adresse_client AS client_adresse,
                IFNULL(SUM(
                    ((CAST(SUBSTR('0000' || heure_fin, -4, 2) AS INTEGER) * 60 + CAST(SUBSTR('0000' || heure_fin, -2) AS INTEGER)) - 
                    (CAST(SUBSTR('0000' || heure_debut, -4, 2) AS INTEGER) * 60 + CAST(SUBSTR('0000' || heure_debut, -2) AS INTEGER))) / 60.0
                ), 0) AS total_heures
                FROM chantier
                JOIN client ON chantier.id_client = client.id
                LEFT JOIN horodateur ON chantier.id = horodateur.id_chantier
                WHERE chantier.statut = 'actif'
                GROUP BY chantier.id
            `
        });

        const chantiersArchives = await db.execute({
            sql: `
                SELECT chantier.*, client.nom AS client_nom, client.adresse_client AS client_adresse,
                IFNULL(SUM(
                    ((CAST(SUBSTR('0000' || heure_fin, -4, 2) AS INTEGER) * 60 + CAST(SUBSTR('0000' || heure_fin, -2) AS INTEGER)) - 
                    (CAST(SUBSTR('0000' || heure_debut, -4, 2) AS INTEGER) * 60 + CAST(SUBSTR('0000' || heure_debut, -2) AS INTEGER))) / 60.0
                ), 0) AS total_heures
                FROM chantier
                JOIN client ON chantier.id_client = client.id
                LEFT JOIN horodateur ON chantier.id = horodateur.id_chantier
                WHERE chantier.statut = 'inactif'
                GROUP BY chantier.id
            `
        });

        const clients = await db.execute({
            sql: "SELECT * FROM client"
        });

        res.render('listeChantier', {
            chantiersEnCours: chantiersEnCours.rows,
            chantiersArchives: chantiersArchives.rows,
            clients: clients.rows
        });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route pour afficher le formulaire d'ajout de client
router.get('/ajoutClient', async function(req, res) {
    res.render('ajoutClient');
});

// Route pour afficher le formulaire d'ajout de chantier
router.get('/ajoutChantier', async function(req, res) {
    try {
        const clients = await db.execute({ sql: 'SELECT * FROM client' });
        res.render('ajoutChantier', { clients: clients.rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Une erreur serveur');
    }
});

// Route pour ajouter un nouveau client
router.post('/ajoutclient', async function(req, res) {
    const { nom, courriel, adresse_client } = req.body;
    try {
        console.log("Données reçues pour l'ajout du client:", req.body);
        await db.execute({
            sql: 'INSERT INTO client (nom, courriel, adresse_client) VALUES (?, ?, ?)',
            args: [nom, courriel, adresse_client]
        });
        console.log("Client ajouté avec succès.");
        res.redirect('/chantiers-en-cours');
    } catch (err) {
        console.error('Erreur lors de l\'insertion dans la base de données:', err.message);
        res.status(500).send('Erreur interne du serveur');
    }
});

// Route pour ajouter un nouveau chantier
router.post('/ajoutchantier', async function(req, res) {
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

// Route pour afficher la facture pour un chantier spécifique
router.get('/facture/:id', async function(req, res) {
    const chantierId = req.params.id;
    try {
        const chantier = await db.execute({
            sql: 'SELECT * FROM chantier WHERE id = ?',
            args: [chantierId]
        });
        const client = await db.execute({
            sql: 'SELECT * FROM client WHERE id = ?',
            args: [chantier.rows[0].id_client]
        });
        res.render('facture', {
            chantier: chantier.rows[0],
            client: client.rows[0]
        });
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;

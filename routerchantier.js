const express = require('express');
const router = express.Router();
const db = require("./db");

router.get('/chantiers-en-cours', async function(req, res) {
    try {
        const chantiersEnCours = await db.execute({
            sql: "SELECT chantier.*, ville.nom_ville FROM chantier JOIN ville ON chantier.id_ville = ville.id WHERE chantier.statut = 'actif'"
        });
        const chantiersArchives = await db.execute({
            sql: "SELECT chantier.*, ville.nom_ville FROM chantier JOIN ville ON chantier.id_ville = ville.id WHERE chantier.statut = 'inactif'"
        });
        const clients = await db.execute({
            sql: "SELECT client.*, ville.nom_ville FROM client JOIN ville ON client.id_ville = ville.id"
        });

        res.render('listeChantier', {
            chantiersEnCours: chantiersEnCours.rows,
            chantiersArchives: chantiersArchives.rows,
            clients: clients.rows
        });
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/ajoutClient', async function(req, res) {
    try {
        const villes = await db.execute({ sql: 'SELECT * FROM ville' });
        res.render('ajoutClient', { villes: villes.rows });
    } catch (err) {
        res.status(500).send('Une erreur serveur');
    }
});

router.get('/ajoutChantier', async function(req, res) {
    try {
        const clients = await db.execute({ sql: 'SELECT * FROM client' });
        const villes = await db.execute({ sql: 'SELECT * FROM ville' });
        const employes = await db.execute({ sql: 'SELECT * FROM utilisateur WHERE profil_administrateur = 0' });
        res.render('ajoutChantier', { clients: clients.rows, villes: villes.rows, employes: employes.rows });
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Une erreur serveur');
    }
});

router.post('/ajoutclient', async function(req, res) {
    const { nom, courriel, adresse, ville, code_postal } = req.body;
    try {
        await db.execute({
            sql: 'INSERT INTO client (nom, courriel, adresse, id_ville, code_postal) VALUES (?, ?, ?, ?, ?)',
            args: [nom, courriel, adresse, ville, code_postal]
        });
        res.redirect('/chantiers-en-cours');
    } catch (err) {
        console.error('Database insertion error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/ajoutchantier', async function(req, res) {
    const { adresse, ville, client, employes, statut } = req.body;
    try {
        const result = await db.execute({
            sql: 'INSERT INTO chantier (adresse, id_ville, id_client, statut) VALUES (?, ?, ?, ?)',
            args: [adresse, ville, client, statut]
        });
        const chantierId = result.lastInsertRowid;
        if (employes && employes.length > 0) {
            for (const empId of employes) {
                await db.execute({
                    sql: 'INSERT INTO hodorateur (id_chantier, id_employe) VALUES (?, ?)',
                    args: [chantierId, empId]
                });
            }
        }
        res.redirect('/chantiers-en-cours');
    } catch (err) {
        console.error('Database insertion error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route pour gérer la redirection vers la page de facturation
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

/*const express = require('express');
const router = express.Router();
const db = require("./db");

router.get('/chantiers-en-cours', async function(req, res) {
    try {
        const chantiersEnCours = await db.execute({
            sql: "SELECT chantier.*, ville.nom_ville FROM chantier JOIN ville ON chantier.id_ville = ville.id WHERE chantier.statut = 'actif'"
        });
        const chantiersArchives = await db.execute({
            sql: "SELECT chantier.*, ville.nom_ville FROM chantier JOIN ville ON chantier.id_ville = ville.id WHERE chantier.statut = 'inactif'"
        });
        const clients = await db.execute({
            sql: "SELECT client.*, ville.nom_ville FROM client JOIN ville ON client.id_ville = ville.id"
        });

        res.render('listeChantier', {
            chantiersEnCours: chantiersEnCours.rows,
            chantiersArchives: chantiersArchives.rows,
            clients: clients.rows
        });
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/ajoutClient', async function(req, res) {
    try {
        const villes = await db.execute({ sql: 'SELECT * FROM ville' });
        res.render('ajoutClient', { villes: villes.rows });
    } catch (err) {
        res.status(500).send('Une erreur serveur');
    }
});

router.get('/ajoutChantier', async function(req, res) {
    try {
        const clients = await db.execute({ sql: 'SELECT * FROM client' });
        const villes = await db.execute({ sql: 'SELECT * FROM ville' });
        const employes = await db.execute({ sql: 'SELECT * FROM utilisateur WHERE profil_administrateur = 0' });
        res.render('ajoutChantier', { clients: clients.rows, villes: villes.rows, employes: employes.rows });
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Une erreur serveur');
    }
});

router.post('/ajoutclient', async function(req, res) {
    const { nom, courriel, adresse, ville, code_postal } = req.body;
    try {
        await db.execute({
            sql: 'INSERT INTO client (nom, courriel, adresse, id_ville, code_postal) VALUES (?, ?, ?, ?, ?)',
            args: [nom, courriel, adresse, ville, code_postal]
        });
        res.redirect('/chantiers-en-cours');
    } catch (err) {
        console.error('Database insertion error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/ajoutchantier', async function(req, res) {
    const { adresse, ville, client, employes, statut } = req.body;
    try {
        const result = await db.execute({
            sql: 'INSERT INTO chantier (adresse, id_ville, id_client, statut) VALUES (?, ?, ?, ?)',
            args: [adresse, ville, client, statut]
        });
        const chantierId = result.lastInsertRowid;
        if (employes && employes.length > 0) {
            for (const empId of employes) {
                await db.execute({
                    sql: 'INSERT INTO hodorateur (id_chantier, id_employe) VALUES (?, ?)',
                    args: [chantierId, empId]
                });
            }
        }
        res.redirect('/chantiers-en-cours');
    } catch (err) {
        console.error('Database insertion error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;


/*
const express = require('express');
const router = express.Router();
const db = require("./db");

router.get('/chantiers-en-cours', async function(req, res) {
    try {
        const chantiersEnCours = await db.execute({
            sql: "SELECT chantier.*, ville.nom_ville FROM chantier JOIN ville ON chantier.id_ville = ville.id WHERE chantier.statut = 'actif'"
        });
        const chantiersArchives = await db.execute({
            sql: "SELECT chantier.*, ville.nom_ville FROM chantier JOIN ville ON chantier.id_ville = ville.id WHERE chantier.statut = 'inactif'"
        });
        const clients = await db.execute({
            sql: "SELECT client.*, ville.nom_ville FROM client JOIN ville ON client.id_ville = ville.id"
        });

        res.render('listeChantier', {
            chantiersEnCours: chantiersEnCours.rows,
            chantiersArchives: chantiersArchives.rows,
            clients: clients.rows
        });
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/ajoutclient', async function(req, res) {
    try {
        const villes = await db.execute({ sql: 'SELECT * FROM ville' });
        res.render('ajoutClient', { villes: villes.rows });
    } catch (err) {
        res.status(500).send('Une erreur serveur');
    }
});

router.get('/ajoutchantier', async function(req, res) {
    try {
        const clients = await db.execute({ sql: 'SELECT * FROM client' });
        const villes = await db.execute({ sql: 'SELECT * FROM ville' });
        const employes = await db.execute({ sql: 'SELECT * FROM utilisateur WHERE profil_administrateur = 0' });
        res.render('ajoutChantier', { clients: clients.rows, villes: villes.rows, employes: employes.rows });
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Une erreur serveur');
    }
});

router.post('/ajoutclient', async function(req, res) {
    const { nom, courriel, adresse, ville, code_postal } = req.body;
    try {
        await db.execute({
            sql: 'INSERT INTO client (nom, courriel, adresse, id_ville, code_postal) VALUES (?, ?, ?, ?, ?)',
            args: [nom, courriel, adresse, ville, code_postal]
        });
        res.redirect('/chantiers-en-cours');
    } catch (err) {
        console.error('Database insertion error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/ajoutchantier', async function(req, res) {
    const { adresse, ville, date_debut, date_fin, client, employes } = req.body;
    try {
        const result = await db.execute({
            sql: 'INSERT INTO chantier (adresse, id_ville, date_debut, date_fin, id_client) VALUES (?, ?, ?, ?, ?)',
            args: [adresse, ville, date_debut, date_fin, client]
        });
        const chantierId = result.lastInsertRowid;
        if (employes && employes.length > 0) {
            for (const empId of employes) {
                await db.execute({
                    sql: 'INSERT INTO hodorateur (id_chantier, id_employe) VALUES (?, ?)',
                    args: [chantierId, empId]
                });
            }
        }
        res.redirect('/chantiers-en-cours');
    } catch (err) {
        console.error('Database insertion error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

*/
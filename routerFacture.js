const express = require('express');
const router = express.Router();

const db = require("./db")

router.get('/ajoutFraisFixe', function(req, res){
    res.render('ajoutFraisFixe')
})

router.post('/frais_fixe', async function(req, res){
    const {nom_frais_fixe, prix_frais_fixe, unite_frais_fixe} = req.body
    const result = await db.execute ({
        sql: "INSERT INTO frais_fixe(nom_frais_fixe, prix_frais_fixe, unite_frais_fixe) VALUES(:nom_frais_fixe, :prix_frais_fixe, :unite_frais_fixe)",
        args: {nom_frais_fixe, prix_frais_fixe, unite_frais_fixe}
    });
    res.render("ajoutFraisFixe", 
        {message: `<div class='alert alert-success alert-dismissible'>
                    <button type='button' class='btn-close' data-bs-dismiss='alert'></button>Ajout effectué avec succès</div>`})
})

router.get('/facture', async function(req, res){
    const chantier = await db.execute ("SELECT * from chantier WHERE id=")
    const frais_fixe = await db.execute("SELECT * FROM frais_fixe")
    //const heure_facturable = await db.execute()
    res.render("facture", {frais_fixe:frais_fixe.rows})
})

router.get('/listeArchive', async function(req, res){// m'assurer que la page sommaire affiche bien les détails du chantier (adresse, et autres)
    const chantier = await db.execute("SELECT * FROM chantier WHERE statut = 'termine'")
    res.render("listeArchive", {chantier:chantier.rows})
})

router.get('/sommaireChantier', function(req, res){ // enlever cette route, elle devrait être dans routerChantier déjà
    res.render("sommaireChantier") 
})

module.exports = router;
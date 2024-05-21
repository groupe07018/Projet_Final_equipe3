const express = require('express');
const router = express.Router();

const db = require("./db")

router.get('/facture', async function(req, res){
    //const chantier = await db.execute ("SELECT * from chantier WHERE id = ")
    const frais_fixe = await db.execute("SELECT * FROM frais_fixe")
    //const heure_facturable = await db.execute()
    res.render("facture", {frais_fixe:frais_fixe.rows})
})

router.get('/ajoutFraisFixe', function(req, res){
    res.render('ajoutFraisFixe')
})

router.post('/frais_fixe', async function(req, res){
    const {nom_frais_fixe, prix_frais_fixe, unite_frais_fixe} = req.body
    const result = await db.execute ({
        sql: "INSERT INTO frais_fixe(nom_frais_fixe, prix_frais_fixe, unite_frais_fixe) VALUES(:nom_frais_fixe, :prix_frais_fixe, :unite_frais_fixe)",
        args: {nom_frais_fixe, prix_frais_fixe, unite_frais_fixe}
    });
    res.redirect("facture")
})

router.get('/sommaireChantier', function(req, res){ // enlever cette route, elle devrait être dans routerChantier déjà
    res.render("sommaireChantier") 
})

module.exports = router;
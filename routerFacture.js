const express = require('express');
const router = express.Router();

router.get('/facture', async function(req, res){
    //const chantier = await db("SELECT * from chantier WHERE id = ")
    res.render("facture")
})

router.get('/sommaireChantier', function(req, res){ // enlever cette route, elle devrait être dans routerChantier déjà
    res.render("sommaireChantier") 
})

module.exports = router;
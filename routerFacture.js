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

router.get('/facture/:id', async function(req, res){//pour afficher la page: localhost:3000/facture/1 (ou id du chantier)
    const idChantier = req.params.id
    const chantier = await db.execute({
        sql: `SELECT ch.*, cl.*
                FROM chantier ch
                JOIN client cl
                    ON ch.id_client = cl.id
                  WHERE ch.id = ?`,
        args: [idChantier]})
    const frais_fixe = await db.execute("SELECT * FROM frais_fixe")
    //const heure_facturable = await db.execute()
    res.render("facture", {frais_fixe:frais_fixe.rows, chantier:chantier.rows, idChantier:idChantier})
})


//pour enregister les informations de la facture
router.post('/factureRemplie', async function(req, res){
    const resultat = req.body
    JSON.stringify(resultat)
    const idFacture = req.query.id
    console.log(idFacture)
    /*await db.execute({
        sql : `UPDATE chantier 
        SET facture = :facture 
            WHERE id= :id `,
        args: {facture : JSON.stringify(resultat), id : id}
    })
//pour archiver le chantier une fois qu'il est facturé
    await db.execute(`UPDATE chantier
        SET statut = 'inactif'
        WHERE id = `
    )*/
    res.json(resultat)
})


module.exports = router;
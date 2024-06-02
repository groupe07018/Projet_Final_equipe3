const express = require('express');
const router = express.Router();

const db = require("./db")
router.use(express.json())
router.get('/ajoutFraisFixe', function(req, res){
    res.render('ajoutFraisFixe')
})

router.post('/frais_fixe', async function(req, res){
    const {nom_frais_fixe, prix_frais_fixe, unite_frais_fixe} = req.body
    if (!nom_frais_fixe || !prix_frais_fixe || !unite_frais_fixe) { 
        res.status(403).send(`Erreur - informations manquantes <br><br>
            <a href=/ajoutFraisFixe><button type='button'>Retour au formulaire</button></a>`)
        return;
    }
    const result = await db.execute ({
        sql: "INSERT INTO frais_fixe(nom_frais_fixe, prix_frais_fixe, unite_frais_fixe) VALUES(:nom_frais_fixe, :prix_frais_fixe, :unite_frais_fixe)",
        args: {nom_frais_fixe, prix_frais_fixe, unite_frais_fixe}
    });
    res.render("ajoutFraisFixe", 
        {message: `<div class='alert alert-success alert-dismissible'>
                    <button type='button' class='btn-close' data-bs-dismiss='alert'></button>Ajout effectué avec succès</div>`})
})

router.get('/facture/:id', async function(req, res){
    const idChantier = req.params.id
    if (!idChantier) {
        res.redirect("Aucun chantier trouvé")
        return;
    }
    const chantier = await db.execute({
        sql: `SELECT ch.*, cl.*
                FROM chantier ch
                JOIN client cl
                    ON ch.id_client = cl.id
                  WHERE ch.id = ?`,
        args: [idChantier]
    })
    const afficherFacture = chantier.rows[0]
    const frais_fixe = await db.execute("SELECT * FROM frais_fixe")
    //const heure_facturable = await db.execute()
    res.render("facture", {frais_fixe:frais_fixe.rows, 
        chantier:chantier.rows, 
        idChantier:idChantier, 
        afficherFacture
       })
})

//pour enregister les informations de la facture
router.post('/factureRemplie', async function(req, res){
    const resultat = req.body
    const idFacture = req.body.idChantier
    if (!resultat || !idFacture) { 
        res.status(403).send("Erreur")
        return;
    }
    JSON.stringify(resultat)
    await db.execute({
        sql : `UPDATE chantier 
        SET facture = :facture 
            WHERE id= :id `,
        args: {facture : JSON.stringify(resultat), id : idFacture}
    })
//pour archiver le chantier une fois qu'il est facturé
// fonctionne mais je ne veux pas changer le statut tout le temps, décommenter plus tard
    /*await db.execute({
        sql: `UPDATE chantier
        SET statut = 'inactif'
        WHERE id = :id`,
        args:{id:idFacture}
})*/
    res.render("ajoutFraisFixe")// changer le render pour listeChantier quand elle fonctionne
})


module.exports = router;
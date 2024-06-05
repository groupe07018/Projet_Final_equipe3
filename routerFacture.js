const express = require('express');
const router = express.Router();
const db = require("./db")
const autorisation = require("./autorisation");
router.use(express.json())

router.get('/ajoutFraisFixe', autorisation, function(req, res){
    res.render('ajoutFraisFixe')
})

router.post('/frais_fixe', autorisation, async function(req, res){
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


router.get('/facture/:id', autorisation, async function(req, res){
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
    const recup_heure = await db.execute({
            sql: `SELECT h.heure_debut, h.heure_fin,  c.id, SUM(h.heure_fin - h.heure_debut) as sous_total_heure
            FROM horodateur h
            LEFT JOIN chantier c
                on c.id = h.id_chantier
            WHERE c.id = ?`,
            args:[idChantier]
        })
        const heureFacturable = recup_heure.rows[0]

    res.render("facture", {frais_fixe:frais_fixe.rows, 
        chantier:chantier.rows, 
        idChantier:idChantier, 
        heureFacturable,
        afficherFacture
       })
})

//pour enregister les informations de la facture
router.post('/factureRemplie', autorisation, async function(req, res){
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
    await db.execute({
        sql: `UPDATE chantier
        SET statut = 'inactif'
        WHERE id = :id`,
        args:{id:idFacture}
})
    res.redirect("chantiers-en-cours")// changer le render pour patron quand elle fonctionne
})


module.exports = router;
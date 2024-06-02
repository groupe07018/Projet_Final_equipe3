const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

router.get("/employe", async function(req,res){
    res.render('employe');
})

router.get("/", async function (req,res) {
    const login = req.query.login;
    const chantier = await db.execute({sql:"SELECT id, nom_projet FROM chantier WHERE statut = 'actif'",
        args: {}
    })
  
    res.render("employe", {chantier: chantier.rows, login})
})


router.get('/ajoutHeure', async function(req, res){
    const {rows} = req.body;
    const result = await db.execute ({
        sql: `INSERT INTO horodateur(id_chantier, heure_debut)
         VALUES(:id_chantier, :heureInChiffre, :heureOutChiffre)`,
        args: [req.body.id_chantier, req.body.heureInChiffre, req.body.heureOutChiffre],
    });
    console.log(rows, result)
    res.render("", 
        {message: `<div class='alert alert-success alert-dismissible'>
            <button type='button' class='btn-close' data-bs-dismiss='alert'></button>Ajout effectué avec succès</div>`
        });
})

module.exports = router;
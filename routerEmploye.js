const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");



router.get("/employe", async function(req,res){
    res.render('employe');
})

router.get("/", async function (req,res) {
   /* const login = req.session.login;
    const nom = await db.execute({sql:"SELECT login FROM utilisateur WHERE id= :login",
        args: {}
    })*/
    const chantier = await db.execute({sql:"SELECT id, nom_projet FROM chantier WHERE statut = 'actif'",
        args: {}
    }) 
    res.render("employe", {chantier: chantier.rows}) //je n'arrive pas à afficher le login
})


router.get('/ajoutHeure', async function(req, res){
    const {rows} = req.body;
    const result = await db.execute ({
        sql: `INSERT INTO horodateur(id_utilisateur, id_chantier, heure_debut, heure_fin)
         VALUES(:login, :id_chantier, :heureInChiffre, :heureOutChiffre)`,
        args: [req.body.id_chantier, req.body.heureInChiffre, req.body.heureOutChiffre],
    });
    console.log(rows, result)
    res.render("ajoutHeure", 
        {message: `<div class='alert alert-success alert-dismissible'>
            <button type='button' class='btn-close' data-bs-dismiss='alert'></button>Ajout effectué avec succès</div>`
        });
})

module.exports = router;
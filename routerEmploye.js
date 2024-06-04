const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

router.get("/employe", async function(req,res){
    res.render('employe');
})

router.get("/", async function (req,res) {
    const login = req.session.login;
    const nom = await db.execute({sql:"SELECT login FROM utilisateur WHERE id= :login",
        args: {login}
    });
    const chantier = await db.execute({sql:"SELECT id, nom_projet FROM chantier WHERE statut = 'actif'",
        args: {}
    });
    res.render("employe", {login: nom.rows[0].login, chantier: chantier.rows}); 
});

router.get('/ajoutHeure', async function(req, res){
    console.log("allo");
    const idLogin = await db.execute ({
        sql:`SELECT id FROM utilisateur WHERE id= :login`,
        args: {login: req.body.login}
    })
    console.log(idLogin);
    const noChantier = req.body.id;
    console.log(noChantier);
    const result = await db.execute ({
        sql: `INSERT INTO horodateur(heure_debut, heure_fin, id_chantier, id_utilisateur)
         VALUES(:heureInChiffre, :heureOutChiffre, :id_chantier, :login)`,
        args: {heureInChiffre: req.body.heureInChiffre, heureOutChiffre: req.body.heureOutChiffre, id_chantier: req.body.id, login: req.body.login},
    });
    console.log(result);
    res.redirect("ajoutHeure");
})


module.exports = router;
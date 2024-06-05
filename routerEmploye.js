const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

router.get("/", async function (req,res) {
    const login = req.session.login;
    const toutLogin = await db.execute({sql:"SELECT * FROM utilisateur WHERE id= :login",
        args: {login}
    });
    const chantier = await db.execute({sql:"SELECT id, nom_projet FROM chantier WHERE statut = 'actif'",
        args: {} 
    });
    res.render("employe", {login: toutLogin.rows[0],  chantier: chantier.rows}); 
});

router.post('/', async function (req, res){
    const {heureInChiffre, heureOutChiffre, id_chantier, login} = req.body
    if (!heureInChiffre || !heureOutChiffre || !id_chantier || !login) { 
        res.status(403).send(`Erreur - informations manquantes <br><br>
            <a href=/employe><button type='button'>Retour au formulaire</button></a>`)
        return;
    }

    const result = await db.execute ({
        sql: `INSERT INTO horodateur(heure_debut, heure_fin, id_chantier, id_utilisateur)
         VALUES(:heureInChiffre, :heureOutChiffre, :id_chantier, :login)`,
        args: {heureInChiffre, heureOutChiffre, id_chantier, login}
    });
    res.render("ajoutHeure")
})


module.exports = router;
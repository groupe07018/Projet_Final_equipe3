const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

router.get("/", async function (req,res) {
    const employeur = await db.execute({sql:"SELECT profil_administrateur FROM utilisateur",
        args: {}
    })
    if (employeur.rows[0] === 1) {
        res.redirect("patron");
    }
    else {
        res.redirect("employe");
    }
})

/*router.post("/", async function (req,res) {
    const punchIn = await db.execute({sql: "INSERT INTO horodateur (id_chantier, heure_debut) VALUES (":id_chantier = ,
        arg: {heureInChiffre}
     ]})
})*/

module.exports = router;
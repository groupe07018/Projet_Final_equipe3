const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

router.get("/", async function (req,res) {
    const chantier = await db.execute({sql:"SELECT id, nom_projet FROM chantier WHERE statut = 'actif'",
        args: {}
    })
    res.render("employe", {chantier: chantier.rows})
})

/*router.post("/", async function (req,res) {
    const punchIn = await db.execute({sql: "INSERT INTO horodateur (id_chantier, heure_debut) VALUES (":id_chantier = ,
        arg: {heureInChiffre}
     ]})
})*/

module.exports = router;
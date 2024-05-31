const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");


/*router.post("/employe/:id", async function (req,res,next) {
    const {rows} = await db.execute({sql:"SELECT * FROM utilisateur WHERE id= :id",
        args: {id: req.params.id}
    })
    console.log({rows})
    res.render("employe", {utilisateur: rows[0]});
    next();
})*/

router.get("/", async function (req,res) {
    const chantier = await db.execute({sql:"SELECT id, nom_projet FROM chantier WHERE statut = 'actif'",
        args: {}
    })
    console.log({chantier: chantier.rows})
    res.render("employe", {chantier: chantier.rows})
})

module.exports = router;
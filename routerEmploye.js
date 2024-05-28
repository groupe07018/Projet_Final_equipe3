const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");


router.post("/employe/:id", async function (req,res) {
    const {rows} = await db.execute({sql:"SELECT * FROM utilisateur WHERE id= :id",
        args: {id: req.params.id}
    })
    console.log({rows})
    res.render("employe", {utilisateur: rows[0]});
})

router.get("/chantier", async function (req,res) {
    const {rows} = await db.execute({sql:"SELECT nom_projet FROM chantier WHERE statut = 'ouvert'",
        args: {statut}
    })
    console.log({rows})
    res.render("employe", {rows})
})

module.exports = router;
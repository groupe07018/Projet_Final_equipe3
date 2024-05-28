const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

/*
const d = new Date();
document.getElementById("date").innerHTML = d;*/

router.post("./employe", async function (req,res) {
    const {rows} = await db.execute({sql:"SELECT nom_projet FROM chantier WHERE status= ouvert", //comment l'écrire
        args: {nom_projet}
    })
    res.render("employe", {rows})
})

router.get("/afficher", async function (req,res) {
    const {rows} = await db.execute({sql:"SELECT * FROM utilisateur WHERE id = :id",
        args: {id}
    })
    res.render("afficher", rows[0]);
})

module.exports = router;
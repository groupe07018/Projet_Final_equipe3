const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

/*
const d = new Date();
document.getElementById("date").innerHTML = d;*/

router.get("/:id", async function (req,res) {
    const employe = await db.execute({sql:"SELECT * FROM utilisateur WHERE id = :id",
        args: {
            nom: req.body.nom,
            id: req.body.numero
        }
    })
    console.log({employe: employe.rows[0]})
    res.render("employe", {employe: employe.rows[0]});
})

module.exports = router;
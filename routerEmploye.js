const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

/*
const d = new Date();
document.getElementById("date").innerHTML = d;*/

router.get("/afficher", async function (req,res) {
    const {rows} = await db.execute({sql:"SELECT * FROM utilisateur WHERE id = :id",
        args: {id}
    })
    console.log({employe: employe.rows[0]})
    res.render("afficher", rows[0]);
})

module.exports = router;
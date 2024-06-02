const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

router.get("/", async function(req,res) {
    res.render("patron");
})
/*
router.get("/", async function (req,res) {
    const admin = await db.execute({
        sql: "SELECT * FROM utilisateur WHERE login = :login",  
        args: {login},    
    });
    if (admin.rows[0].profil_utilisateur > 0) {
        res.redirect("patron");
    }
    else {
        res.redirect("employe");
    }
})
*/

module.exports = router;
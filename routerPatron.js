const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");
const autorisation = require("./autorisation");

router.get("/", autorisation, async function (req,res) {
    const login = req.session.login;
    const nom = await db.execute({sql:"SELECT login FROM utilisateur WHERE id= :login",
        args: {login}
    })

    res.render("patron", {login: nom.rows[0].login}) 
})


module.exports = router;
const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

router.get("/patron", async function(req,res){
    res.render('patron');
})

router.get("/", async function (req,res) {
    const login = req.session.login;
    const nom = await db.execute({sql:"SELECT login FROM utilisateur WHERE id= :login",
        args: {login}
    })

    res.render("patron", {login: nom.rows[0].login}) 
})


module.exports = router;
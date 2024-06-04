const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");
/*
router.use("/", async function(req, res, next) {
    //const autorisation = req.cookies.autorisation;
    const login = req.session.login;
   const result = await db.execute({          
        sql: "SELECT profil_administrateur FROM utilisateur WHERE login = :login",
        args: { login },
    });
    console.log(login);
    if (result.rows[0].profil_administrateur===1) { 
        next();
    }
    else {
        alert("Vous n'êtes pas autorisé sur cette page");
        res.redirect("employe"); 
    }
})
*/

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
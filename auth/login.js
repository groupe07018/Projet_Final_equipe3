const express =require("express");
const { scryptSync, timingSafeEqual } = require("crypto");
const db = require("../db");
const { createSession, addInfo } = require("../sessions");

const router = express.Router();

router.get("/", async (req,res) => {
    res.render("index");
});

router.post("/", async (req,res) => {
    // Avoir les informations du formulaire
    const login = req.body.login;
    const password = req.body.mot_de_passe;
    if (!login || !password) {
        res.redirect(400, ".");
        return;
    }

    // Vérifier que l'utilisateur existe
    const result = await db.execute({
        sql: "SELECT * FROM utilisateur WHERE login = :login",  
        args: {login},    
    });

    if (result.rows.length === 0) {
        res.send("login ou mot de passe invalide");
        return;
    };

    // Hacher le mot de passe du formulaire avec le salt de l'utilisateur
    const user = (result.rows[0]);
    const hashedPass = scryptSync(
        password,
        user.salt,
        64,
    );

    const correct = timingSafeEqual(
        hashedPass,
        user.password,
    );

    if(correct) {
        addInfo(await createSession(res), {user: login});  //est-ce que je suis encore à l'envers?? user/login
    }
    else {
        res.send("login ou mot de passe invalide");
        return;
    }
    res.redirect("employe");
});

module.exports = router;

const express = require("express");
const { scyptSync, ramdomBytes } = require("crypto");
const db = require("../db");

const { creteSession, addInfo } = require("../sessions");

const router = express.Router();


//à changer
router.get ("/", (req,res) => {
    res.render("ajoutPremierUtilisateur");   
});

router.post("/", async function(req,res) {
    // Aller chercher les informations du formulaire
    const login = req.body.login;
    const password = req.body.mot_de_passe;
    if (!login || !password) {
        res.redirect(400,"."); //à questionner "."
        return;
    }

    // Valider que l'utilisateur n'existe pas déjà
    const result = await db.execute({
        sql:"SELECT 1 FROM utilisateur WHERE login = :login",   // est-ce que le 1 est une erreur
        args: {login},
    });

    if(result.rows.length > 0) {
        res.send("Ce login est déjà utilisé");
        return;
    }

    // Créer le salt et hacher le mot de passe
    const salt = randomBytes(16).toString("hex");
    const hashedPass = scryptSync(password, salt, 64);

    // Ajouter l'utilisateur à la base de données
    db.execute({
        sql: "INSERT INTO utilisateur (login, password, salt) VALUES (:login, :hashedPass, :salt",
        args: {
            login,
            hashedPass,
            salt,
        },
    });

    // Créer la session et lier à l'utilisateur
    addInfo(await createSession(res), { login: login });

    res.redirect("/"); //à changer et vérifier pour des sessions différentes employés/patron
});

module.exports = router;
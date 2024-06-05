const express = require("express");
const { scryptSync, randomBytes } = require("crypto");
const db = require("../db");

const router = express.Router();

//Pour créer le premier utilisateur
router.get ("/ajoutPremierUtilisateur", async (req,res) => {
    const {rows} = await db.execute("SELECT * FROM utilisateur");

        if (rows.length > 0) {
            res.redirect("/");
            return;
        }
    res.render("ajoutPremierUtilisateur");   
});


router.post ("/ajoutPremierUtilisateur", async (req,res) => {
    const {rows} = await db.execute("SELECT * FROM utilisateur");

        if (rows.length > 0) {
            res.redirect("/");
            return;
        }
    // Aller chercher les informations du formulaire
    const login = req.body.login;
    const password = req.body.mot_de_passe;
    const administrateur = req.body.administrateur;
   
    // Créer le salt et hacher le mot de passe
    const salt = randomBytes(16).toString("hex");
    const hashedPass = scryptSync(password, salt, 64);

    // Ajouter l'utilisateur à la base de données
    db.execute({
        sql: `INSERT INTO utilisateur (login, mot_de_passe, salt, profil_administrateur)
         VALUES (?, ?, ?, ?)`, 
        args: [
            login,
            hashedPass,
            salt,
            1
        ]
    });
    
     res.redirect("/"); 
 });
 
router.get ("/", (req,res) => {
    res.render("patron");   
});

router.post("/", async function(req,res) {
    // Aller chercher les informations du formulaire
    const login = req.body.login;
    const password = req.body.mot_de_passe;
    const admin = req.body.profil_administrateur;
    if (!login || !password) {
        res.redirect(400,"/"); 
        return;
    }

    // Valider que l'utilisateur n'existe pas déjà
    const result = await db.execute({
        sql:"SELECT 1 FROM utilisateur WHERE login = :login",  
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
        sql: `INSERT INTO utilisateur (login, mot_de_passe, salt, profil_administrateur)
         VALUES (:login, :hashedPass, :salt, :profil_administrateur)`,
        args: {
            login,
            hashedPass,
            salt,
            profil_administrateur: admin
        },
    });
    
    res.redirect("/patron"); 
});

module.exports = router;
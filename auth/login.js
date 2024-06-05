const express =require("express");
const { scryptSync, timingSafeEqual } = require("crypto");
const db = require("../db");
const { createSession, addInfo } = require("../sessions");

const router = express.Router();

router.get('/', async function (req,res) {
    res.render('index');
});

router.get('/routerEmploye', async function(req,res) {
    res.render('employe');
});

router.get('/routerPatron', async function(req,res) {
    res.render('patron');
});

router.get('/routerChantier', async function(req,res) {
    res.render('listeChantier');
});

router.post('/', async (req,res) => {
    // Avoir les informations du formulaire
    const login = req.body.login;
    const password = req.body.mot_de_passe;
    if (!login || !password) {
        res.redirect("/");
        return;
    }
 
    // Vérifier si c'est le premier utilisateur
    const {rows} = await db.execute("SELECT * FROM utilisateur");

        if (rows.length === 0) {
            res.redirect("signup/ajoutPremierUtilisateur");
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
        }

       
    // Hacher le mot de passe du formulaire avec le salt de l'utilisateur
    const user = (result.rows[0]);
    const hashedPass = scryptSync(
        password,
        user.salt,
        64,
    );

    const correct = timingSafeEqual(
        hashedPass,
        user.mot_de_passe,
    );
    if(correct) {
        addInfo(await createSession(res), {login: user.id});
        if (result.rows[0].profil_administrateur===1) { 
            res.redirect("patron");
        }
        else {
            res.redirect("employe"); 
        }
    }
    else {
        res.send("login ou mot de passe invalide");
        return;
    }
});


module.exports = router;

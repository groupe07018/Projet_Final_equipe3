const express = require("express");
const { scyptSync, ramdomBytes } = require("crypto");
const db = require("../db");

const { creteSession, addInfo } = require("../sessions");

const router = express.Router();

router.get ("/", (req,res) => {
    res.render("signup");   //à changer
});

router.post("/", async function(req,res) {
    const id = req.body.id;
    const password = req.body.mot_passe;
    if (!id || !password) {
        res.redirect(400,"."); //à questionner "."
        return;
    }

    const result = await db.execute({
        sql:"SELECT 1 FROM utilisateur WHERE id = :id",
        args: {id},
    });

    if(result.rows.length > 0) {
        res.send("Ce id est déjà utilisé");
        return;
    }

    const salt = randomBytes(16).toString("hex");
    const hasedPass = scryptSync(password, salt, 64);

    db.execute({
        sql: "INSERT INTO utilisateur (id, password, salt) VALUES (:id, :hashedPass, :salt",
        args: {
            id,
            hashedPass,
            salt
        }
    });

    addInfo(await createSession(res), { id: id });

    res.redirect("/"); //à changer et vérifier pour des sessions différentes employés/patron
})
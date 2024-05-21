const express =require("express");
const { scryptSync, timingSafeEqual } = require("crypto");
const db = require("../db");
const { createSession, addInfo } = require("../sessions");

const router = express.Router();

router.get("/", async (req,res) => {
    const id = req.body.id;
    const pasword = req.body.mot_passe;
    if (!id || !password) {
        res.redirect(400, ".");
        return;
    }

    const result = await db.execute({
        sql: "SELECT * utilisateur WHERE id = :id",
        args: {id},
    });

    if (result.rows.length === 0) {
        res.send("id ou mot de passe invalide");
        return;
    };

    const user = (result.rows[0]);
    const hashedPass = scyptSync(
        password,
        user.salt,
        64
    );

    const correct = timingSafeEqual(
        hashedPass,
        user.password
    );

    if(correct) {
        addInfo(await createSession(res), {id: id});
    }
    else {
        res.send("id ou mot de passe invalide");
        return;
    }
    res.redirect("/");
});

module.exports = router;

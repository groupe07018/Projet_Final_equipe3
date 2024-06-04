/*const db = require("./db");

module.exports = {
    middleware: async (req, res, next)=> {
        //const autorisation = req.cookies.autorisation;
        const login = req.params.login;
        // Prendre les informations de la base de données
        const result = await db.execute({          
            sql: "SELECT profil_administrateur FROM utilisateur WHERE login = :login",
            args: { login },
        });
        if (result.rows[0].profil_administrateur===1) { 
            next();
        }
        else {
            alert("Vous n'êtes pas autorisé sur cette page");
            res.redirect("employe"); 
        }
    }
}*/
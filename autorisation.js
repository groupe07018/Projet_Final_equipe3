const db = require("./db");

module.exports =  async (req, res, next)=> {
        const profilLogin = req.session.login;
        const profil = await db.execute({sql:`SELECT profil_administrateur FROM utilisateur WHERE id= :profilLogin`,
            args: {profilLogin}
        });
        if(profil.rows[0].profil_administrateur===1) {
            next();
        }
        else{
            res.redirect("/employe"); 
        };
    }

const jwt = require('jsonwebtoken');

module.exports = () => {
    return async(req,res,next)=>{
        console.log("autorisation middleware");
        const result = await db.execute ({sql: `SELECT profil_administrateur FROM utilisateur WHERE id= :id`,
        args: {id},
        })
        if(result.rows[0].profil_administrateur!=1) {
            return res.status(401).send("Accès refusé");
        }
        next();
    }
}
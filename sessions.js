const db = require("./db");

module.exports = {
    middleware: async (req, res, next)=> {
        const session = req.cookies.session;

        // S'il n'y a pas d'id de session, ne pas aller chercher les info
        if(!session) {
            if(req.url=="/" || req.url=="/login" || req.url=="/signup/ajoutPremierUtilisateur") {
                next();
                return;
            };
            res.redirect("/");
            return;
        }
            
        

        // Prendre les informations de la base de données
        const result = await db.execute({
            sql: "SELECT * FROM session WHERE id = :session",
            args: { session },
        });

        // Ajouter la session à la requête
        req.session = result.rows[0];
        next();
    },

    //Créer une nouvelle session et retourne l'id
    createSession: async (res) => {

        // Créer un id de session unique
        let uuid = crypto.randomUUID();
        while(
            (await db.execute({
                sql: "SELECT 1 FROM session WHERE id = :uuid",
                args: { uuid },
                })
            ).rows.length > 0
        ) {
            uuid = crypto.randomUUID();
        }

        // Créer la session dans la BD
        db.execute({
            sql: "INSERT INTO session (id) VALUES (:uuid)",
            args: { uuid },
        });

        res.cookie("session", uuid);

        return uuid;
    },

    addInfo: (sessionId, info) => {
        /*
    Modifier la session en fonction de l'objet info,
    chaque propriété dans l'objet a le nom de la colonne
    à modifier et sa valeur est la valeur à mettre dans
    la colonne.
    */
        db.execute({
            sql: "UPDATE session SET " + 
            Object.entries(info) // Pour toutes les propiétés dans l'objet info
            .map((x) => x[0] + " = :" + x[0])  // Transforme en "prop = :prop"
            .join(", ") +   // Joint les propriétés avec des virgules entre
            " WHERE id = :sessionId;",
            args: {...info, sessionId},
        });
    },
};
const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const db = require("./db");

router.get("/", async function (req,res) {
    const chantier = await db.execute({sql:"SELECT id, nom_projet FROM chantier WHERE statut = 'actif'",
        args: {}
    })
    res.render("employe", {chantier: chantier.rows})
})

router.get("/employe/:login", async function (req,res) {
    const user = await db.execute({sql: "SELECT * FROM utilisateur WHERE id = :login",
        args: {login: req.params.login}
    })
    res.render("employe", {login: user.rows});
    ;
}); ///à régler, cela n'affiche pas le login dans la page employé


/*router.post("/ajoutHeure", async function (req,res) {
    const punchIn = await db.execute({sql: `INSERT INTO horodateur (id_utilisateur, id_chantier, heure_debut)
     VALUES (":id_utilisateur, :id_chantier, :heure_debut") `,
        arg: {heureInChiffre}
     ]})
})*/

router.post('/ajoutHeureDebut', async function(req, res){
    const {rows} = req.body;
    const result = await db.execute ({
        sql: "INSERT INTO horodateur(id_utilisateur, id_chantier, heure_debut) VALUES(:id_utilisateur, :id_chantier, :heureInChiffre)",
        args: {id_utilisateur, id_chantier, heureInChiffre}
    });
})
///rendu ici à réfléchir
router.post('/ajoutHeureFin', async function(req, res){
    const {rows} = req.body;
    const result = await db.execute ({
        sql: "INSERT INTO horodateur(heure_fin) VALUES(:id_utilisateur, :id_chantier, :heure_debut)",
        args: {id_utilisateur, id_chantier, heure_debut}
    });
})

   /* res.render("", 
        {message: `<div class='alert alert-success alert-dismissible'>
                    <button type='button' class='btn-close' data-bs-dismiss='alert'></button>Ajout effectué avec succès</div>`})
*/

module.exports = router;
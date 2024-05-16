const express = require('express');
const router = express.Router();

router.get('/facture', function(req, res){
    res.render("facture")
})

module.exports = router;
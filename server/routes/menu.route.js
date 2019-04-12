var express = require('express');
var router = express.Router();
const menuProvider = require('../services/menu.provider');

router.get('/menu', function (req, res, next) {
  menuProvider.get()
    .then(result => res.json(result))
    .catch(next);
});

module.exports = router;

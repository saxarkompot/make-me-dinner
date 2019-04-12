var express = require('express');
var router = express.Router({ mergeParams: true });
const orderProvider = require('../services/order.provider');

router.get('/', function (req, res, next) {
	orderProvider.get(req.params.userId)
		.then(result => res.json(result))
		.catch(next);
});

router.post('/', function (req, res, next) {
	orderProvider.add(req.params.userId || req.body.userId, req.body.dishId)
		.then(result => res.json(result))
		.catch(next);
});

router.delete('/', function (req, res, next) {
	orderProvider.delete(req.params.userId || req.body.userId, req.body.dishId)
		.then(result => res.json(result))
		.catch(next);
});

module.exports = router;

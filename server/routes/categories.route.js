var express = require('express');
var router = express.Router();
const categoryProvider = require('../services/category.provider');

router.param('categoryId',
	function (req, res, next) {
    req.params.imageContext = 'category_' + req.params.categoryId;
		next();
	});

router.get('/', function (req, res, next) {
  categoryProvider.get()
    .then(result => res.json(result))
    .catch(next);
});

router.post('/', function (req, res, next) {
  categoryProvider.add(req.body)
    .then(result => res.json(result))
    .catch(next);
});

router.put('/:categoryId', function (req, res, next) {
  categoryProvider.update(Object.assign(req.body, {id: req.params.categoryId}))
    .then(result => res.json(result))
    .catch(next);
});

router.get('/:categoryId', function (req, res, next) {
  categoryProvider.getById(req.params.categoryId)
    .then(result => res.json(result))
    .catch(next);
});

router.delete('/:categoryId', function (req, res, next) {
  categoryProvider.delete(req.params.categoryId)
    .then(result => res.json(result))
    .catch(next);
});

router.use('/:categoryId/images', require('./images.route'));
router.use('/:categoryId/dishes', require('./dishes.route'));

module.exports = router;

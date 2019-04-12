var express = require('express');
var router = express.Router({ mergeParams: true });
const dishProvider = require('../services/dish.provider');

router.get('/', function (req, res, next) {
  dishProvider.get(req.params.categoryId)
    .then(result => res.json(result))
    .catch(next);
});

router.post('/', function (req, res, next) {
  dishProvider.add(Object.assign(req.body, { categoryId: req.params.categoryId || req.body.categoryId }))
    .then(result => res.json(result))
    .catch(next);
});

router.put('/:dishId', function (req, res, next) {
  dishProvider.update(
    Object.assign(req.body, {
      id: req.params.dishId,
      categoryId: req.params.categoryId || req.body.categoryId
    })
  )
    .then(result => res.json(result))
    .catch(next);
});

router.get('/:dishId', function (req, res, next) {
  dishProvider.getById(req.params.dishId)
    .then(result => res.json(result))
    .catch(next);
});

router.delete('/:dishId', function (req, res, next) {
  dishProvider.delete(req.params.dishId)
    .then(result => res.json(result))
    .catch(next);
});

module.exports = router;

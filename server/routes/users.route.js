var express = require('express');
var router = express.Router();
const userProvider = require('../services/user.provider');

router.param('userId',
function (req, res, next) {
	req.params.userId = req.params.userId == 'me' ? req.user.id : req.params.userId;
	next();
});

/* GET user info. */
router.get('/:userId', function (req, res, next) {
	userProvider.getById(req.params.userId)
	.then(result => res.json(result))
	.catch(next);
});

router.use('/:userId/orders', require('./orders.route'));

router.get('/', function (req, res, next) {
	userProvider.get()
	.then(result => res.json(result))
	.catch(next);
  });
  
  router.post('/', function (req, res, next) {
	userProvider.add(Object.assign(req.body, { userId: req.params.userId || req.body.userId }))
	  .then(result => res.json(result))
	  .catch(next);
  });
  
  router.put('/:userId', function (req, res, next) {
	userProvider.update(
	  Object.assign(req.body, {
		id: req.params.userId,
		userId: req.params.userId || req.body.userId
	  })
	)
	  .then(result => res.json(result))
	  .catch(next);
  });
   
  router.delete('/:userId', function (req, res, next) {
	userProvider.delete(req.params.userId)
	  .then(result => res.json(result))
	  .catch(next);
  });
  
	module.exports = router;





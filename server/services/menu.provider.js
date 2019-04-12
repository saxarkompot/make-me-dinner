const db = require('../models/db');

module.exports = {
	get: function () {
		return db.Category.findAll({
				include: [{
					all: true // model: db.Dish, as: 'dishes'
				}]
			})
			.then(categories => ({
				'categories': categories,
				'name': 'Tetcher'
			}));
	}
}
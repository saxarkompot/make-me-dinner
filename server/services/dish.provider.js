const db = require('../models/db');
const errors = require('./errors/errors');

module.exports = {
	get: function (categoryId) {
		return db.Dish.findAll({
			where: { categoryId: categoryId }
		});
	},

	getById: function (dishId) {
		return db.Dish.findById(dishId).then(dish =>
			dish || Promise.reject(new errors.NotFound("Dish is not found")));
	},

	add: function (dish) {
		return db.Dish.create(dish);
	},

	update: function (propsToUpdate) {
		return db.Dish.findById(propsToUpdate.id).then(dish => dish
			? Object.assign(dish).update(propsToUpdate)
			: Promise.reject(new errors.NotFound("Dish is not found"))
		);
	},

	delete: function (id) {
		return db.Dish.destroy({
			where: { id: id }
		});
	}
}
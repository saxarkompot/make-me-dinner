const db = require('../models/db');
const errors = require('./errors/errors');

module.exports = {
	get: function () {
		return db.Category.findAll({
			include: [{
				model: db.Dish, as: 'dishes'
			}]
		})
	},

	getById: function (categoryId) {
		return db.Category.findById(categoryId).then(category =>
			category || Promise.reject(new errors.NotFound("Category is not found")));
	},

	add: function (category) {
		return db.Category.create(category).catch(err => err instanceof db.Sequelize.ValidationError
			? (err instanceof db.Sequelize.UniqueConstraintError 
				? Promise.reject(new errors.BadRequest("UniqueConstraintError (Category already exist)"))
				: Promise.reject(new errors.BadRequest("Validation error (Category name must contain only a-z and A-Z)")))
			: Promise.reject(err));
	},

	update: function (propsToUpdate) {
		return db.Category.findById(propsToUpdate.id).then(category => category
			? Object.assign(category).update(propsToUpdate).catch(err => err instanceof db.Sequelize.ValidationError
				? (err instanceof db.Sequelize.UniqueConstraintError 
					? Promise.reject(new errors.BadRequest("UniqueConstraintError (Category already exist)"))
					: Promise.reject(new errors.BadRequest("Validation error (Category name must contain only a-z and A-Z)")))
				: Promise.reject(err))				
			: Promise.reject(new errors.NotFound("Category is not found"))
		);
	},

	delete: function (id) {
		return db.Category.destroy({
			where: { id: id }
		});
	}
}
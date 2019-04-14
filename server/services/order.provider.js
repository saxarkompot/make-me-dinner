const db = require('../models/db');
const errors = require('./errors/errors');

module.exports = {
	get: function (userId) {
		let whereClause = {
			date: new Date(new Date().setHours(0, 0, 0, 0))
		};
		if (userId)
			whereClause.userId = userId;

		return db.Order.findAll({
			where: whereClause,
			include: [{
				all: true // model: db.Dish, as: 'dish'
			}]
		})
	},
	add: function (userId, dishId) {
		return db.Order.findOrCreate({
			where: {
				userId: userId,
				dishId: dishId,
				date: new Date(new Date().setHours(0, 0, 0, 0))
			},
			defaults: {
				userId: userId,
				dishId: dishId,
				date: new Date(new Date().setHours(0, 0, 0, 0)),
				amount: 1
			}
		})
			.spread((order, created) => created
				? order
				: Object.assign(order, { amount: order.amount + 1 }).save());
	},
	delete: function (userId, dishId) {
		return db.Order.find({
			where: {
				userId: userId,
				dishId: dishId,
				date: new Date(new Date().setHours(0, 0, 0, 0))
			}
		})
			.then(order => {
				if (order)
					return order.amount <= 1
						? order.destroy()
						: Object.assign(order, { amount: order.amount - 1 }).save();
				else
					throw new errors.NotFound("Order is not found");
			});
	}
}
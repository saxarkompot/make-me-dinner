'use strict';
module.exports = function (sequelize, DataTypes) {
	var Order = sequelize.define('Order', {
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		classMethods: {
			associate: (db) => {
				db.Order.belongsTo(db.Dish, {
					as: 'dish',
					foreignKey: { allowNull: false },
					onDelete: 'CASCADE'
				});
			}
		}
	});
	return Order;
};
'use strict';
module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define('User', {
		name: { type: DataTypes.STRING, 
				allowNull: false,
		 validate: { min: 2, max:20, is: ["^[a-z]+$",'i'] }},

		lastName: { type: DataTypes.STRING, 
			allowNull: false,
		 validate: { min: 2, max:20, is: ["^[a-z]+$",'i'] }},

		email:{ type: DataTypes.STRING, 
			allowNull: false,			 
			 validate: {len: [2,50], isEmail: true},
			 unique : true},
			
		isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
		},	{
		freezeTableName: true,
		classMethods: {
			associate: function (db) {
				db.User.hasMany(db.Order, {
					as: 'orders',
					foreignKey: { name: 'userId', allowNull: false },
					onDelete: 'CASCADE'
				});
			}
		}
	});
	return User;
	};



'use strict';
module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define('Image', {
		context: DataTypes.STRING,
		content: DataTypes.BLOB
	}, {
		freezeTableName: true,
		classMethods: {
			associate: function (db) {
			}
		}
	});
	return User;
};
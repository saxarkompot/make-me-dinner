'use strict';
const db = require('../models/db');

module.exports = {
	up: function (queryInterface, Sequelize) {
		return db.sequelize.sync({
			force: true
		});
	},

	down: function (queryInterface, Sequelize) {}
};
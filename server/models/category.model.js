module.exports = function (sequelize, DataTypes) {
	const model = sequelize.define('Category', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { min: 2, max:20, is: ["^[a-z]+$",'i'] },
			unique : true},

		imageUrl: DataTypes.STRING
	}, {
		freezeTableName: true,
		classMethods: {
			associate: (db) => {
				db.Category.hasMany(db.Dish, {
					as: 'dishes',
					foreignKey: { name: 'categoryId', allowNull: false }
				});
			}
		}
	});

	return model;
};
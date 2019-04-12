module.exports = function (sequelize, DataTypes) {
	const model = sequelize.define('Category', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { min: 2, max:20, is: ["^[a-z]+$",'i'] },
			unique : true},

		imageUrl: {
			type: DataTypes.VIRTUAL,
			get: function(){
				return 'http://localhost:3001/categories/' + this.getDataValue('id') + '/images/default'
			}
		}
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
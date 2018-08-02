'use strict';
module.exports = (sequelize, DataTypes) => {
	var category = sequelize.define('category', {
		name: DataTypes.STRING,
		deleted: DataTypes.BOOLEAN
	}, {});
	category.associate = function (models) {
		models.category.hasMany(models.article, { onDelete: 'cascade', hooks: true });
		models.category.belongsTo(models.user); // Author of category
	};
	return category;
};
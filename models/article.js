'use strict';

var moment = require('moment');

module.exports = (sequelize, DataTypes) => {
	var article = sequelize.define('article', {
		title: DataTypes.STRING,
		subtitle: DataTypes.STRING,
		content: DataTypes.TEXT,
		deleted: DataTypes.BOOLEAN,
		createdAtFormatted: {
			type: DataTypes.VIRTUAL,
			get: function() {
				return moment(this.createdAt, 'YYYY-MM-DDTHH:mm', false).format('MMMM Do, YYYY hh:mma');
			}
		}
	}, {});
	article.associate = function (models) {
		models.article.belongsTo(models.user);
		models.article.belongsTo(models.category);
		models.article.hasMany(models.comment, { onDelete: 'cascade', hooks: true });
	};
	article.maxPerPage = 10;
	return article;
};
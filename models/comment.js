'use strict';

var moment = require('moment');

module.exports = (sequelize, DataTypes) => {
	var comment = sequelize.define('comment', {
		body: DataTypes.TEXT,
		deleted: DataTypes.BOOLEAN,
		createdAtFormatted: {
			type: DataTypes.VIRTUAL,
			get: function() {
				return moment(this.createdAt, 'YYYY-MM-DDTHH:mm', false).format('MMMM Do, YYYY hh:mma');
			}
		}
	}, {});
	comment.associate = function (models) {
		models.comment.belongsTo(models.user);
		models.comment.belongsTo(models.article);
		models.comment.belongsTo(models.comment, {
			as: 'parent',
			foreignKey: 'parentId' // we need to specify the column name since its an association with itself
		});
		models.comment.hasMany(models.comment, { as: 'children', foreignKey: 'parentId', onDelete: 'cascade', hooks: true });
	};
	comment.maxPerPage = 10; // How many to load before loading the rest
	return comment;
};
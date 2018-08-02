'use strict';

var bcrypt = require('bcrypt');
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {
	var user = sequelize.define('user', {
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		image: DataTypes.STRING,
		admin: DataTypes.INTEGER,
		createdAtFormatted: {
			type: DataTypes.VIRTUAL,
			get: function() {
				return moment(this.createdAt, 'YYYY-MM-DDTHH:mm', false).format('MMMM Do, YYYY hh:mma');
			}
		}
	}, 
	{
        hooks: {
            beforeCreate: (user, options) => {
                return bcrypt.hash(user.password, 10).then(hash => {
                    user.password = hash;
                })
            },
        }
    });
	user.associate = function (models) {
		models.user.hasMany(models.article, { onDelete: 'cascade', hooks: true });
		models.user.hasMany(models.comment, { onDelete: 'cascade', hooks: true });
	};
	return user;
};
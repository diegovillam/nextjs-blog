var functions = require('../functions.js');
var express = require('express');
var sequelize = require('sequelize');
var router = express.Router();
var models = require('../../models');

router.get('/admin/stats', functions.isUser, async (req, res, next) => {
    try {
        let articlesCount   = await models.article.count({ where: { deleted: { [sequelize.Op.is]: null } } });
        let usersCount      = await models.user.count();
        let categoriesCount = await models.category.count({ where: { deleted: { [sequelize.Op.is]: null } } });
        let commentsCount   = await models.comment.count({ where: { deleted: { [sequelize.Op.is]: null } } })
        return res.status(200).json({ articlesCount, usersCount, categoriesCount, commentsCount });
    } catch(err) {
        return res.status(500).json(err);
    }
});
module.exports = router;
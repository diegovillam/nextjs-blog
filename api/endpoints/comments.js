var functions = require('../functions.js');
var express = require('express');
var router = express.Router();
var models = require('../../models');
var sequelize = require('sequelize');

router.get('/comments/:article', (req, res, next) => {
    const limit = Number(req.query.limit) || undefined;
    console.log('Limit: ', limit);

    models.comment.findAll({
        where: {
            deleted: { [sequelize.Op.is]: null },
            parentId: { [sequelize.Op.is]: null },
            articleId: req.params.article
        },
        include: [{
            model: models.user,
            attributes: ['id', 'username', 'image']
        }, {
            model: models.comment,
            as: 'children',
            include: [{
                model: models.user,
                attributes: ['id', 'username', 'image']
            }]
        }],
        order: [['createdAt', 'DESC']],
        limit
    }).then(async (comments) => {
        // Get the total count of parent comments
        let totalCommentCount = await models.comment.count({
            where: {
                deleted: { [sequelize.Op.is]: null },
                articleId: req.params.article
            }
        });
        let rootCommentCount = await models.comment.count({
            where: {
                deleted: { [sequelize.Op.is]: null },
                parentId: { [sequelize.Op.is]: null },
                articleId: req.params.article
            }
        });
        // Now return the result
        return res.status(200).json({ comments, totalCommentCount, rootCommentCount });
    }).catch(err => {
        return res.status(500).json(err);
    })
});

router.put('/comments/:id/status', functions.isAdmin, (req, res, next) => {
    let { comment } = req.body;
    models.comment.findOne({
        where: { id: comment.id },
        include: [{
            model: models.article
        }]
    }).then(found => {
        if(!found) {
            return res.status(400).json({ error: 'This comment does not exist.'});
        }
        // Set it to true or to null
        let status = found.deleted ? null : true;
        if(found.article.userId !== req.user.id && req.user.admin < 2) {
            return unauthorized(res);
        }
        found.update({
            deleted: status
        }).then(() => {
            return res.status(200).end();
        }).catch(err => {
            return res.status(500).json(err);
        });
    }).catch(err => {
        return res.status(500).json(err);
    });
});

router.post('/comments', functions.isUser, (req, res, next) => {
    const { id, comment } = req.body;
    if(!id || id === undefined) {
        // No error to be displayed: impossible to get this error on client
        return res.status(400).end();
    }
    if(!comment || comment === undefined || !comment.length) {
        return res.status(400).json({ errors: { comment: 'The comment is required.' } });
    }
    const options = {
        articleId: req.body.id,
        userId: req.user.id,
        body: req.body.comment
    };
    // Append the parent ID if the request sends one
    if(req.body.parent) {
        options.parentId = req.body.parent;
    }
    let newComment = models.comment.build(options);
    newComment.save().then(newComment => {
        return res.status(200).json({
            comment: newComment,
            user: req.user
        });
    }).catch(err => {
        return res.status(500).json(err);
    })
});

module.exports = router;
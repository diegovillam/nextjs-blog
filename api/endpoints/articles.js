var functions = require('../functions.js');
var express = require('express');
var sequelize = require('sequelize');
var router = express.Router();
var models = require('../../models');

router.put('/articles/:id', functions.isAdmin, (req, res, next) => {
    let requiredKeys = ['title', 'content'], errors = {};
    let { article } = req.body;
    requiredKeys.forEach(key => {
        if(article[key] === undefined || !article[key]) {
            errors[key] = `The ${key} is required.`;
        }
    });
    if(Object.keys(errors).length) {
        return res.status(400).json(errors);
    }
    models.article.findOne({
        where: { id: article.id },
    }).then(found => {
        if(!found || found.deleted) {
            return res.status(400).json({ errors: {title: "This article does not exist. Are you sure it has not been deleted? "} });
        }
        if(found.userId !== req.user.id && req.user.admin < 2) {
            return functions.unauthorized(res);
        }
        found.update({ 
            title: article.title,
            subtitle: article.subtitle || null,
            content: article.content
         }).then(() => {
            return res.status(200).end();
        }).catch(err => {
            return res.status(500).json(err);
        });
    }).catch(err => {
        return res.status(500).json(err);
    });
});
router.delete('/articles/:id', functions.isAdmin, (req, res, next) => {
    models.article.findOne({
        where: { id: req.params.id }
    }).then(article => {
        let exists = true;
        if(!article) {
            exists = false;
        } else {
            if(article.deleted) {
                exists = false;
            }
        }
        if(!exists) {
            return res.status(400).json({error: "This article no longer exists. Are you sure it has not been deleted already?"});
        } else {
            if(article.userId !== req.user.id && req.user.admin < 2) {
                return functions.unauthorized(res);
            }
            article.update({
                deleted: true
            }).then(() => { return res.status(200).end() });
        }
    }).catch(err => {
        return res.status(500).json(err);
    });
});
router.get('/articles/:id', (req, res, next) => {
    models.article.findOne({
        where: { id: req.params.id }, 
        include: [{ 
            model: models.user,
            attributes: ['id', 'username']  
        }, {
            model: models.category
        }],
    }).then(article => {
        return res.status(200).json(article);
    }).catch(err => {
        return res.status(500).json(err);
    });
});
router.get('/articles', (req, res, next) => {
    const category = req.query.category || undefined;
    const search   = req.query.search ||  undefined;
    const user     = req.query.user  || undefined;
    const page     = req.query.page || 0;
    const limit    = models.article.maxPerPage;
    const offset   = page * limit;

    // Build our criteria object
    const where = {
        deleted: {
            [sequelize.Op.is]: null
        }
    };
    // If we are searching we will append a group of OR conditionals to also find items matching criteria
    if(search) {
        where[sequelize.Op.or] = {
            content: {
                [sequelize.Op.like]: `%${search}%`
            },
            title: {
                [sequelize.Op.like]: `%${search}%`
            },  
            subtitle: {
                [sequelize.Op.like]: `%${search}%`
            }
        }
    }
    // If we are filtering by category
    if(category) {
        where.categoryId = category;
    }
    // If we are filtering by user
    if(user) {
        where.userId = user;
    }
    models.article.findAll({
        where: where,
        include: [{
            model: models.user,
            attributes: ['id', 'username']
        }, {
            model: models.comment,
            include: [{
                model: models.user,
                attributes: ['id', 'username']
            }]
        }, {
            model: models.category
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
    }).then(async (articles) => {
        // Get total amount of articles so that we can build the pagedata
        let total = await models.article.count({ where: where });
        let pagedata = functions.buildPageData(total, page, limit);
        return res.status(200).json({articles, pagedata});
    }).catch(err => {
        console.log('Big error: ', err);
        return res.status(500).json(err);
    });
});
router.post('/article', functions.isAdmin, (req, res, next) => {
    let requiredKeys = ['title', 'content', 'category'], errors = {};
    let { article } = req.body;
    requiredKeys.forEach(key => {
        if(article[key] === undefined || !article[key]) {
            errors[key] = `The ${key} is required.`;
        }
    });
    if(Object.keys(errors).length) {
        return res.status(400).json(errors);
    }
    let newArticle = models.article.build({
        title: article.title,
        subtitle: article.subtitle || null,
        content: article.content,
        categoryId: article.category,
        userId: req.user.id
    });
    newArticle.save().then(newArticle => {
        return res.status(200).json({
            article: newArticle
        });
    }).catch(err => {
        return res.status(500).json(err);
    })
});

module.exports = router;
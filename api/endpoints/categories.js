var functions = require('../functions.js');
var sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
var models = require('../../models');

router.put('/categories/:id', functions.isAdmin, (req, res, next) => {
    let requiredKeys = ['name'], errors = {};
    let { category } = req.body;
    requiredKeys.forEach(key => {
        if(category[key] === undefined || !category[key]) {
            errors[key] = `The ${key} is required.`;
        }
    });
    if(Object.keys(errors).length) {
        return res.status(400).json(errors);
    }
    models.category.findOne({
        where: { id: category.id },
    }).then(found => {
        if(!found) {
            return res.status(400).json({ errors: {name: "This category does not exist. Are you sure it has not been deleted? "} });
        }
        if(found.userId !== req.user.id && req.user.admin < 2) {
            return unauthorized(res);
        }
        found.update({ 
            name: category.name
         }).then(() => {
            return res.status(200).end();
        }).catch(err => {
            return res.status(500).json(err);
        });
    }).catch(err => {
        return res.status(500).json(err);
    });
});

router.delete('/categories/:id', functions.isAdmin, (req, res, next) => {
    models.category.findOne({ 
        where: { id: req.params.id }
    }).then(category => {
        let exists = true;
        if(!category) {
            exists = false;
        }
        if(!exists) {
            return res.status(400).json({error: "This category no longer exists. Are you sure it has not been deleted already?"});
        } else {
            if(category.userId !== req.user.id && req.user.admin < 2) {
                return unauthorized(res);
            }
            category.update({
                deleted: true
            }).then(() => { return res.status(200).end() });
        }
    }).catch(err => {
        return res.status(500).json(err);
    });
});

router.get('/categories', (req, res, next) => {
    models.category.findAll({
        where: { deleted: { [sequelize.Op.is]: null } },
        include: [{
            model: models.user,
            attributes: ['id', 'username']
        }]
    }).then(categories => {
        return res.status(200).json(categories);
    }).catch(err => {
        return res.status(500).json(err);
    });
});

router.put('/categories/:id', functions.isAdmin, (req, res, next) => {
    let requiredKeys = ['name'], errors = {};
    let { category } = req.body;
    requiredKeys.forEach(key => {
        if(category[key] === undefined || !category[key]) {
            errors[key] = `The ${key} is required.`;
        }
    });
    if(Object.keys(errors).length) {
        return res.status(400).json(errors);
    }
    models.category.findOne({
        where: { id: category.id },
    }).then(found => {
        if(!found) {
            return res.status(400).json({ errors: {name: "This category does not exist. Are you sure it has not been deleted? "} });
        }
        if(found.userId !== req.user.id && req.user.admin < 2) {
            return unauthorized(res);
        }
        found.update({ 
            name: category.name
         }).then(() => {
            return res.status(200).end();
        }).catch(err => {
            return res.status(500).json(err);
        });
    }).catch(err => {
        return res.status(500).json(err);
    });
});

router.post('/categories', functions.isAdmin, (req, res, next) => {
    let requiredKeys = ['name'], errors = {};
    let { category } = req.body;
    requiredKeys.forEach(key => {
        if(category[key] === undefined || !category[key]) {
            errors[key] = `The ${key} is required.`;
        }
    });
    if(Object.keys(errors).length) {
        return res.status(400).json(errors);
    }
    let newCategory = models.category.build({
        name: category.name,
        userId: req.user.id
    });
    newCategory.save().then(newCategory => {
        return res.status(200).json({
            category: newCategory
        });
    }).catch(err => {
        return res.status(500).json(err);
    })
});

module.exports = router;
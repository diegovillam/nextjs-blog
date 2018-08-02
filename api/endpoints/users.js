var functions = require('../functions.js');
var express = require('express');
var router = express.Router();
var models = require('../../models');
var middleware = require('../../middleware.js');
var fs = require('fs');

router.get('/users/:username', (req, res, next) => {
    // Build our include object beforehand
    const include = req.query.include_articles ? [{
        model: models.article,
        limit: 3,
        include: [{
            model: models.user,
            attributes: ['id', 'username']
        }, {
            model: models.comment
        }]
    }] : undefined;

    models.user.findOne({
        where: { username: req.params.username },
        attributes: {
            exclude: ['password']
        },
        include: include
    }).then(user => {
        return res.status(200).json(user);
    }).catch(err => {
        return res.status(500).json(err);
    })
});

router.post('/users/image', [functions.isUser, middleware.upload.single('file')], (req, res, next) => {
    const { filename } = req.file;

    models.user.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ['password'] }
    }).then(user => {
        if(user.image) {
            // Delete the image that might already exist
            fs.unlinkSync(`static/uploads/${user.image}`);
        }
        user.update({
            image: req.file.filename
        }).then(() => {
            return res.status(200).end();
        }).catch(err => {
            return res.status(500).json(err);
        });
    });
    /*
    console.log('Files: ', req.files);
    console.log('Req body: ', req.body);

    let imageFile = req.body.file;
    console.log('imageFile: ', imageFile);
    //imageFile.mv(`${__dirname}/public/${req.body.`)
    */

    return res.status(200).end();
});

module.exports = router;
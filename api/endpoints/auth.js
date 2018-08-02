var express = require('express');
var router = express.Router();
var models = require('../../models');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jwt_config = require('../../config/jwt.json');

router.post('/register', async (req, res, next) => {
    if(!req.body.username.trim().length || !req.body.username.trim().length) {
        let errors = {};
        if(!req.body.username.trim().length) errors.username = 'The username is required';
        if(!req.body.password.trim().length) errors.password = 'The password is required.';
        return res.status(400).json({
            success: false, errors
        });
    } 
    // Check if an user already exists
    let existing = await models.user.findOne({ where: { username: req.body.username }});
    if(existing) {
        return res.status(400).json({
            success: false,
            errors: {
                username: "This username is already registered."
            }
        });
    }
    
    let user = models.user.build({
        username: req.body.username.trim(),
        password: req.body.password.trim()
    });
    user.save().then(user => {
        return res.status(200).json({
            success: true,
            user
        });
    }).catch(error => {
        return res.status(400).json({
            success: false
        });
    })
});

router.post('/login', (req, res, next) => {
    if(!req.body.username.trim().length || !req.body.username.trim().length) {
        let errors = {};
        if(!req.body.username.trim().length) errors.username = 'The username is required';
        if(!req.body.password.trim().length) errors.password = 'The password is required.';
        return res.status(400).json({
            success: false, errors
        });
    } 
    let { username, password } = req.body;
    models.user.findOne({ where: { username: username }}).then(user => {
        if(!user) {
            return noUserError(res, username);
        }
        bcrypt.compare(password, user.password).then(matches => {
            if(!matches) {
                return res.status(401).json({
                    success: false,
                    errors: {username: 'Invalid username and password combination.', password: 'Invalid username and password combination.'}
                });
            }
            let payload = { sub: user.id };
            let token = jwt.sign(payload, jwt_config.secret);
            return res.status(200).json({
                success: true,
                token, user
            });
        });
    }).catch(error => {
        return noUserError(res, username);
    });
    // Closure function to return error if the specified username is not found
    function noUserError(res, username) {
        return res.status(400).json({
            success: false,
            errors: {username: `The username ${username} is not registered in the database.`}
        });
    }
});

router.get('/users/:token', (req, res, next) => {
    if(!('token' in req.params)) {
        return res.status(301).end();
    } 
    let token = req.params.token;
    jwt.verify(token, jwt_config.secret, (err, decoded) => {
        if(err) return res.status(500).json(err);
        let user = decoded.sub;
        models.user.findById(user, {attributes: { exclude: ['password'] }}).then(user => {
            if(!user || user === null) {
                return res.status(301).json({
                    success: false
                });
            }
            return res.status(200).json({
                success: true,
                user: user
            });
        });
    });
});

module.exports = router;
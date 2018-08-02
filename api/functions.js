var models = require('../models');
const jwt = require('jsonwebtoken')
const jwt_config = require('../config/jwt.json');

const unauthorized = (res) => {
    return res.status(401).json({error: "Unauthorized request"});
}

const buildPageData = (count, page, maxPerPage) => {
    page = Number(page); // Since page is a query parameter, it's a string, convert it to a Number
    // Build our object
    let pagedata = {
        hasPrevious: page > 0,
        hasNext: count > ((page + 1) * maxPerPage),
        current: page
    };
    return pagedata;
}

const isAdmin = async (req, res, next) => {
	try {
		console.log('Cookies: ', req.cookies);
		console.log('Session: ', req.session);
		console.log('Headers: ', req.headers);
		await jwt.verify(req.cookies['id_token'], jwt_config.secret, (err, decoded) => {
			if(!decoded) {
				console.log('Decoded is null');
				return unauthorized(res);
			}
			let user = decoded.sub;
			models.user.findById(user, { attributes: { exclude: ['password'] } }).then(user => {
				console.log('User: ', user)
                if(!user || user.admin === 0) return unauthorized(res);
                // Append the admin user to the request
                req.user = user;
				next();
				return;
			});
		});
	} catch (err) {
		console.log('Server Error (isAdmin) ', err);
		return unauthorized(res);                       
	}
}


const isUser = async (req, res, next) => {
    try {
		await jwt.verify(req.cookies['id_token'], jwt_config.secret, (err, decoded) => {
			if(!decoded) {              
				console.log('Decoded is null');
				return unauthorized(res);
			}
			let user = decoded.sub;
			models.user.findById(user, { attributes: { exclude: ['password'] } }).then(user => {
                if(!user) return unauthorized(res);
                // Append the user to the request
                req.user = user;
				next();
				return;
			});
		});
	} catch (err) {
		console.log('Server Error (isUser) ', err);
		return unauthorized(res);
	}
}

module.exports.unauthorized = unauthorized;
module.exports.buildPageData = buildPageData;
module.exports.isAdmin = isAdmin;
module.exports.isUser = isUser;
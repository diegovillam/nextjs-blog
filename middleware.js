const jwt = require('jsonwebtoken');
const jwt_config = require('./config/jwt.json');
const models = require('./models');

const verifyJWT = token => {
	return new Promise(resolve => {
		resolve(jwt.verify(token, jwt_config.secret));
	});
}
const isAdmin = async (req, res, next) => {
	try {
		await jwt.verify(req.cookies['id_token'], jwt_config.secret, (err, decoded) => {
			if(!decoded) {
				return res.redirect('/');
			}

			let user = decoded.sub;
			models.user.findById(user, { attributes: ['admin'] }).then(user => {
				if(!user || user.admin === 0) return res.redirect('/');
				next();
				return;
			});
		});
	} catch (err) {
		return res.redirect('/');
	}
}
const isNotLoggedIn = async (req, res, next) => {
	try {
		await verifyJWT(req.cookies['id_token']);
		return res.redirect('/');
	} catch (err) {
		next();
		return;
	}
}
const isLoggedIn = async (req, res, next) => {
	try {
		await verifyJWT(req.cookies['id_token']);
		next();
		return;
	} catch (err) {
		return res.redirect('/');
	}
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isNotLoggedIn = isNotLoggedIn;
module.exports.isAdmin = isAdmin;

// Multer File-Upload Middleware
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const storage = multer.diskStorage({
	destination: './static/uploads',
	filename(req, file, cb) {
		cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
	}
});
const upload = multer({ storage });
module.exports.upload = upload;
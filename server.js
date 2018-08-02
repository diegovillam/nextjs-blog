// Determine development mode
const env = process.env.NODE_ENV || 'development';

// Require dependencies
const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const body = require('body-parser');
const middleware = require('./middleware');
const models = require('./models');
const config = require('./config/config.json')[env];
const Sequelize = require('sequelize');

const jwt = require('jsonwebtoken');
const jwt_config = require('./config/jwt.json');

// Set up our enviroment
const sequelize = new Sequelize(config.database, config.username, config.password,  { dialect: 'mysql', operatorsAliases: Sequelize.Op });
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = 5555;

// Prepare application
app.prepare().then(async() => {
	await sequelize.authenticate().then(() => {
		console.log('Connection has been established successfully.');
	}).catch(err => {
		console.error('Unable to connect to the database:', err);
		process.exit(1);
	});
	await models.sequelize.sync();
	const server = express();
	// Use the JSON and Cookie parser, as well as file upload middleware
	server.use(cookieParser());
	server.use(body.json());
	// Using our REST APIs
	server.use('/api', require('./api'));
	// Private Routes
	server.get('/login', middleware.isNotLoggedIn, (req, res) => {
		return app.render(req, res, '/login');
	});
	server.get('/logout', middleware.isLoggedIn, (req, res) => {
		res.clearCookie('id_token');
		return res.redirect('/');
	});
	server.get('/account', middleware.isLoggedIn, (req, res) => {
		return app.render(req, res, '/account');
	});
	// Make every /admin route require the Admin middleware
	server.use('/admin*', middleware.isAdmin);
	// Pretty URL masking
	server.get('/article/:id', (req, res) => {
		// Map the params to a query params string
		const query = { id: req.params.id };
		return app.render(req, res, '/article', query);
	});
	server.get('/category/:id', (req, res) => {
		// Map the params to a query params string
		const query = { category: req.params.id };
		return app.render(req, res, '/', query);
	});
	server.get('/admin/article/delete/:id', (req, res) => {
		// Map the params to a query params string
		const query = { id: req.params.id };
		return app.render(req, res, '/admin/article/delete', query);
	});
	server.get('/admin/article/edit/:id', (req, res) => {
		// Map the params to a query params string
		const query = { id: req.params.id };
		return app.render(req, res, '/admin/article/edit', query);
	});
	server.get('/profile/:username', (req, res) => {
		const query = { username: req.params.username };
		return app.render(req, res, '/profile', query);
	});
	// General request handler
	server.get('*', (req, res) => {
		return handle(req, res);
	});
	// Listen to requests
	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
}).catch((ex) => {
	console.error(ex.stack);
	process.exit(1);
});


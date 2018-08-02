var express = require('express');
var router = express.Router();

// Use our endpoints
router.use(require('./endpoints/articles'));
router.use(require('./endpoints/categories'));
router.use(require('./endpoints/comments'));
router.use(require('./endpoints/users'));
router.use(require('./endpoints/admin'));
router.use('/auth/', require('./endpoints/auth'));

module.exports = router;
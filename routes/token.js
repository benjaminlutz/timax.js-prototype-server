var express = require('express'),
	router = express.Router(),
	validator = require('validator'),
	jwt = require('jsonwebtoken'),
	conf = require('../config.json');

router.post('/', function(req, res, next) {
	var token = jwt.sign({ name: 'Hans Wurst' }, conf.secret, { expiresInMinutes: 60 * 5 });

	res.send(token);
});

module.exports = router;
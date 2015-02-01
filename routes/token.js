var express = require('express'),
	router = express.Router(),
	validator = require('validator'),
	jwt = require('jsonwebtoken');

router.post('/', function(req, res, next) {
	var token = jwt.sign({ name: 'hanswurst' }, 'katze123', { expiresInMinutes: 60 * 5 });

	res.send(token);
});

module.exports = router;
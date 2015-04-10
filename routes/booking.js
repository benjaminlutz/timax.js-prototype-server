var express = require('express'),
	router = express.Router(),
	validator = require('validator');

router.get('/', function(req, res, next) {
	var db = req.db,
		collection = db.get('bookings');

	console.log('auth name: ' + req.auth.name);

	collection.find({}, {}, function(e, docs) {
		if (e) {
			return res.sendStatus(500);
		}

		res.send(docs);
	});
});

router.post('/', function(req, res, next) {
	var db = req.db,
		pubsub = req.pubsub,
		collection = db.get('bookings');

	if (!validator.isAlphanumeric(req.body.name)) {
		console.log(req.body.name);
		return res.sendStatus(400);
	}

	// TODO replace with isDate when type was changed...
	if (!validator.contains(req.body.start, ':')) {
		console.log(req.body.start);
		return res.sendStatus(400);
	}

	// TODO replace with isDate when type was changed...
	if (!validator.contains(req.body.end, ':')) {
		console.log(req.body.end);
		return res.sendStatus(400);
	}

	collection.insert(req.body, function(e, doc) {
		if (e) {
			return res.sendStatus(500);
		}

		pubsub.publish('bookings', doc);

		res.send(doc);
	});
});

module.exports = router;
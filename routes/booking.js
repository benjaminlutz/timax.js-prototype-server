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
		collection = db.get('bookings'),
		newBooking = {};

	if (validator.isAlphanumeric(req.body.name)) {
		newBooking.name = req.body.name;
	} else {
		console.log(req.body.name);
		return res.sendStatus(400);
	}

	// TODO replace with isDate when type was changed...
	if (validator.contains(req.body.start, ':')) {
		newBooking.start = req.body.start;
	} else {
		console.log(req.body.start);
		return res.sendStatus(400);
	}

	// TODO replace with isDate when type was changed...
	if (validator.contains(req.body.end, ':')) {
		newBooking.end = req.body.end;
	} else {
		console.log(req.body.end);
		return res.sendStatus(400);
	}

	collection.insert(newBooking, function(e, doc) {
		if (e) {
			return res.sendStatus(500);
		}

		res.send(doc);
	});
});

module.exports = router;
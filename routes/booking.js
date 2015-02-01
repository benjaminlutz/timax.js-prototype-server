var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var db = req.db;
	var collection = db.get('bookings');

	collection.find({}, {}, function(e, docs) {
		if (e) {
			return res.send(500);
		}

		res.send(docs);
	});
});

router.post('/', function(req, res, next) {
	var db = req.db;
	var collection = db.get('bookings');

	// TODO do some validation...
	collection.insert({
		"name": req.body.name,
		"start": req.body.start,
		"end": req.body.end
	}, function(e, doc) {
		if (e) {
			return res.send(500);
		}

		res.send(doc);
	});
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var bookings = [
		{
			name: 'Book 1',
			start: '15:40',
			end: '15:40'
		},
		{
			name: 'Book 2',
			start: '17:80',
			end: '19:90'
		}
	];

	res.send(bookings);
});

router.post('/', function(req, res, next) {
	var booking = req.body;

	console.log(booking);
	booking.test = true;

	res.send(booking);
});

module.exports = router;

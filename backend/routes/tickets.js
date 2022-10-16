const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/users');
const tickets = require('../services/tickets');

router.get('/all', async function(req, res, next) {
	try {
		res.json(await tickets.getAll());
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
	}
});

/* GET programming languages. */
router.get('/:page', async function(req, res, next) {
	try {
		res.json(await tickets.getMultiple(req.query.page));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
	}
});

router.post('/', async function(req, res, next) {
	try {
		res.json(await users.create(req.body));
	} catch (err) {
		console.error(`Error while creating ticket `, err.message);
	}
})

module.exports = router;
const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/users');
const serviceRequests = require('../services/serviceRequests');

router.get('/all', async function(req, res, next) {
	try {
		if(users.authenticateToken(req,res) === true) {
			res.json(await users.getAll());
		}
	} catch (err) {
		console.error(`Error while getting users `, err.message);
	}
});

router.post('/login', async function(req, res, next) {
	try {
		res.json(await users.login(req.body));
	} catch (err) {
		console.error(`Error while getting users `, err.message);
	}
});

/* GET programming languages. */
router.get('/:page', async function(req, res, next) {
	try {
		res.json(await users.getMultiple(req.query.page));
	} catch (err) {
		console.error(`Error while getting users `, err.message);
	}
});

router.post('/', async function(req, res, next) {
	try {
		res.json(await users.create(req.body));
	} catch (err) {
		console.error(`Error while creating user `, err.message);
	}
})

module.exports = router;
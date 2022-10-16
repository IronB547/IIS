const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/users');
const tickets = require('../services/tickets');

router.get('/', async function(req, res, next) {
	try {
		res.json(await tickets.getAll());
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).json(err.message)
	}
});

router.get('/Solved/:page?', async function(req, res, next) {
	try {
		const page = req.params.page;
		res.json(await tickets.getSolved());
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).json(err.message)
	}
});

router.get('/Unsolved/:page?', async function(req, res, next) {
	try {
		const page = req.params.page;
		res.json(await tickets.getUnsolved(page));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).json(err.message)
	}
});

router.get('/search/:param', async function(req, res, next) {
	try {
		const param = req.params.param;
		res.json(await tickets.getBySearch(param));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});


router.post('/', async function(req, res, next) {
	try {
		console.debug(req.user);
		if(users.authorize(req, res, 0)) {
			console.debug(req.user);
			tickets.create(req.body, req.user.id).then((result) => {
				console.debug(result);
				res.json(result);
			});	
		}
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

module.exports = router;
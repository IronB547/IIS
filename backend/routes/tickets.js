const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/usersService');
const tickets = require('../services/ticketsService');

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

router.get('/search/:param/:page', async function(req, res, next) {
	try {
		const page = req.params.page;
		const param = req.params.param;
		res.json(await tickets.getBySearch(param, page));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});


router.post('/', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {	
			const result = await tickets.create(req.body, req.user.id);
			if(result.error) {
				res.status(400).send(result.error)
			}
			else {
				res.json(result);
			}
			
		}
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

module.exports = router;
const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/usersService');
const serviceRequests = require('../services/serviceRequestsService');

router.get('/', async function(req, res, next) {
	try {
		res.json(await serviceRequests.getAll());
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).json(err.message)
	}
});

router.get('/Solved/:page?', async function(req, res, next) {
	try {
		const page = req.params.page;
		res.json(await serviceRequests.getSolved());
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).json(err.message)
	}
});

router.get('/Unsolved/:page?', async function(req, res, next) {
	try {
		const page = req.params.page;
		res.json(await serviceRequests.getUnsolved(page));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).json(err.message)
	}
});

router.get('/search/:param', async function(req, res, next) {
	try {
		const param = req.params.param;
		res.json(await serviceRequests.getBySearch(param));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});


router.post('/', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {	
			const result = await serviceRequests.create(req.body, req.user.id);
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
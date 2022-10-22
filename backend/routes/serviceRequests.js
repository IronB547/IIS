const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/usersService');
const serviceRequests = require('../services/serviceRequestsService');

router.get('/Unsolved', async function(req, res, next) {
	try {
		
		res.json("Hello");
		console.log(req.query.status);
	} catch (err) {
		console.error(`Error while getting requests `, err.message);
		res.status(400).json(err.message)
	}
});

router.get('/search/:param/:page?', async function(req, res, next) {
	try {
		const page = req.params.page;
		const param = req.params.param;
		res.json(await serviceRequests.getBySearch(param, page));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

router.get('/:page?', async function(req, res, next) {
	try {
		const page = req.params.page;
		let params = req.query;
		res.json(await serviceRequests.getAll(page, params));
	} catch (err) {
		console.error(`Error while getting requests `, err.message);
		res.status(400).json(err.message)
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
		console.error(`Error while getting requests `, err.message);
		res.status(400).send()
	}
});

module.exports = router;
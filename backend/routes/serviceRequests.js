const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/usersService');
const serviceRequests = require('../services/serviceRequestsService');

router.get('/list/:page?', async function(req, res, next) {
	try {
		const page = req.params.page;
		const query = req.query;
		
		res.json(await serviceRequests.getBySearch(page, query));
	} catch (err) {
		console.error(`Error while getting service requests `, err.message);
		res.status(500).send()
	}
});

router.get('/:id', async function(req, res, next) {
	try {
		const ticket_id = req.params.id;
		const result = await serviceRequests.getByID(ticket_id)
		if(result != null)
			res.json(result);
		else
			res.status(404).json({message: "Not found"});
	} catch (err) {
		console.error(`Error while getting service requests `, err.message);
		res.status(500).send()
	}
});

router.post('/', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 2)) {	
			const result = await serviceRequests.create(req.body, req.user.id);
			if(result.error) {
				res.status(400).send(result.error)
			}
			else {
				res.status(201).json(result);
			}
		}else{
			if(!res.headersSent)
				res.status(403).json({message: "Forbidden"});
		}
	} catch (err) {
		console.error(`Error while posting servicer requests `, err.message);
		res.status(500).send()
	}
});

router.put('/:request_id', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 2)) {
			let request = {};
				request.title = req.body.title;
				request.description = req.body.description
				request.request_id = req.params.request_id;
				request.user = req.user.id;

				const result = await serviceRequests.editRequest(request, req);
				console.log(result)				
				if(result.affectedRows == 0 || result.error) {
					res.status(400).send()
				}
				else {
					res.status(204).json(result)
				}
		}
		else {
			res.status(403).send()
		}
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

module.exports = router;
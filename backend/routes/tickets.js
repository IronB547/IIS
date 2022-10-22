const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/usersService');
const tickets = require('../services/ticketsService');
const moment = require("moment");

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

router.get('/search/:param?/:page?', async function(req, res, next) {
	try {
		const page = req.params.page;
		const param = req.params.param ? req.params.param : "";
		res.json(await tickets.getBySearch(param, page));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

router.get('/:id', async function(req, res, next) {
	try {
		const ticket_id = req.params.id;
		const result = await tickets.getByID(ticket_id)
		if(result != null)
			res.json(result);
		else
			res.status(404).json({message: "Ticket not found"});
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
			
		}else{
			if(!res.headersSent)
				res.status(403).json({message: "Forbidden"});
		}
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

router.post('/:ticket_id/comments', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let comment = {};
			comment.text = req.body.comment; 
			comment.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
			comment.user_id = req.user.id;
			comment.ticket_id = req.params.ticket_id;

			console.log(comment.created_at);
			const result = await tickets.addComment(comment);
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
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
		const ticketID = req.params.id;
		const result = await tickets.getByID(ticketID)
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
				res.status(201).json(result);
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

router.post('/:ticketID/comments', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let comment = {};
			comment.text = req.body.comment; 
			comment.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
			comment.userID = req.user.id;
			comment.ticketID = req.params.ticketID;

			const result = await tickets.addComment(comment);
			if(result.error) {
				res.status(400).send(result.error)
			}
			else {
				res.status(201).json(result);
			}
		}
		
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

router.put('/:ticketID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let ticket = {};
				ticket.title = req.body.title;
				ticket.location = req.body.location;
				ticket.description = req.body.description
				ticket.ticketID = req.params.ticketID;
				ticket.userID = req.user.id;

				const result = await tickets.editTicket(ticket, req);
				
				if(result.affectedRows == 0 || result.error) {
					res.status(403).send(result.error)
				}
				
				else {
					res.status(204).json(result)
				}
		}
		else {
			res.status(401).send()
		}
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

router.put('/comments/:commentID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let ticket = {};
				ticket.comment = req.body.comment;
				ticket.commentID = req.params.commentID;
				ticket.userID = req.user.id;

				const result = await tickets.editComment(ticket, req);
				if(result.affectedRows == 0 || result.error) {
					res.status(403).send(result.error)
				}
				else {
					res.status(204).json(result)
				}
		}
		else {
			res.status(401).send()
		}
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(400).send()
	}
});

module.exports = router;
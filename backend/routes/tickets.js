const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/usersService');
const tickets = require('../services/ticketsService');
const moment = require("moment");

router.get('/list/:page?', async function(req, res) {
	try {
		const page = req.params.page;
		const query = req.query;
		
		res.json(await tickets.getBySearch(page, query));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(500).send()
	}
});

router.get('/count/:page?', async function(req, res) {
	try {
		const query = req.query;
		
		res.json(await tickets.getBySearch(undefined, query, true));
	} catch (err) {
		console.error(`Error while getting tickets `, err.message);
		res.status(500).send()
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

			const result = await tickets.addComment(comment, req.user);
			if(result.error) {
				res.status(400).send(result.error)
			}
			else {
				res.status(201).json(result);
			}
		}
		
	} catch (err) {
		console.error(`Error while creating ticket comment `, err.message);
		res.status(500).send()
	}
});

router.post('/:ticketID/photo', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let photo = {};
			photo.ticketID = req.params.ticketID;
			photo.url = req.body.url;
			photo.userID = req.user.id;

			const result = await tickets.addPhoto(photo, req);
			if(result.error) {
				res.status(403).send(result.error)
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

router.put('/:ticketID?', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let ticket = {};
				ticket = req.body;
				ticket.ticketID = req.params.ticketID || ticket.ticketID;

				const result = await tickets.editTicket(ticket, req.user);
				
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

router.put('/:ticketID/comments/:commentID', async function(req, res, next) {
	try {
		if(!users.authorize(req, res, 0, true))
			return;
		
		let comment = {};
		comment.comment = req.body.comment;
		comment.id = req.params.commentID;
		comment.ticketID = req.params.ticketID;

		const result = await tickets.editComment(comment, req.user);
		if(result.affectedRows == 0 || result.error) {
			res.status(403).send(result.error)
		}
		else {
			res.status(204).json(result)
		}

	} catch (err) {
		console.error(`Error while editing ticket comments `, err.message);
		res.status(500).send()
	}
});

router.delete('/:ticketID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let ticket = {};
				ticket.ticketID = req.params.ticketID;
				ticket.userID = req.user.id;

			const result = await tickets.deleteTicket(ticket, req);
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

router.delete('/comments/:commentID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let ticket = {};
				ticket.commentID = req.params.commentID;
				ticket.userID = req.user.id;

			const result = await tickets.deleteTicketComment(ticket, req);
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

router.delete('/:ticketID/photo/:photoID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 0)) {
			let photo = {};
				photo.photoID = req.params.photoID;
				photo.ticketID = req.params.ticketID;
				photo.userID = req.user.id;

			const result = await tickets.deletePhoto(photo, req);
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
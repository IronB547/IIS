const express = require('express');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/usersService');
const serviceRequests = require('../services/serviceRequestsService');
const moment = require('moment');

router.get('/list/:page?', async function(req, res, next) {
	try {
		
		if(!users.authorize(req, res, 1, true))
			return;

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
		if(!users.authorize(req, res, 1, true))
			return;

		const ticketID = req.params.id;
		const result = await serviceRequests.getByID(ticketID)
		
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

router.post('/:requestID/comments', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 1)) {	
			let comment = {};
			comment.text = req.body.comment; 
			comment.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
			comment.userID = req.user.id;
			comment.requestID = req.params.requestID;

			const result = await serviceRequests.addRequestComment(comment, req.user);
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
		console.error(`Error while posting comment to service requests `, err.message);
		res.status(500).send()
	}
});

router.put('/:requestID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 1)) {
				let request = req.body;
				request.requestID = req.params.requestID || request.id;

				const result = await serviceRequests.editRequest(request, req.user);
				
				if(result.affectedRows == 0 || result.error) {
					res.status(403).send(result.error)
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
		res.status(500).send()
	}
});

router.put('/comments/:commentID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 1)) {
			let comment = {};
				comment.text = req.body.comment;
				comment.commentID = req.params.commentID;
				comment.userID = req.user.id;

				const result = await serviceRequests.editRequestComment(comment, req);
				
				if(result.affectedRows == 0 || result.error) {
					res.status(403).send()
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
		res.status(500).send()
	}
});

router.post("/:requestID/technicians/:technicianID", async function(req, res) {
	
	try {
		if(!users.authorize(req, res, 2, true))
			return;

		const requestID = req.params.requestID;
		const technicianID = req.params.technicianID;

		const result = await serviceRequests.assignTechnician(technicianID, requestID);
		if(result.affectedRows == 0 || result.error) {
			res.status(400).send(result.error)
			return;
		}
		
		res.status(204).json(result)

	} catch (err) {
		console.error(`Error while editing requests `, err.message);
		res.status(500).send()
	}

})

router.delete('/:requestID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 1)) {
			let request = {};
				request.requestID = req.params.requestID;
				request.userID = req.user.id;

			const result = await serviceRequests.deleteRequest(request, req);
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
		console.error(`Error while getting requests `, err.message);
		res.status(400).send()
	}
});

router.delete('/comments/:commentID', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 1)) {
			let request = {};
				request.commentID = req.params.commentID;
				request.userID = req.user.id;

			const result = await serviceRequests.deleteRequestComment(request, req);
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
		console.error(`Error while getting requests `, err.message);
		res.status(400).send()
	}
});

router.delete("/:requestID/technicians/:technicianID", async function(req, res) {
	
	try {
		if(!users.authorize(req, res, 2, true))
			return;

		const requestID = req.params.requestID;
		const technicianID = req.params.technicianID;

		const result = await serviceRequests.unassignTechnician(technicianID, requestID);
		if(result.affectedRows == 0 || result.error) {
			res.status(400).send(result.error)
			return;
		}
		
		res.status(204).json(result)

	} catch (err) {
		console.error(`Error while editing requests `, err.message);
		res.status(500).send()
	}

})

module.exports = router;
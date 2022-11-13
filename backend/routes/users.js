const express = require('express');
const router = express.Router();
const users = require('../services/usersService');
const ValidationError = require('../helper').ValidationError;

router.get('/all/:page?', async function(req, res, next) {
	try {
		if(users.authorize(req, res, 2)) {
			const page = req.params.page;
			const userType = req.query.userType;
			res.json(await users.getAll(page, userType));
		}else{
			if(!res.headersSent)
				res.status(403).json({message: "Forbidden"});
		}
	} catch (err) {
		if(err instanceof ValidationError)
			res.status(400).json({message: err.message});
		else
			res.status(500).json({message: "Internal Server Error"});
		
		console.error(`Error while getting users `, err.message);
	}
});

router.post('/login', async function(req, res, next) {
	try {
		// console.debug(req)
		const result = await users.login(req.body)
		if(result.token != null)
			res.status(200).json(result);
		else
			res.status(401).json({message: "Invalid credentials"});
	} catch (err) {
		console.error(`Error while getting users `, err.message);
		res.status(500).json({message: "Internal Server Error"});
	}
});

router.get('/:id', async function(req, res, next) {
	try {
		if(users.authenticateToken(req,res) === true) {
			res.json(await users.getOne(req.params.id));
		}
	} catch (err) {
		console.error(`Error while getting user `, err.message);
		res.status(500).json({message: "Internal Server Error"});
	}
});

/* Register new user as a city manager+ */
router.post('/', async function(req, res, next) {
	var newUser = req.body;
	try {
		if(users.hasAccessToken(req,res) === true) {
			if(users.authorize(req,res, 3)){
				res.json(await users.create(req.body));
			}else if(users.authorize(req,res,2) === true && newUser.userType == 1) {
				res.json(await users.create(req.body));
			}else{
				if(!res.headersSent)
					res.status(403).json({message: "Forbidden"});
			}
		}else{
			next();
		}
	} catch (err) {
		// console.debug(err)
		if(!res.headersSent)
			res.status(500).json({message: err.message});
	}
})

/** Register new user without being a manager or admin (falls back to this via next() in the other post ) */
router.post('/', async function(req, res, next) { 
	req.body.userType = 0; 
	users.create(req.body).then((result) => {
		console.debug(result);
		res.status(201).json(result);
	}).catch((err) => { 
		if(err.code === 'ER_DUP_ENTRY') {
			res.status(409).json({message: 'User already exists'});
		}else{
			console.error(`Error while creating user (service) `, err.message);
			res.status(400).json({message: err.message});
		}
	});
});

router.delete('/:id', async function(req, res, next) {
	try {
		if(!users.authorize(req,res, 0, true))
			return;
		
		const result = await users.remove(req.user,req.params.id);

		if(result.affectedRows === 0 || result.error)
			res.status(400).json(result.error);
		else
			res.status(204).json();
	} catch (err) {
		console.error(`Error while deleting user `, err.message);
		res.status(500).json({message: "Internal Server Error"});
	}
});

module.exports = router;
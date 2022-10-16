const express = require('express');
const Joi = require('joi');
const { db } = require('../config');
const router = express.Router();
const users = require('../services/users');

router.get('/all', async function(req, res, next) {
	try {
		if(users.authenticateToken(req,res) === true) {
			res.json(await users.getAll());
		}
	} catch (err) {
		console.error(`Error while getting users `, err.message);
	}
});

router.post('/login', async function(req, res, next) {
	try {
		const result = await users.login(req.body)
		if(result.token != null)
			res.json(result);
		else
			res.status(401).json({message: "Invalid credentials"});
	} catch (err) {
		console.error(`Error while getting users `, err.message);
	}
});

router.get('/:id', async function(req, res, next) {
	try {
		if(users.authenticateToken(req,res) === true) {
			res.json(await users.getOne(req.params.id));
		}
	} catch (err) {
		console.error(`Error while getting user `, err.message);
	}
});

/* Register new user as a city manager+ */
router.post('/', async function(req, res, next) {
	var newUser = req.body;
	try {
		if(users.hasAccessToken(req,res) === true) {
			console.debug("User has access token");
			if(users.authorize(req,res, 3)){
				console.debug("authorized as admin creating new user");
				res.json(await users.create(req.body));
			}else if(users.authorize(req,res,2) === true && newUser.userType == 1) {
				console.debug("authorized as city manager creating new technician"); 
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

router.post('/', async function(req, res, next) { 
	req.body.userType = 0; 
	users.create(req.body).then((result) => {
		console.debug(result);
		res.json(result);
	}).catch((err) => { 
		if(err.code === 'ER_DUP_ENTRY') {
			res.status(409).json({message: 'User already exists'});
		}else{
			console.error(`Error while creating user (service) `, err.message);
			res.status(400).json({message: err.message});
		}
	});
});

module.exports = router;
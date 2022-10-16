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
		res.json(await users.login(req.body));
	} catch (err) {
		console.error(`Error while getting users `, err.message);
	}
});

router.get('/:id', async function(req, res, next) {
	try {
		res.json(await users.getOne(req.params.id));
	} catch (err) {
		console.error(`Error while getting user `, err.message);
	}
});

/* Register new user */
router.post('/', async function(req, res, next) {
	try {
		if(users.hasAccessToken(req,res) === true) {
			if(users.authenticateToken(req,res) === true) {
				console.debug(req.user.userType)
			}
		}else{
			next();
		}
	} catch (err) {
		// console.debug(err)
		res.status(500).json({message: err.message});
	}
})

router.post('/', async function(req, res, next) { 
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
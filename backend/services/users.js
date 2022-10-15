const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const joi = require('joi');
const { func } = require('joi');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

async function getMultiple(page = 1){
	const offset = helper.getOffset(page, config.listPerPage);

	const rows = await db.query(
	  `SELECT id, username, password, user_type, email, phone_num
	  FROM Users LIMIT ${offset},${config.listPerPage}`
	);

	const data = helper.emptyOrRows(rows);
	const meta = {page};

	return {
	  data,
	  meta
	}
}

async function getAll(page = 1){
	const rows = await db.query(
		`SELECT id, username, password, user_type, email, phone_num
		FROM Users`
	);

	const data = helper.emptyOrRows(rows);
	const meta = {page};

	return {
		data,
		meta
	}
}

async function create(user){
	console.log(`INSERT INTO Users (username, password, user_type, email, phone_num)  
	VALUES ('${user.username}', '${user.password}', '${user.userType}', '${user.email}', '${user.phoneNum}')` );

	const result = await db.query(
		`INSERT INTO Users (username, password, user_type, email, phone_num)  
		VALUES ('${user.username}', '${user.password}', '${user.userType}', '${user.email}', '${user.phoneNum}')` );
	return result;
}

async function login(user){
	const rows = await db.query('SELECT * FROM Users WHERE email = ? AND password = ?', [user.email, crypto.Hash('sha256').update(user.password).digest('hex')]);
	const data = helper.emptyOrRows(rows);
	const meta = {};

	if(data.length > 0){
		const token = generateAccessToken({ id: data[0].id });
		return {
			data,
			meta,
			token
		}
	} else {
		return {
			data,
			meta,
			token: null
		}
	}
}

function generateAccessToken(id) {
	return jwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization
	var result = false;


	if(authHeader == null){
		return res.sendStatus(401)
	}

	const token = authHeader && authHeader.split(' ')[1]
  
	if (token == null){
		return res.sendStatus(401)
	}

	jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)
	
		req.user = user
		result = true;
	})

	return result;
}

module.exports = {
	getMultiple,
	getAll,
	create,
	login,
	generateAccessToken,
	authenticateToken
}
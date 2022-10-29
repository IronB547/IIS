const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const joi = require('joi');
const { func } = require('joi');
const crypto = require('crypto');
const schema = require('../schemas/users');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

// access config var
if(!process.env.TOKEN_SECRET)
	console.error("TOKEN_SECRET not set");


async function getMultiple(page = 1){
	const offset = helper.getOffset(page, config.usersPerPage);

	const rows = await db.query(
	  `SELECT id, name, surname, password, userType, email, phoneNum
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
	const offset = helper.getOffset(page, config.usersPerPage);

	const rows = await db.query(
		`SELECT id, name, surname, password, userType, email, phoneNum
		FROM Users LIMIT ${offset}, ${config.listPerTicketPage}`
	);

	const data = helper.emptyOrRows(rows);
	const meta = {page};

	return {
		data,
		meta
	}
}

async function getOne(id){
	const rows = await db.query( `SELECT id, name, surname, password, userType, email, phoneNum FROM Users WHERE id = ?`, [id]);
	const data = helper.emptyOrRows(rows);

	return { data };
}

async function create(user){
	return new Promise((resolve, reject) => {
		
		schema.createUserSchema.validateAsync(user).then( async (value) => 
		{
			const query = `INSERT INTO Users (name, surname, password, userType, email, phoneNum) 
		VALUES (?, ?, ?, ?, ?, ?)`
			resolve(db.query(query,
				[value.name, value.surname, value.password, value.userType, value.email, value.phoneNum]));
		} ).catch( (err) => {
			reject(err);
		} );

	});
	// console.debug(query);
	// result = await db.query(query, userArr);
	
	return result;
}

async function remove(requestingUser, id){
	if(requestingUser.id == id || requestingUser.userType >= 3){
		return result = await db.query(`DELETE FROM Users WHERE id = ?`, [id]);
	}else if(requestingUser.userType == 2){
		return result = await db.query(`DELETE FROM Users WHERE id = ? AND userType = 1`, [id]);
	}else{
		return {error: "User is not authorized to delete this user"};
	}
}

async function login(user){
	const rows = await db.query(`SELECT * FROM Users WHERE email = ? AND password = ?`, [user.email, crypto.Hash('sha256').update(user.password).digest('hex')]);
	const data = helper.emptyOrRows(rows);
	const meta = {};

	if(data.length > 0){
		const token = generateAccessToken(data[0]);
	
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

function generateAccessToken(user) {
	const userPermission = {userType: user.userType, id: user.id};
	return jwt.sign(userPermission, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function hasAccessToken(req,res){
	const authHeader = req.headers.authorization

	if(authHeader == null){
		return false
	}

	const token = authHeader && authHeader.split(' ')[1]
  
	if (token == null){
		return false
	}

	return true;
}

function authenticateToken(req, res) {
	const authHeader = req.headers.authorization
	var result = false;

	if(authHeader == null){
		return res.status(401).send("No Bearer token provided");
	}

	const token = authHeader && authHeader.split(' ')[1]
  
	if (token == null){
		return res.status(401).send("Wrong Bearer token format");
	}

	jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
		
		if (err) return res.sendStatus(403)
	
		req.user = user
		result = true;
	})

	return result;
}

/**
 * Returns user role
 * @param {*} req 
 * @param {*} res 
 * @returns user role number
 * @note 0 - user, 1 - service technician, 2 - city manager, 3 - admin, null - not logged in
 * @note if user is not logged in, will send response with status 401
 */
function getAuthorization(req, res){
	var result = false;

	if(authenticateToken(req, res) !== true){
		return req.user.userType
	}

	return null;
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} userType 
 * @returns true if user role is equal or higher than userType 
 */
function authorize(req, res, userType = 0, sendForbidden = false){
	
	if(authenticateToken(req, res) === true){
		const result = req.user.userType >= userType
		if(result === false && sendForbidden === true){
			if(res.headersSent === false){
				res.status(403).send("Forbidden");
			}
		}
		return result;
	}

	return false;
}

module.exports = {
	getMultiple,
	getAll,
	create,
	remove,
	login,
	generateAccessToken,
	authenticateToken,
	hasAccessToken,
	authorize,
	getAuthorization
}
const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const joi = require('joi');
const crypto = require('crypto');
const schema = require('../schemas/users');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// get config vars
dotenv.config();

// access config var
if(!process.env.TOKEN_SECRET)
	console.error("TOKEN_SECRET not set");


let blockedUsers = [];

async function getAll(page = 1, userType = undefined){
	const offset = helper.getOffset(page, config.usersPerPage);
	//TODO: add pagination
	const rows = [];
	if(userType == undefined){
		const rows = await db.query(
			`SELECT id, name, surname, password, userType, email, phoneNum, isBlocked
			FROM Users `//LIMIT ${offset}, ${config.listPerTicketPage}`
		);
		let data = helper.emptyOrRows(rows);
		data = data.map( (user) => {
			delete user.password;
			return user;
		})
		const meta = {page};
		return {
			data,
			meta
		}
	}else{
		const rows = await db.query(
			`SELECT id, name, surname, password, userType, email, phoneNum, isBlocked
			FROM Users WHERE userType = ?`, [userType]
		);

		let data = helper.emptyOrRows(rows);
		data = data.map( (user) => {
			delete user.password;
			return user;
		})
		const meta = {page};
		return {
			data,
			meta
		}
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
			const hash = await bcrypt.hash(value.password, 10)

			const query = `INSERT INTO Users (name, surname, password, userType, email, phoneNum) 
		VALUES (?, ?, ?, ?, ?, ?)`
			resolve(db.query(query,
				[value.name, value.surname, hash, value.userType, value.email, value.phoneNum]));
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
		blockedUsers.push(id);
		return result = await db.query(`DELETE FROM Users WHERE id = ?`, [id]);
	}else if(requestingUser.userType == 2){
		blockedUsers.push(id);
		return result = await db.query(`DELETE FROM Users WHERE id = ? AND userType = 1`, [id]);
	}else{
		return {error: "User is not authorized to delete this user"};
	}
}

async function edit(requestingUser, id, user){
	if(user.password != undefined){
		user.password = await bcrypt.hash(user.password, 10)
	}else{
		delete user.password;
	}
	if(requestingUser.id == id || requestingUser.userType >= 3){
		if(user.password != undefined){
			const query = `UPDATE Users SET name = ?, surname = ?, userType = ?, email = ?, phoneNum = ?, password = ?, isBlocked = ? WHERE id = ?`;
			const result = await db.query(query, [user.name, user.surname, user.userType, user.email, user.phoneNum, user.password, user.isBlocked, id ]);
			return result;
		}else{
			const query = `UPDATE Users SET name = ?, surname = ?, userType = ?, email = ?, phoneNum = ?, isBlocked = ? WHERE id = ?`;
			const result = await db.query(query, [user.name, user.surname, user.userType, user.email, user.phoneNum, user.isBlocked, id ]);
			return result;
		}
	}else{
		return {error: "User is not authorized to edit this user"};
	}
}

async function block(requestingUser, id){
	if(requestingUser.userType >= 3){
		if(!blockedUsers.includes(id))
			blockedUsers.push(id);
		return {message: "User blocked"};
	}else{
		return {error: "User is not authorized to block this user"};
	}
}

/**
 * Checks if user is blocked
 * @param {*} user User object (id,userType) (must be trustworthy)
 * @returns 
 */
function isBlocked(user){
	return user.isBlocked || blockedUsers.includes(user.id);
}

async function login(credentials){
	
	const rows = await db.query(`SELECT * FROM Users WHERE email = ?`, [credentials.email]);
	const data = helper.emptyOrRows(rows);
	const meta = {};
	
	
	if(data.length > 0){
		
		const user = data[0];

		const match = await bcrypt.compare(credentials.password, user.password);
		
		if(isBlocked(user)){
			return {error: "User is blocked"};
		}

		if(match){
			const token = generateAccessToken(user);
			return {
				data: user,
				meta,
				token
			}
		}else{
			return {
				data: null,
				meta: {},
				token: null
			}
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
		
		if(isBlocked(user))
			return res.status(401).send("User is blocked");

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
	getAll,
	create,
	remove,
	edit,
	login,
	block,
	generateAccessToken,
	authenticateToken,
	hasAccessToken,
	authorize,
	getAuthorization
}
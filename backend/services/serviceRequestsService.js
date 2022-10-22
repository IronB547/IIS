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

module.exports = {
	getMultiple,
	getAll,
	create,
}
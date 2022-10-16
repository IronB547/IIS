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
	  `SELECT id, title, location, description, status, user_id
	  FROM Tickets LIMIT ${offset},${config.listPerPage}`
	);

	const data = helper.emptyOrRows(rows);
	const meta = {page};

	return {
	  data,
	  meta
	}
}

async function getAll(){
	const rows = await db.query(
		`SELECT id, title, location, description, status, user_id
		FROM Tickets`
	);

	const data = helper.emptyOrRows(rows);
	const meta = {page};

	return {
		data,
		meta
	}
}

async function create(ticket, userId){
	const result = await db.query(`INSERT INTO Users (title, location, description, status, user_id)  
	VALUES ('${ticket.title}', '${ticket.location}', '${ticket.description}', '${ticket.status}', '${ticket.userId}')` );
	return result;
}

module.exports = {
	getMultiple,
	getAll,
	create,
}
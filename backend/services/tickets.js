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

async function getAll(page = 1){
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

async function create(ticket, userID){
	console.debug(ticket);
	const result = await db.query(`INSERT INTO Tickets (title, location, description, status, user_id)  
	VALUES ('${ticket.title}', '${ticket.location}', '${ticket.description}', '${ticket.status}', '${userID}')` );
	console.debug(result);
	return result;
}

async function getSolved(page = 1) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	const rows = await db.query(`SELECT * FROM Tickets WHERE status BETWEEN 2 AND 3 LIMIT ${offset}, ${config.listPerTicketPage}`)
	const data = helper.emptyOrRows(rows);

	return data;
}

async function getUnsolved(page = 1) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	const rows = await db.query(`SELECT * FROM Tickets WHERE status BETWEEN 0 AND 1 LIMIT ${offset}, ${config.listPerTicketPage}`);
	const data = helper.emptyOrRows(rows);

	return data;
}

async function getBySearch(param, page = 1) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	const value = `%${param}%`;
	const rows = await db.query(`SELECT * FROM Tickets WHERE title LIKE ? LIMIT ${offset}, ${config.listPerTicketPage}`, [value]);
	const data = helper.emptyOrRows(rows);

	return data;
}

module.exports = {
	getAll,
	getUnsolved,
	getSolved,
	getBySearch,
	create,
}
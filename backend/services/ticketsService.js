const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const joi = require('joi');
const schema = require('../schemas/tickets')
const { func, isSchema } = require('joi');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const moment = require('moment');

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
	const validationRes = schema.createTicketSchema.validate(ticket);
	if(validationRes.error) {
		return {error:validationRes.error}
	}

	ticket = validationRes.value;	
	const result = await db.query(`INSERT INTO Tickets (title, location, description, status, user_id, created_at)  
	VALUES ('${ticket.title}', '${ticket.location}', '${ticket.description}', '${ticket.status}', '${userID}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')` );

	return result;
}

async function getSolved(page = 1) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	const rows = await db.query(`SELECT * FROM Tickets WHERE status BETWEEN 2 AND 3 ORDER BY created_at DESC LIMIT ${offset}, ${config.listPerTicketPage}`)
	const data = helper.emptyOrRows(rows);

	return data;
}

async function getUnsolved(page = 1) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	const rows = await db.query(`SELECT * FROM Tickets WHERE status BETWEEN 0 AND 1 ORDER BY created_at DESC LIMIT ${offset}, ${config.listPerTicketPage}`);
	const data = helper.emptyOrRows(rows);

	return data;
}

async function getBySearch(param, page = 1) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	const value = `%${param}%`;
	const rows = await db.query(`SELECT * FROM Tickets WHERE title LIKE ? ORDER BY created_at DESC LIMIT ${offset}, ${config.listPerTicketPage}`, [value]);
	const data = helper.emptyOrRows(rows);

	return data;
}

async function getByID(ticket_id) {
	const tickets = await db.query(`SELECT * FROM Tickets WHERE Tickets.id = ?`, [ticket_id]);
	const photos = await db.query(`SELECT url, id FROM Ticket_photo WHERE ticket_id = ?`, [ticket_id]);
	const comments = await db.query(`SELECT comment, created_at, user_id FROM Ticket_comment 
	WHERE ticket_id = ?`, [ticket_id]);

	let ticket = tickets[0];
	ticket.photos = photos;
	ticket.comments = comments;

	return ticket;
}

async function addComment(comment) {
	const result = await db.query(`INSERT INTO Ticket_comment (comment, created_at, ticket_id, user_id) VALUES 
	(?, '${comment.created_at}', ${comment.ticket_id}, ${comment.user_id})`, [comment.text]);
	return result;
}

async function editTicket(ticket, req) {
	const result = await db.query(`
	UPDATE Tickets
	SET title = ?,
		location = ?,
		description = ?
	WHERE Tickets.id = ? AND Ticket.user_id =  ${req.user.id}`, [ticket.title, ticket.location, ticket.description, ticket.ticket_id]);

	return result;
}

async function editComment(ticket, req) {
	const result = await db.query(`
	UPDATE Ticket_comment
	SET comment = ?
	WHERE Ticket_comment.id = ? AND Ticket_comment.user_id =  ${req.user.id}`, [ticket.comment, ticket.ticket_id]);

	return result;
}

module.exports = {
	getAll,
	getUnsolved,
	getSolved,
	getBySearch,
	getByID,
	addComment,
	editTicket,
	editComment,
	create,
}
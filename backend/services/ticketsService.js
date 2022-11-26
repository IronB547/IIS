const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const joi = require('joi');
const schema = require('../schemas/tickets')
const QueryParserTicket = require('./queryParserTicket');

const dotenv = require('dotenv');
const moment = require('moment');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

async function create(ticket, userID){
	const validationRes = schema.createTicketSchema.validate(ticket);
	if(validationRes.error) {
		return {error:validationRes.error}
	}

	ticket = validationRes.value;	
	const result = await db.query(`INSERT INTO Tickets (title, location, description, status, userID, createdAt)  
	VALUES ('${ticket.title}', '${ticket.location}', '${ticket.description}', '${ticket.status}', '${userID}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')` );
	return result;
}

async function getBySearch(page = 1, query, countOnly = false) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	
	const parser = new QueryParserTicket(query);
	let where = parser.getWhereClause();
	let orderBy = parser.getOrderByClause();

	where = where ? `WHERE ${where}` : "";
	orderBy = orderBy ? `ORDER BY ${orderBy}` : "";

	if(countOnly){
		const rows = await db.query(`SELECT COUNT(*) AS count FROM Tickets ${where}`);
		return rows[0];
	}else if(parser.getFlag("minimal")){
		const call = `SELECT id,title FROM Tickets ${where} ${orderBy}`
		const rows = await db.query(call);
		const data = helper.emptyOrRows(rows);
	
		return data;
	}else{
		const call = `SELECT * FROM Tickets ${where} ${orderBy} LIMIT ${offset}, ${config.listPerTicketPage}`
		const rows = await db.query(call);
		const data = helper.emptyOrRows(rows);
	
		return data;
	}
}

async function getByID(ticketID) {
	const tickets = await db.query(`SELECT Tickets.*, Users.name userName, Users.surname userSurname, Users.userType FROM Tickets JOIN Users ON userID = Users.id WHERE Tickets.id = ?`, [ticketID]);
	const photos = await db.query(`SELECT url, id FROM Ticket_photo WHERE ticketID = ?`, [ticketID]);
	const comments = await db.query(`SELECT Ticket_comment.id, comment, createdAt, userID, Users.name userName, Users.surname userSurname, Users.userType FROM Ticket_comment 
	JOIN Users ON Users.id = userID WHERE ticketID = ?`, [ticketID]);

	if(tickets[0] == null) {
		return null;
	}

	let ticket = tickets[0];
	ticket.photos = photos;
	ticket.comments = comments;

	return ticket;
}


async function addPhoto(photo, req) {
	const ticket = await db.query(`SELECT userID FROM Tickets WHERE Tickets.id = ${photo.ticketID} AND Tickets.status BETWEEN 0 AND 1`);
	
	if(ticket[0]?.userID == photo.userID || req.user.userType > 2) {
		const result = await db.query(`INSERT INTO Ticket_photo (url, ticketID) VALUES (?, ${photo.ticketID})`, [photo.url]);
		
		return result;
	}
	else {
		return {
			error: "Forbidden"
		};
	}
}

async function deletePhoto(photo, req) {
	const ticket = await db.query(`SELECT userID FROM Tickets WHERE Tickets.id = ${photo.ticketID}`);

	if(ticket[0]?.userID == photo.userID || req.user.userType >= 2) {
		const result = await db.query(`DELETE FROM Ticket_photo WHERE Ticket_photo.id = ? AND Ticket_photo.ticketID = ?`, [photo.photoID, photo.ticketID]);
		
		return result;
	}
	else {
		return {
			error: "Forbidden"
		};
	}
}

async function getOpenTicket(ticketID) {
	const result = await db.query(`SELECT status FROM Tickets WHERE Tickets.id = ? AND Tickets.status BETWEEN 0 AND 1`, [ticketID]);

	return result[0];
}

function canCommentInTicket(ticket, user) {
	return (ticket.userID == user.userID || user.userType >= 2);
}

async function addComment(comment, requestingUser) {
	
	const ticket = await getOpenTicket(comment.ticketID);

	if(!ticket)
		return {error: "Forbidden"}

	const result = await db.query(`INSERT INTO Ticket_comment (comment, createdAt, ticketID, userID) VALUES
	(?, '${moment().format("YYYY-MM-DD HH:mm:ss")}', ?, ${comment.userID})`, [comment.text, comment.ticketID]);
	
	return result;
}

async function editTicket(ticket, user) {
	if(user.userType >= 2 && ticket.status != undefined) {
		return await db.query(`
		UPDATE Tickets SET 
		title = ?, 
		location = ?, 
		description = ?, 
		status = ? 
		WHERE Tickets.id = ?`, [ticket.title, ticket.location, ticket.description, ticket.status, ticket.ticketID]);
	}else{
		const userVerification = (user.userType >= 2) ? "" : `AND Tickets.userID =  ${user.id}`;
		return await db.query(`
		UPDATE Tickets
		SET title = ?,
			location = ?,
			description = ?
		WHERE Tickets.id = ? ${userVerification}`, [ticket.title, ticket.location, ticket.description, ticket.ticketID]);
	}
}

async function editComment(comment, requestingUser) {

	const ticket = await getOpenTicket(comment.ticketID);
	if(!ticket)
		return {error: "Forbidden"}

	const userVerification = (requestingUser.userType >= 2) ? "" : `AND Ticket_comment.userID = ${requestingUser.id}`;

	const result = await db.query(`
	UPDATE Ticket_comment
	SET comment = ?
	WHERE Ticket_comment.id = ? 
	${userVerification}`, [comment.comment, comment.id]);

	return result;
}

async function deleteTicket(ticket, req) {
	const userVerification = (req.user.userType >= 2) ? "" : `AND Tickets.userID =  ${ticket.userID}`;
	
	const result = await db.query(`
	DELETE FROM Tickets
	WHERE Tickets.id = ? ${userVerification}`, [ticket.ticketID]);

	return result;
}

async function deleteTicketComment(ticket, req) {
	const userVerification = (req.user.userType > 2) ? "" : `AND Ticket_comment.userID =  ${ticket.userID}`;
	
	const result = await db.query(`
	DELETE FROM Ticket_comment
	WHERE Ticket_comment.id = ? ${userVerification}`, [ticket.commentID]);

	return result;
}

module.exports = {
	getBySearch,
	getByID,
	addPhoto,
	deletePhoto,
	addComment,
	editTicket,
	editComment,
	deleteTicket,
	deleteTicketComment,
	create,
}
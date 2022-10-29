const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const QueryParser = require('./queryParser');

const dotenv = require('dotenv');
const schema = require('../schemas/serviceRequests');
const moment = require('moment');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

async function getMultiple(page = 1){
	const offset = helper.getOffset(page, config.listPerPage);

	const rows = await db.query(
	  `SELECT id, username, password, userType, email, phoneNum
	  FROM Users LIMIT ${offset},${config.listPerPage}`
	);

	const data = helper.emptyOrRows(rows);
	const meta = {page};

	return {
	  data,
	  meta
	}
}

async function getAll(page = 1, params, query){
	const offset = helper.getOffset(page, config.listPerTicketPage);

	// const where = helper.getWhereClause(query);
	
	// console.debug(where);

	const rows = await db.query(
		`SELECT title, solutionState, description, cityManagerID, createdAt FROM Service_request
		 ORDER BY solutionState, createdAt DESC LIMIT ${offset}, ${config.listPerTicketPage}
		 `
	);
	const data = helper.emptyOrRows(rows);

	const meta = {page};

	return {
		data,
		meta
	}
}

async function create(serviceRequests, userID){
	const validationRes = schema.createServiceRequest.validate(serviceRequests);
	if(validationRes.error) {
		return {error:validationRes.error}
	}

	serviceRequests = validationRes.value;	

	const result = await db.query(
		`INSERT INTO Service_request (ticketID, cityManagerID, createdAt, title, description)
		 VALUES (${serviceRequests.ticketID}, ?, '${moment().format("YYYY-MM-DD HH:mm:ss")}', ?, ?)`, 
		[userID, serviceRequests.title, serviceRequests.description])  

	return result;
}

async function getBySearch(page = 1, query) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	
	const parser = new QueryParser(query);
	let where = parser.generateWhereClause()

	where = where ? `WHERE ${where}` : "";
	
	const call = `SELECT * FROM Service_request ${where} LIMIT ${offset}, ${config.listPerTicketPage}`
	const rows = await db.query(call);
	const data = helper.emptyOrRows(rows);

	return data;
}

async function getByID(requestID) {
	const requests = await db.query(`SELECT * FROM Service_request WHERE id = ?`, [requestID]);
	const comments = await db.query(`SELECT comment, createdAt, userID FROM Service_request_comment 
	WHERE serviceRequestID = ?`, [requestID]);
	const technicians = await db.query(`SELECT technicianID,name,surname,userType,email,phoneNum FROM Service_request_technician srt NATURAL JOIN Users u
	WHERE u.id = srt.technicianID AND serviceRequestID = ?`, [requestID]);

	let request = requests[0];

	if(!request)
		return null;

	request.comments = comments;
	request.technicians = technicians;

	return request;
}

async function editRequest(request, req) {
	const userVerification = (req.user.userType >= 2) ? "" : `AND Service_request.cityManagerID =  ${req.user.id}`;

	const result = await db.query(`
	UPDATE Service_request
	SET title = ?,
		description = ?
	WHERE Service_request.id = ? ${userVerification}`, [request.title, request.description, request.requestID]);

	return result;
}

async function addRequestComment(comment) {
	const result = await db.query(
		`INSERT INTO Service_request_comment (comment, createdAt, ServiceRequestID, userID)
		 VALUES (?, '${comment.createdAt}', ?, ?)`, 
		[comment.text, comment.requestID, comment.userID])

	return result;
}

async function editRequestComment(comment, req) {
	const userVerification = (req.user.userType > 2) ? "" : `AND Service_request_comment.userID =  ${req.user.id}`;

	const result = await db.query(`
	UPDATE Service_request_comment
	SET comment = ?
	WHERE Service_request_comment.id = ? ${userVerification}`, [comment.text, comment.commentID]);

	return result;
}

async function deleteRequest(request, req) {
	const userVerification = (req.user.userType >= 2) ? "" : `AND Service_request.userID =  ${request.userID}`;

	const result = await db.query(`
	DELETE FROM Service_request
	WHERE Service_request.id = ? ${userVerification}`, [request.requestID]);

	return result;
}

async function deleteRequestComment(request, req) {
	const userVerification = (req.user.userType > 2) ? "" : `AND Service_request_comment.userID =  ${request.userID}`;
	
	const result = await db.query(`
	DELETE FROM Service_request_comment
	WHERE Service_request_comment.id = ? ${userVerification}`, [request.commentID]);

	return result;
}

module.exports = {
	getMultiple,
	getAll,
	getBySearch,
	getByID,
	editRequest,
	addRequestComment,
	editRequestComment,
	deleteRequest,
	deleteRequestComment,
	create,
}
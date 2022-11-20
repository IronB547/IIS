const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const queryParserRequest = require('./queryParserRequest');

const dotenv = require('dotenv');
const schema = require('../schemas/serviceRequests');
const moment = require('moment');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

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

async function getBySearch(page = 1, query, countOnly = false) {
	const offset = helper.getOffset(page, config.listPerTicketPage);
	
	const parser = new queryParserRequest(query);
	let where = parser.getWhereClause();
	let orderBy = parser.getOrderByClause();

	where = where ? `WHERE ${where}` : "";
	orderBy = orderBy ? `ORDER BY ${orderBy}` : "";

	if(countOnly){
		const rows = await db.query(`SELECT COUNT(*) AS count FROM Service_request ${where}`);
		return rows[0];
	}else{
		const call = `SELECT * FROM Service_request ${where} ${orderBy} LIMIT ${offset}, ${config.listPerTicketPage}`
		const rows = await db.query(call);
		const data = helper.emptyOrRows(rows);
	
		return data;
	}
}

async function getByID(requestID) {
	const requests = await db.query(`SELECT Service_request.*, Users.name userName, Users.surname userSurname, Users.userType 
	FROM Service_request JOIN Users ON Users.id = cityManagerID WHERE Service_request.id = ?`, [requestID]);

	const comments = await db.query(`SELECT Service_request_comment.id, comment, createdAt, userID, Users.name userName, Users.surname userSurname, Users.userType
	FROM Service_request_comment JOIN Users ON Users.id = userID 
	WHERE serviceRequestID = ?`, [requestID]);
	
	const technicians = await db.query(`SELECT technicianID,name,surname,userType,email,phoneNum FROM Service_request_technician srt 
	NATURAL JOIN Users u WHERE u.id = srt.technicianID AND serviceRequestID = ?`, [requestID]);

	
	let request = requests[0];
	
	
	if(!request)
		return null;
	
	if(request.ticketID){
		const ticket = await db.query(`SELECT * FROM Tickets WHERE id = ?`, [request.ticketID]);
		request.ticket = ticket[0];
	}

	request.comments = comments;
	request.technicians = technicians;

	return request;
}

async function editRequest(request, requestingUser) {
	const userVerification = (requestingUser.userType >= 2) ? "" : 
	`AND EXISTS (SELECT technicianID FROM Service_request_technician 
		WHERE technicianID = ${requestingUser.id} AND serviceRequestID = ${request.requestID})`;
	
	if(userVerification){
		//user is technician
		
		const validateRes = schema.editServiceRequestTechnician.validate(request)

		if(validateRes.error){
			return {error:validateRes.error}
		}
		return await db.query(`
		UPDATE Service_request
		SET solutionTime = ?,
		solutionState = ?,
		price = ?
		WHERE Service_request.id = ? ${userVerification}`, [request.solutionTime, request.solutionState, request.price, request.requestID]);
	}else{
		//user is a city manager or admin

		const validateRes = schema.editServiceRequest.validate(request)

		if(validateRes.error){
			return {error:validateRes.error}
		}

		return await db.query(`
		UPDATE Service_request
		SET title = ?,
			description = ?,
			solutionState = ?
		WHERE Service_request.id = ?`, [request.title, request.description, request.solutionState, request.requestID]);
	}
}

async function addRequestComment(comment, requestingUser) {
	const request = await db.query(`SELECT * FROM Service_request WHERE id = ? AND solutionState = 0`, [comment.requestID]);

	if(!request[0])
		return {error: "Request is already solved or does not exist."};

	const result = await db.query(
		`INSERT INTO Service_request_comment (comment, createdAt, serviceRequestID, userID)
		 VALUES (?, '${comment.createdAt}', ?, ?)`, 
		[comment.text, comment.requestID, comment.userID])

	return result;
}

async function editRequestComment(comment, req) {
	const request = await db.query(`
	SELECT * FROM Service_request_comment JOIN Service_request
    ON Service_request_comment.serviceRequestID = Service_request.id
	WHERE Service_request_comment.id = ? AND Service_request.solutionState = 0`, [comment.commentID]);
	
	if(!request[0])
		return {error: "Request is already solved or does not exist."};

	const userVerification = (req.user.userType > 2) ? "" : `AND Service_request_comment.userID =  ${req.user.id}`;

	const result = await db.query(`
	UPDATE Service_request_comment
	SET comment = ?
	WHERE Service_request_comment.id = ? ${userVerification}`, [comment.text, comment.commentID]);

	return result;
}

async function deleteRequest(request, req) {	
	const userVerification = (req.user.userType >= 2) ? "" : `AND Service_request.cityManagerID =  ${request.userID}`;

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

async function assignTechnician(technicianID, requestID) {
	const toBeAssigned = await db.query(`SELECT * FROM Users WHERE id = ?`, [technicianID]);
	
	if(toBeAssigned[0]?.userType !== 1){
		return {error: "User is not a technician"};
	}
	
	const result = await db.query(`
	INSERT IGNORE INTO Service_request_technician (technicianID, serviceRequestID)
	VALUES (?, ?)`, [technicianID, requestID]);

	return result;
}

async function unassignTechnician(technicianID, requestID) {
	const result = await db.query(`
	DELETE FROM Service_request_technician WHERE technicianID = ? AND serviceRequestID = ?`, 
	[technicianID, requestID]);

	return result;
}

module.exports = {
	getBySearch,
	getByID,
	editRequest,
	addRequestComment,
	editRequestComment,
	deleteRequest,
	deleteRequestComment,
	assignTechnician,
	unassignTechnician,
	create,
}
const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const joi = require('joi');
const { func } = require('joi');
const crypto = require('crypto');
const QueryParser = require('./queryParser');

const jwt = require('jsonwebtoken');
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

async function getAll(page = 1, params, query){
	const offset = helper.getOffset(page, config.listPerTicketPage);

	// const where = helper.getWhereClause(query);
	
	// console.debug(where);

	const rows = await db.query(
		`SELECT title, solution_state, description, city_manager_id, created_at FROM Service_request
		 ORDER BY solution_state, created_at DESC LIMIT ${offset}, ${config.listPerTicketPage}
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
		`INSERT INTO Service_request (ticket_id, city_manager_id, created_at, title, description)
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
	const comments = await db.query(`SELECT comment, created_at, user_id FROM Service_request_comment 
	WHERE service_request_id = ?`, [requestID]);
	const technicians = await db.query(`SELECT technician_id,name,surname,user_type,email,phone_num FROM Service_request_technician srt NATURAL JOIN Users u
	WHERE u.id = srt.technician_id AND service_request_id = ?`, [requestID]);

	let request = requests[0];

	if(!request)
		return null;

	request.comments = comments;
	request.technicians = technicians;

	return request;
}

async function editRequest(request, req) {
	const result = await db.query(`
	UPDATE Service_request
	SET title = ?,
		description = ?
	WHERE Service_request.id = ? AND Service_request.city_manager_id =  ${req.user.id}`, [request.title, request.description, request.request_id]);

	return result;
}

module.exports = {
	getMultiple,
	getAll,
	getBySearch,
	getByID,
	editRequest,
	create,
}
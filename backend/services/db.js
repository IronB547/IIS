const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params, namedPlaceholders=false) {
	let connection = await mysql.createConnection(config.db);
	connection.config.namedPlaceholders = namedPlaceholders;
	const [results, ] = await connection.execute(sql, params);

	return results;
}

module.exports = {
  	query
}


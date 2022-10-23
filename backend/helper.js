class ValidationError extends Error {
	constructor(message) {
	  super(message); // (1)
	  this.name = "ValidationError"; // (2)
	}
}

function getOffset(currentPage = 1, listPerPage) {
	if(!Number.isInteger(Number(currentPage)))
		throw new ValidationError("Page number must be an integer");

    return (currentPage - 1) * [listPerPage];
}
  
function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

//input: query params
//output: where clause
function getWhereClause(params) {
	console.debug(params);
	let where = "AND ";
	let first = true;
	for(let key in params) {
		if(!first) {
			where += " AND ";
		}else{
			first = false;
		}
		let value = params[key];
		if(Number.isInteger(Number(value))) {
			where +=   `${key} = ${params[key]} `;
		}else{
			where += `${key} = '${params[key]}' `;
		}
	}
	return where;
}
  
module.exports = {
    getOffset,
    emptyOrRows,
    getWhereClause,
	ValidationError
}


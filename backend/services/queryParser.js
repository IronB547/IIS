// import { ValidationError } from "../helper";
// import { createUserSchema } from "../schemas/users";

const ValidationError = require("../helper").ValidationError;

class QueryParser {
    constructor(query) {
        this.query = query;
    }
    
    getQuery(name) {
        return this.query.name;
    }

    generateWhereClause() {
        let where = "";
        let params = [
            "title",
            "solutionState",
            "description",
            "cityManagerID",
            "createdAt",
            "assigned",
            "ticketID"
        ]

        for (let key in this.query) {
            let value = this.query[key]
            //!TODO validate value
            if(key == "q"){
                where += ` TITLE LIKE '%${this.query[key]}%' AND`;
            }else if (/*key != "page" && key != "limit" &&*/ params.includes(key)) {
                where += ` ${key} = '${this.query[key]}' AND`;
            }
        }

        return where.slice(0, -3);
    }

}

module.exports = QueryParser;
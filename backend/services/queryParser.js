// import { ValidationError } from "../helper";
// import { createUserSchema } from "../schemas/users";

const ValidationError = require("../helper").ValidationError;

/**
 * @typedef {ParamType} ParamType - The type of the parameter
 * EXACT - the parameter must be exactly the same as the value in the database
 * LIKE - the parameter must be similar to the value in the database
 * CUSTOM - the parameter must be a custom query, must contain handler function
 * 
 */
const ParamType = {
    EXACT: "exact",
    LIKE: "like",
    CUSTOM: "custom"
};

/**
 * @typedef {Object} QueryParam
 * @property {string} query - The query which will be parsed
 * @property {array of queryParam} queryParams - The query parameters which this parser recognizes
 */
class QueryParser {

    /**
     * @queryParams {array of queryParam} - The query parameters which this parser recognizes
     * @note Query param contains the following properties:
     * @property {string} name - The name of the query parameter
     * @property {string} type - The type of the query parameter (exact, like, custom) - see ParamType
     * @property {function} handler - The handler function for the query parameter (only for custom type)
     */ 
    constructor(query = null, queryParamsAdditional = []) {
        this.query = query;
        this.thisWhereClause = "";
        this.orderByClause = {
            orderBy: "",
            order: ""
        };

        this.queryParams = [
            {name: "id", type: ParamType.EXACT},
            {name: "title", type: ParamType.LIKE},
            {name: "description", type: ParamType.LIKE},
            {name: "createdAt", type: ParamType.EXACT},
            {name: "q", type: ParamType.CUSTOM, handler: (value) => {
                return ` TITLE LIKE '%${value}%'`;
            }},
            {name: "price", type: ParamType.EXACT},
            {name: "solutionState", type: ParamType.EXACT},
            {name: "cityManagerID", type: ParamType.EXACT},
            {name: "technicianID", type: ParamType.CUSTOM, handler: (value) => {
                return ` id IN (SELECT serviceRequestID FROM Service_request_technician WHERE technicianID = ${value})`;
            }},
            {name: "ticketID", type: ParamType.EXACT},
        ];
        this.queryParams = this.queryParams.concat(queryParamsAdditional);

        if (this.query) {
            this.parseQuery();
        }
    }
    
    getQueryParam(name) {
        return this.queryParams.find(param => param.name.toLowerCase() == name.toLowerCase());
    }

    parseQuery() {
        let where = "";
        let orderBy = "";
        let order = "";

        for (let key in this.query) {
            let value = this.query[key]
            //!TODO validate value
            const param = this.getQueryParam(key);
            if (param) {
                if (param.type == ParamType.EXACT) {
                    where += ` ${key} = '${value}' AND`;
                } else if (param.type == ParamType.LIKE) {
                    where += ` ${key} LIKE '%${value}%' AND`;
                } else if (param.type == ParamType.CUSTOM) {
                    where += param.handler(value) + " AND";
                }
            }else if(key == "orderBy") {
                if(!this.getQueryParam(value))
                    throw new ValidationError("Invalid order by parameter");
                orderBy = value;
                continue;
            }else if(key == "order") {
                if(value != "ASC" && value != "DESC")
                    throw new ValidationError("Invalid order parameter");
                order = value;
                continue;
            } else {
                throw new ValidationError("Invalid query parameter");
            }
        }

        where = where.slice(0, -3);
        this.whereClause = where;
        this.orderByClause = {
            orderBy: orderBy,
            order: order
        };
        return where;
    }

    getWhereClause() {
        return this.whereClause;
    }

    getOrderByClause() {
        if(this.orderByClause.orderBy == "")
            return null;
        return `${this.orderByClause.orderBy} ${this.orderByClause.order}`;
    }

}

module.exports = {QueryParser, ParamType};
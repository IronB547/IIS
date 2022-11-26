const QueryParser = require("./queryParser").QueryParser;
const ParamType = require("./queryParser").ParamType;

class QueryParserTicket extends QueryParser {
    constructor(query = null, queryParamsAdditional = []) {
        
        queryParamsAdditional = queryParamsAdditional.concat([
            {name: "location", type: ParamType.LIKE},
            {name: "status", type: ParamType.EXACT},
            {name: "userID", type: ParamType.EXACT},
            {name: "minimal", type: ParamType.FLAG},
        ]);

        super(query, queryParamsAdditional);
    }
}

module.exports = QueryParserTicket;
const QueryParser = require("./queryParser").QueryParser;
const ParamType = require("./queryParser").ParamType;

class QueryParserTicket extends QueryParser {
    constructor(query = null, queryParamsAdditional = []) {
        
        queryParamsAdditional = queryParamsAdditional.concat([
            {name: "price", type: ParamType.EXACT},
            {name: "solutionState", type: ParamType.EXACT},
            {name: "cityManagerID", type: ParamType.EXACT},
            {name: "technicianID", type: ParamType.CUSTOM, handler: (value) => {
                return ` id IN (SELECT serviceRequestID FROM Service_request_technician WHERE technicianID = ${value})`;
            }},
            {name: "ticketID", type: ParamType.EXACT},
        ]);

        super(query, queryParamsAdditional);
    }
}

module.exports = QueryParserTicket;
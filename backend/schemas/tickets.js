const Joi = require('joi');

const createTicketSchema = Joi.object().keys({
    title: Joi.string().min(1).max(255).required(),
    location: Joi.string().min(1).max(511),
    description: Joi.string().min(1).max(1023).required(),
    status: Joi.number().min(0).max(3).default(0),
    userID: Joi.number().required
});

module.exports = {
    createTicketSchema
};
const Joi = require('joi');

//First define schema for the object
const createServiceRequest = Joi.object().keys({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1023).required(),
    ticketID: Joi.number().required(),
});

module.exports = {
    createServiceRequest
};
const Joi = require('joi');

//First define schema for the object
const createServiceRequest = Joi.object().keys({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1023).required(),
    ticketID: Joi.number().required(),
});

const editServiceRequest = Joi.object().keys({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1023).required(),
});

const changeState = Joi.object().keys({
    state: Joi.number().required().min(0).max(1),
});

module.exports = {
    createServiceRequest
};
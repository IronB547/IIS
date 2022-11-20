const Joi = require('joi');

//First define schema for the object
const createServiceRequest = Joi.object().keys({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1023).required(),
    ticketID: Joi.number().default(null),
    solutionState: Joi.number().min(0).max(1).default(0),
});

const editServiceRequestTechnician = Joi.object().keys({
    requestID: Joi.number().required(),
    solutionState: Joi.number().min(0).max(1).required(),
    solutionTime: Joi.string().max(255).required(),
    price: Joi.string().max(255).required(),
}).unknown();

const editServiceRequest = Joi.object().keys({
    requestID: Joi.number().required(),
    description: Joi.string().min(2).max(1023).required(),
    title: Joi.string().min(2).max(255).required(),
    solutionState: Joi.number().min(0).max(1).required(),
    solutionTime: Joi.string().max(255).allow(null),
    expectedTime: Joi.string().max(255).allow(null),
    price: Joi.string().max(255).allow(null),
}).unknown();

const changeState = Joi.object().keys({
    state: Joi.number().required().min(0).max(1),
});

module.exports = {
    createServiceRequest,
    editServiceRequestTechnician,
    editServiceRequest,
};
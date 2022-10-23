const Joi = require('joi');


//First define schema for the object
const createUserSchema = Joi.object().keys({
    name: Joi.string().min(2).max(255).required(),
    surname: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).max(255).required(),
    userType: Joi.number().min(0).max(3).default(0),
    phoneNum: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im).messages({'string.pattern.base': `Must be a valid phone number!`}).required()
});

module.exports = {
    createUserSchema
};
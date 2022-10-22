const Joi = require('joi');

//First define schema for the object
const createUserSchema = Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    surname: Joi.string().min(2).max(30).required(),
    email: Joi.string().email(),
    password: Joi.string().alphanum().min(8).max(33).required(),
    userType: Joi.number().min(0).max(3).default(0),
    phoneNum: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()
});

module.exports = {
    createUserSchema
};
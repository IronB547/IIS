const Joi = require('joi');

const messagesCZ = {
    'string.base': `Pole musí být řetězec`,
    'string.empty': `Pole nemůže být prázdný řetězec`,
    'string.min': `Pole musí mít alespoň {#limit} znaků`,
    'string.max': `Pole musí mít maximálně {#limit} znaků`,
    'string.email': `E-mail musí být platná emailová adresa`,
    'string.pattern.base': `Pole musí obsahovat platné znaky`,
    'string.pattern.name': `Jméno musí obsahovat pouze písmena`,
    'string.pattern.password': `Heslo musí mít alespoň 8 znaků`,
    'string.pattern.phone': `Telefonní číslo musí mít formát +420123456789`,
}

//First define schema for the object
const createUserSchema = Joi.object().keys({
    name: Joi.string().min(2).max(255).required().messages(messagesCZ),
    surname: Joi.string().min(2).max(255).required().messages(messagesCZ),
    email: Joi.string().email().required().messages(messagesCZ),
    password: Joi.string().min(8).max(255).required().messages(messagesCZ),
    userType: Joi.number().min(0).max(3).default(0).messages(messagesCZ),
    phoneNum: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    .messages(messagesCZ).required(),
    isBlocked: Joi.boolean().default(false).messages(messagesCZ),
});

module.exports = {
    createUserSchema
};
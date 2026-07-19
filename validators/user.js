const Joi = require("joi");

const registerUserSchema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .max(64)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#\-_])/, 'strong password')
        .required()
        .messages({
            'string.pattern.name': 'Password must contain uppercase, lowercase, number, and special character',
            'string.min': 'Password must be at least {#limit} characters',
            'any.required': 'Password is required',
        }),
});

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
        // .min(8)
        // .max(64)
        // .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#\-_])/, 'strong password')
        
        // .messages({
        //     'string.pattern.name': 'Password must contain uppercase, lowercase, number, and special character',
        //     'string.min': 'Password must be at least {#limit} characters',
        //     'any.required': 'Password is required',
        // }),
});

const resendVerificationLinkSchema = Joi.object({
    email: Joi.string().email().required(),
});

module.exports = {
    registerUserSchema,
    loginUserSchema,
    resendVerificationLinkSchema

};

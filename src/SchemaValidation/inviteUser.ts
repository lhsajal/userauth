import joi from 'joi';

namespace schemas {
    export const inviteUserValidation = joi.object({
        name: joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        email: joi.string().email().required(),
        role: joi.string().required(), // it will mongo Object ID later on.
        office: joi.array().items(joi.string()).required(), // it will array of mongo Object IDs later on.
        status: joi.number().valid(0, 1).required()
    });
    
    export const normalSignupValidation = joi.object({
        password: joi.string()
            .min(8) // Minimum length of 8 characters
            .max(30) // Maximum length of 30 characters
            .required()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
            .message('Password must contain at least one uppercase letter, one lowercase letter, one special character, one number, and be between 8 and 30 characters long'),
        confirmPassword: joi.string()
            .valid(joi.ref('password'))
            .required()
            .label('Confirm Password')
            .messages({ 'any.only': '{{#label}} must match the password' })
    });
    
    export const passwordReset = joi.object({
        email: joi.string().email().required()
    });
    
    export const normalLoginValidation = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
}

export default schemas;
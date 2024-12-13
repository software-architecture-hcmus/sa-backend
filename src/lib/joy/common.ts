import Joi from "joi";

export const symbol = Joi.string().custom((value, helper) => {
    if (!value) return helper.message({ custom: "Invalid address" });
    return value;
});

export const page = Joi.number().min(0); 
export const limit = Joi.number().min(5);
export const sort = Joi.string().valid("desc", "asc");

// Username validation
export const username = Joi.string()
    .alphanum() // Only alphanumeric characters (letters and numbers)
    .min(3) // Minimum length of 3 characters
    .max(30) // Maximum length of 30 characters
    .required() // Username is required
    .messages({
        "string.base": "Username must be a string",
        "string.alphanum": "Username must only contain alphanumeric characters",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username can be up to 30 characters long",
        "any.required": "Username is required"
    });

// Password validation
export const password = Joi.string()
    .min(8) // Minimum length of 8 characters
    .max(100) // Maximum length of 100 characters
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])")) // At least one uppercase, one lowercase, one number, and one special character
    .required() // Password is required
    .messages({
        "string.base": "Password must be a string",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password can be up to 100 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required"
    });
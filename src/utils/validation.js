const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error('Name is not valid!');
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Email is not valid!');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Please enter strong Password!');
    }
}

const loginValidation = (req) => {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
        throw new Error('Email is not valid!');
    } else if (!password) {
        throw new Error('Password is required!');
    }
}


const validateEditProfileData = (req) => {
    const allowedEditFields = ["photoUrl", "about", "skills", "age", "gender", "lastName"];
    const editDataKeys = Object.keys(req.body);
    const isEditAllowed = editDataKeys.every(field => allowedEditFields.includes(field));
    if (!isEditAllowed) {
        throw new Error("Invalid edit request!");
    }
    req.editDataKeys = editDataKeys;
}
module.exports = { validateSignUpData, loginValidation, validateEditProfileData };
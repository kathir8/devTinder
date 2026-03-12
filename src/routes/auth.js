const express = require('express');
const authRouter = express.Router();

const User = require('../models/user');
const { validateSignUpData, loginValidation } = require('../utils/validation');
const bcrypt = require('bcrypt');

authRouter.post('/login', async (req, res) => {
    try {
        loginValidation(req);
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = await user.getJWT();
        res.cookie('token', token);

        res.status(200).send('Login successful');

    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
});

authRouter.post('/signup', async (req, res) => {
    try {

        // Validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password, skills } = req.body;

        // Encrypt password
        const passwordHash = await bcrypt.hash(password, 10);

        // Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            skills,
            password: passwordHash
        });

        await user.save();
        res.send('User saved successfully');
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }

});

authRouter.get('/logout', async (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()) })
        .send('Logout successful');
});

module.exports = authRouter;
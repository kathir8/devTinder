const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');


// Fetch profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send('Error fetching user: ' + err.message);
    }
});


profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);
        const { editDataKeys } = req;
        const loggedInUser = req.user;
        editDataKeys.forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your Profile updated successfully`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
});

module.exports = { profileRouter };
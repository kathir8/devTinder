const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = 'firstName lastName age gender photoUrl about skills';

// Get all pending connection requests for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const data = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA);
        // }).populate('fromUserId', ['firstName','lastName','age','gender','photoUrl','about','skills']);

        res.json({
            message: 'Data fetched successfully',
            data
        });

    } catch (err) {
        return res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const connectionRequests = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUserId, status: 'accepted' },
                { fromUserId: loggedInUserId, status: 'accepted' },
            ]
        })
            .populate('fromUserId', USER_SAFE_DATA)
            .populate('toUserId', USER_SAFE_DATA);

        const data = connectionRequests.map(row => {
            if (row.fromUserId._id.toString() === loggedInUserId) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        return res.json({ data });


    } catch (err) {
        return res.status(400).send("ERROR: " + err.message);
    }
});


module.exports = userRouter;
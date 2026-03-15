const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFE_DATA = 'firstName lastName age gender photoUrl about skills';

// Get all pending connection requests for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const data = await ConnectionRequest.find({
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
        const connectionRequests = await ConnectionRequest.find({
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

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // Get all users who have connection requests with the logged-in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId');

        // Extract the user IDs that are already connected/requested
        const connectedUserIds = new Set();
        connectionRequests.forEach(req => {
            connectedUserIds.add(req.fromUserId.toString());
            connectedUserIds.add(req.toUserId.toString());
        });

        // Get all users except the logged-in user
        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(connectedUserIds) } }
            ]
        }).select(USER_SAFE_DATA);

        // Filter out users who already have connection requests
        if (!users.length) {
            return res.status(404).send('User not found');
        }

        res.send(users);
    } catch (err) {
        return res.status(400).send("ERROR: " + err.message);
    }

});


module.exports = userRouter;
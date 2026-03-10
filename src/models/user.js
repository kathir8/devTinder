const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        emailId: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            validate: [v => validator.isEmail(v), "Invalid email"]
        },
        password: {
            type: String,
            required: true,
            validate: [v => validator.isStrongPassword(v), "Password must be strong"]
        },
        age: {
            type: Number,
            min: 18,
            trim: true
        },
        gender: {
            type: String,
            validate: [
                v => ["male", "female", "other"].includes(v.toLowerCase()),
                "Invalid gender"
            ]
        },
        photoUrl: {
            type: String,
            validate: [v => validator.isURL(v), "Invalid URL"]
        },
        about: {
            type: String,
            default: "Hey there! I'm using DevTinder.",
            maxlength: 500,
            trim: true
        },
        skills: {
            type: [String],
            validate: [v => v.length <= 5, "Skills cannot be more than 5"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50
    },
    lastName:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value.toLowerCase())){
                throw new Error("Invalid gender - validate function automatically runs only when create a new object");
            }
        }
    },
    photoUrl:{
        type: String
    },
    about:{
        type:String,
        default:"Hey there! I'm using DevTinder."
    },
    skills:{
        type:[String]
    }
});

module.exports = mongoose.model('User', userSchema);
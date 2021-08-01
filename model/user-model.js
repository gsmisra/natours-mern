const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/* Screating the schema */
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'User name filed is mandatory!']
    },
    email: {
        type: String,
        required: [true, 'User email is mandatory!'],
        unique: [true, 'This email is already exists in our account!'],
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email!']   //This is a custom validator
    },
    photo: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: [true, 'Please set a default password!'],
        minlength: [8, 'Password must of length >=8 chars'],
        maxlength: [12, 'Password must of length <=12 chars']
    },
    passwordConfirmed: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function(el){            //These custom validator works only on POST requests
                return el === this.password;
            },
            message: 'Err: Password are not same!'
        }
    }
});


/* 
    Now we will use a Document pre save middleware to encrypt the password 
    Here we will use this.isModified() method to check if the field is 
    modified only then run this middleware.
    So basically this will run ONLY if the password is modified
*/
userSchema.pre('save', async function( next ){
    if(!this.isModified('password')){ 
        return;
    } else{
        this.password = await bcrypt.hash(this.password, 12);   //Password encryption logic. The 12 is a cost value of the CPU memory needed to perform the encryption
        this.passwordConfirmed = undefined;
    }

    next();
})


/* Creating the model out of the schema */
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
const User = require('../model/user-model');
const catchAsync = require('../utils/error-handling/catch-async');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/error-handling/app-error');


exports.signup = catchAsync(async(req, res, next) => {
    try{
        
        //let newUser = await User.create(req.body);
        /*  
            Here we add only the specific field into the database which are not sensitive.
            That way no one can just add anything they want into the db from the request body
         */

        let newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmed: req.body.passwordConfirmed
        });

        let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JwT_EXPIRY_TIMER
        });

        res.status(201).json({
            status: 'success',
            accessToken: token,
            message: 'user created!',
            data: newUser
        });
    } catch(err){
        res.status(400).json({
            status: 'Fail',
            message: 'Error creating new user',
            error: err.message
        });
    }
});



exports.login = catchAsync(async (req, res, next) => {
    let { email, password } = req.body;
    
    /* Check if email and password exist
        Check if user and password is correct
        If above 2 is OK then send JWT back as a response    
    */

    if(!email || !password){
        /*  res.status(400).json({
            status:'OK',
            message:`Looks like email or the password is not provided!`
        }); */

        return next(new AppError('Please enter valid email and password', 400));   
    } else{
        /* The select method with - will remove an attribute and we are adding back the password into the response 
        which was reoved in the data model using the select + logic */
        let user = await User.findOne({email: email}).select('-__v').select('+password');
        res.status(200).json({
            status:'OK',
            data: user
        });
    }
})
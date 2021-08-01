const User = require('../model/user-model');
const catchAsync = require('../utils/error-handling/catch-async');


exports.signup = catchAsync(async(req, res, next) => {
    try{
        let newUser = await User.create(req.body);
        res.status(201).json({
            status: 'success',
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


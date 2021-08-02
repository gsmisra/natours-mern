const { promisify } = require('util');
const User = require('../model/user-model');
const catchAsync = require('../utils/error-handling/catch-async');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/error-handling/app-error');


/* This function will generate the user token */
const signInToken = ((idToEncrypt) => {
    return jwt.sign({ id:idToEncrypt }, process.env.JWT_SECRET, {
        expiresIn: process.env.JwT_EXPIRY_TIMER
    });
})

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

        let token = signInToken(newUser._id);
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
        console.log(`The user login ffffunction in auth-controller is missing a valid email / password!`);
        return next(new AppError('Please enter valid email and password', 400));   
    } else{
        /* The select method with - will remove an attribute and we are adding back the password into the response 
        which was reoved in the data model using the select + logic */
        let user = await User.findOne({email: email}).select('-__v').select('+password');
        console.log(`The user trying to login is ${user}`);

        /*  Now call the instance method correctPassword() defined in user-model 
            This instance method will be available throught the process and can be called on the User schema as shown below
        */
       let corrrectPass = await user.correctPassword(password, user.password);    //This user.password is coming form the above line from the User.findOne() query
       console.log(`Is the password correct ?  ${corrrectPass}`);
        if(!user || !corrrectPass){
            res.status(401).json({
                status:'OK',
                data: 'Entered password is incorrect for the user!', 
                user: user.email
            });
        }else{
            let token = signInToken(user._id);
            console.log(`Signin token ${token}`);
            res.status(200).json({
                status:'OK',
                message: 'Login Successful!',
                user: user.email,
                userToken: token
            });
        }
    }
})


/* This middleware function will allow only logged in users to view all the tours */
exports.protect = catchAsync(async (req, res, next) => {

    let token;
    let decodedtoken;
    /* Logical steps:*/
        // 1_ get the uer token and check if its !null
        if(req.headers.authorization && req.headers.authorization.startsWith('auth')){
            token = req.headers.authorization.split(' ')[1];
        }

        // 2_ validate the token if its valid using the jwt algo
        if(!token) {
            return next(new AppError('You need to be logged in to view this informaiton!', 403));
        } else{
            try{
                decodedtoken = await promisify (jwt.verify)(token, process.env.JWT_SECRET);
                console.log(decodedtoken);
            } catch(err){
                res.status(401).json({
                    status: 'OK',
                    message: 'Your token has expired! Please relogin.',
                    err: err.message
                });
            }
        }
        // 3_ check if user still exist
        /* 
            decodedtoken is the object we get from above step. From this we can get the id and pass it
            to the findById () method.
        */
        let currectLoggedinUser = await User.findById( decodedtoken.id );
        if(!currectLoggedinUser){
            return next(new AppError('Looks like your token is valid but your user id is no where to be found!', 403));
        }

        // 4_ check if user changed password after the jwt token was issued
        /* 
            
        */
        // 5_ only then allow next() routes
    
    next();
})
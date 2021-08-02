const User = require('../model/user-model');

/* exports.defautResponse = (req, res, next) => {
  res.status(500).json({
    status: 'success',
    msg: 'not yet implemented',
    src: 'user-controller middleware',
  });

  next();
}; */

/* User Controllers */
exports.getAllUsers = async (req, res) => {
  try{
    let allusers = await User.find();
    res.status(200).json({
      status:'OK',
      numberOfUsers: allusers.length,
      data: allusers
    });
  }catch(err){
    console.log(`Error retriving all users ${err.message}`);
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getUser = (req, res) => {};


exports.deleteAllUsers = async (req, res) => {
  exports.updateUser = (req, res) => {};
  try{
    await User.deleteMany({});
    res.status(204).send('All data deleted in User schema!');
  }catch(err){

  }
};

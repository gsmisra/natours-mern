exports.defautResponse = (req, res, next) => {
  res.status(500).json({
    status: 'success',
    msg: 'not yet implemented',
    src: 'user-controller middleware',
  });

  next();
};

/* User Controllers */
exports.getAllUsers = (req, res) => {};

exports.createUser = (req, res) => {};

exports.getUser = (req, res) => {};

exports.updateUser = (req, res) => {};

exports.deleteUser = (req, res) => {};

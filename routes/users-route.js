const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');


/* Calling the global middleware middle-ware function */
router.use((req, res, next) => {
  //res.status(500).send('This resource is not yet ready');
  
  /* Or call a function from the user-controller class into this */
  //UserControllers.defautResponse

  next();
});

/* Users routers */
router
  .route('/')
  .get(UserControllers.getAllUsers);

router
  .route('/:Id')
  .get(UserControllers.getUser)
  .patch(UserControllers.updateUser)
  .delete(UserControllers.deleteUser);

router.post('/signup', authController.signup);

module.exports = router;

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

/*
 Users routers */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieves all users.
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: Retrives the list of active users in mongoDb.
 *         content:
 *           application/json:
 *             schema:
 */
router
  .route('/')
  .get(UserControllers.getAllUsers)
  .delete(UserControllers.deleteAllUsers);

/* router
  .route('/:Id')
  .get(UserControllers.getUser)
  .patch(UserControllers.updateUser) */


router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;

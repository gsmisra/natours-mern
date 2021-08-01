const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour-controller');


/* This is a param middleware function that executes only when there is a certain type of param in the request api */
//router.param('id');


/* 
Router definition */

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Retrieves all tours.
 *     description: Retrieve a list of tours from Db. 
 *     responses:
 *       200:
 *         description: Retrives the list of tours in mongoDb.
 *         content:
 *           application/json:
 *             schema:
 */
router
  .route('/')
  .get(tourController.getAllTours)

  /**
 * @swagger
 * /tours:
 *   post:
 *     summary: Create a new tour
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Leanne Graham
*/
  .post(tourController.addTour); //checkTourData is a middleware function written in the tour controller.

router
  .route('/find-tour/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

router
  .route('/findByName')
  .get(tourController.getTourByName)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

router
  .route('/load-tour')
  .get(tourController.loadTours);

router.route('/delete-all')
  .delete(tourController.deleteAllTours);


/* Top 5 cheap tours */
router.route('/top-3-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

/* Get tour stats */
router.route('/stats').get(tourController.getTourStats);


module.exports = router;
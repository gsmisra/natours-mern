const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour-controller');


/* This is a param middleware function that executes only when there is a certain type of param in the request api */
//router.param('id');


/* Router definition */
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addTour); //checkTourData is a middleware function written in the tour controller.

router
  .route('/find-tour/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

router
  .route('/name/:name')
  .get(tourController.getTourByName)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

router
  .route('/load-tour')
  .get(tourController.loadTours);

router.route('/delete-all')
  .delete(tourController.deleteAllTours);

module.exports = router;
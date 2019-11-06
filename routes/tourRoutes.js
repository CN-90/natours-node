const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

// Make sure ID is valid and return error if not.
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.validateBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
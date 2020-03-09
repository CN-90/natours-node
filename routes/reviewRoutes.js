const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// merge params allows the tourId params to be passed from the tourroutes.
const router = express.Router({ mergeParams: true });

// all routes below are protected
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;

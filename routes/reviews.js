const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviews");

const advancedResults = require("../middleware/advancedResults");
const Review = require("../models/Review");
// We are merging the url params because it's a shared resource with bootcamp
// Check route split in getReviews controller
const router = express.Router({ mergeParams: true });

const { protect ,authorize} = require("../middleware/auth");

//Courses routes without any parameters
router
  .route("/")
  .post(protect, authorize('user','admin'),createReview)
  .get(
    advancedResults(Review,{
        path: 'bootcamp',
        select: 'name description'
    }),
    getReviews
  );

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize('user','admin'),updateReview)
  .delete(protect, deleteReview);

module.exports = router;

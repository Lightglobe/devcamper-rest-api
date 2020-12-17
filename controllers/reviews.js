const Review = require("../models/Review");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");


// @desc Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  //Route split based on existence of bootcamp id
  if (req.params.bootcampId) {
    reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Create a new review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  // Make sure the bootcamp exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot create review. Bootcamp not found with the id ${req.params.bootcampId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc Get a single review
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Update a review
// @route PUT /api/v1/reviews/:id
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is review owner
  if (review.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User with user id ${req.user.id} is not authorized to update the review ${course._id}`
      ),
      401
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Delete a review
// @route GET /api/v1/reviews/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`),
      400
    );
  }
  // Make sure user is review owner
  if (review.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User with user id ${req.user.id} is not authorized to delete the review ${course._id}`
      ),
      401
    );
  }

  review.remove();
  res.status(200).json({
    success: true,
    data: review,
  });
});

const Course = require("../models/Course");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const { restart } = require("nodemon");
// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  //Route split based on existence of bootcamp id
  if (req.params.bootcampId) {
    courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      cout: courses.length,
      data: course,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Create a new course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  // Make sure the bootcamp exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot create course. Bootcamp not found with the id ${req.params.bootcampId}`,
        404
      )
    );
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with user id ${req.user.id} is not authorized to create the course`
      ),
      401
    );
  }
  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc Get a single course
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Update a course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with user id ${req.user.id} is not authorized to update the course ${course._id}`
      ),
      401
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Delete a course
// @route GET /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      400
    );
  }
  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with user id ${req.user.id} is not authorized to update the course ${course._id}`
      ),
      401
    );
  }

  course.remove();
  res.status(200).json({
    success: true,
    data: course,
  });
});

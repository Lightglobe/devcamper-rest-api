const express = require("express");
const {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/courses");
const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/Course");
// We are merging the url params because it's a shared resource with bootcamp
const router = express.Router({ mergeParams: true });

const { protect } = require("../middleware/auth");

//Courses routes without any parameters
router
  .route("/")
  .post(protect, createCourse)
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  );

router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;

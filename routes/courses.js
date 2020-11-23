const express = require("express");
const {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/courses");

// We are merging the url params because it's a shared resource with bootcamp
const router = express.Router({ mergeParams: true });

//Courses routes without any parameters
router.route("/").post(createCourse).get(getCourses);

router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;

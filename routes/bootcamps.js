const express = require("express");
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampUploadPhoto,
} = require("../controllers/bootcamps");

//Include other resource routers
const courseRouter = require("./courses");
//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

//Bootcamp routes without any parameters
router.route("/").get(getBootcamps).post(createBootcamp);

//Routes that require id parameter
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

//Routes that require zipcode and distance
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

//Routes that require photo files
router.route("/:id/photo").put(bootcampUploadPhoto);

module.exports = router;

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

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

//Include other resource routers
const courseRouter = require("./courses");
const reviewsRouter = require("./reviews");
//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewsRouter);

//Bootcamp routes without any parameters
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

//Routes that require id parameter
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

//Routes that require zipcode and distance
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

//Routes that require photo files
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampUploadPhoto);

module.exports = router;

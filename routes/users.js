const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const User = require("../models/User");

// Every protected route has a req.user attached to it through auth middleware
const { protect, authorize } = require("../middleware/auth");
// Anything below this will use protect
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers);
router
  .route("/:id")
  .get(getUser)
  .put(createUser)
  .post(updateUser)
  .delete(deleteUser);

module.exports = router;

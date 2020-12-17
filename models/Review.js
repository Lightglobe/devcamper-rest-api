const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a review title"],
    unique: true,
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  text: {
    type: String,
    required: [true, "Please add a review"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});


// Middleware with static functions

//Static method to get avg rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating:obj[0].averageRating,
    });
  } catch (error) {
    console.log(error.red);
  }
};

//Call getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

//Call getAverageCost before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});




module.exports = mongoose.model("Review", ReviewSchema);
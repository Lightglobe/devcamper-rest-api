const fs = require("fs");
const mongoose = require("mongoose");
const color = require("colors");
const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Review");

// Connect to Db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read Json files
//__dirname: current directory name
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

//Imports into db
const importData = async () => {
  try {
    await Promise.all([
      Bootcamp.create(bootcamps),
      Course.create(courses),
      User.create(users),
      Review.create(reviews)
    ]);
    console.log("Data imported....".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Promise.all([
      Bootcamp.deleteMany(),
      Course.deleteMany(),
      User.deleteMany(),
      Review.deleteMany()
    ]);
    console.log("Data destroyed....".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red);
  }
};

// Arguements to pass during the npm run
// cmd: node seeder -i
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

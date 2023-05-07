const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    mongoose.connect(
      "mongodb+srv://ashish:FjUOwEyEeIAbgJZj@cluster0.fnw2b04.mongodb.net/"
    );
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

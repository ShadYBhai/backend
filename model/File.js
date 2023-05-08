const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  size: Number,
  path: String,
});

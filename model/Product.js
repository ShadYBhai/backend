const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  netPrice: { type: Number, required: true },
  grossPrice: { type: Number, required: true },
  vat: { type: Number, required: true },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

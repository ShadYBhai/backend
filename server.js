const express = require("express");
const Product = require("./model/Product");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());
app.use(cors());
connectDB();

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/add-product", async (req, res) => {
  const { productName, vat, netPrice, grossPrice, quantity } = req.body;

  const product = await Product.create({
    productName,
    quantity,
    netPrice,
    grossPrice,
    vat,
  });

  if (product) {
    const response = {
      productName: product.productName,
      quantity: product.quantity,
      netPrice: product.grossPrice,
      grossPrice: product.grossPrice,
      vat: product.vat,
    };
    return res.status(201).json(response);
  }
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { productName, vat, quantity, netPrice, grossPrice } = req.body;

  try {
    // Find the product by ID and update its fields
    const product = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        vat,
        quantity,
        netPrice,
        grossPrice,
      },
      { new: true } // Return the updated product instead of the old one
    );

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update product" });
  }
});

// Start the server and listen for incoming requests
app.get("/products", async (req, res) => {
  const products = await Product.find({});

  res.json(products);
});

app.listen(4000, () => console.log("server is running on 4000..."));

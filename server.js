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
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update product" });
  }
});

app.get("/products", async (req, res) => {
  const products = await Product.find({});

  res.json(products);
});

app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then((product) => {
      res.send(product);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    const filename = file.originalname.replace(/\s/g, "_");
    callback(null, `${Date.now()}_${filename}`);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  // Handle the uploaded file
});

app.listen(4000, () => console.log("server is running on 4000..."));

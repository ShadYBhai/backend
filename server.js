const express = require("express");
const Product = require("./model/Product");
const cors = require("cors");
const connectDB = require("./config/db");
const File = require("./model/File");
const multer = require("multer");
const initializeApp = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const firebase = require("firebase/app");

const app = express();

app.use(express.json());
app.use(cors());
connectDB();

const firebaseConfig = {
  apiKey: "AIzaSyC_oboXcmRh4_y0Szn4MgoWN_7i2qBDPyg",
  authDomain: "ace-international.firebaseapp.com",
  projectId: "ace-international",
  storageBucket: "ace-international.appspot.com",
  messagingSenderId: "217036369681",
  appId: "1:217036369681:web:8b844cc8a11aaa089866b0",
};

firebase.initializeApp(firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("Received file:", req.file);

    const storageRef = ref(storage, `${req.file}`);

    await uploadBytes(storageRef, req.file.buffer);
    const downloadURL = await getDownloadURL(storageRef);

    console.log("File uploaded successfully, URL:", downloadURL);
    res.status(200).json({ imageUrl: downloadURL });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file");
  }
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

app.post("/add-product", upload.single("image"), async (req, res) => {
  const { productName, vat, quantity, netPrice, grossPrice, imageUrl } =
    req.body;
  const image = req.file;

  console.log(image);

  try {
    const product = new Product({
      productName,
      vat,
      quantity,
      netPrice,
      grossPrice,
      imageUrl,
    });

    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to add product" });
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

app.listen(4000, () => console.log("server is running on 4000..."));

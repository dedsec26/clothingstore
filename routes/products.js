const Products = require("../models/products");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const checkAuth = require("../utils/auth-rules/staffchekAuth");

const staffCheck = require("../utils/auth-rules/staffCheck");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    dir = __dirname.slice(0, 38) + "/src/products/" + req.body.product.name;
    // console.log(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: fileStorageEngine }).fields([
  {
    name: "img1",
    maxCount: 1,
  },
  {
    name: "img2",
    maxCount: 1,
  },
  {
    name: "img3",
    maxCount: 1,
  },
]);

router.get("/", async (req, res, next) => {
  try {
    const lowStock = 0;
    const products = await Products.find({
      stock: { $gt: lowStock },
    }).sort({ name: 1 });
    res.render("partials/products/products", {
      products,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/add", checkAuth, staffCheck, (req, res) => {
  let temp = __dirname;
  // console.log(temp.slice(0, 38));
  // console.log(temp);
  const msg = req.query;
  // console.log(req.query);
  res.render("partials/products/addproduct", { msg });
});
router.get("/update", checkAuth, staffCheck, async (req, res, next) => {
  try {
    const msg = req.query;
    const products = await Products.find().sort({ name: 1 });
    const result = {};
    res.render("partials/products/updateproducts", {
      products,
      msg,
      result,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", checkAuth, staffCheck, upload, async (req, res, next) => {
  try {
    const msg = {};
    const { img1, img2, img3 } = req.files;
    // console.log(img1);
    const { product } = req.body;
    const prod = new Products(product);

    if (img1) {
      let newpath = img1[0].path.slice(52);
      prod.img1 = newpath;
      // console.log(newpath);
    }
    if (img2) {
      let newpath = img2[0].path.slice(52);
      prod.img2 = newpath;
      // console.log(newpath);1
    }
    if (img3) {
      let newpath = img3[0].path.slice(52);
      prod.img3 = newpath;
      // console.log(newpath);1
    }
    result = await prod.save();
    // console.log(result);
    msg.success = "Product Added Succesfully!!!";
    res.redirect(`/products/add?msg=${msg.success}`);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", checkAuth, staffCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { product } = req.body;
    // console.log(req.body);
    const result = await Products.findByIdAndUpdate(id, {
      price: product.price,
      stock: product.stock,
    });
    msg = {};

    res.redirect(
      `/products/update?msg=${result.name}%20successfully%20updated.`
    );
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", checkAuth, staffCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Products.findByIdAndDelete(id);
    const msg = {};
    msg.success = "Product Deleted Succesfully!!!";
    res.redirect(`/products/update?msg=${msg.success}`);
  } catch (error) {
    next(error);
  }
});
router.get("/:id/edit", checkAuth, staffCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id);
    res.render("partials/products/editproduct", {
      product,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

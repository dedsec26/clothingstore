const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const Products = require("../models/products");
const Cart = require("../models/cart");
const Orders = require("../models/orders");

const userrCheckAuth = require("../utils/auth-rules/usercheck");
router.get("/add/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Products.findById(id);
    let cart = new Cart(req.session.cart ? req.session.cart : { items: {} });
    // console.log(cart);
    cart.add(result, result._id);
    req.session.cart = cart;
    // console.log(req.session.cart);
    res.redirect("/products");
  } catch (error) {
    next(error);
  }
});

router.get("/", userrCheckAuth, async (req, res, next) => {
  try {
    if (!req.session.cart) {
      return res.render("partials/cart/shopping-cart", { products: null });
    }
    let cart = new Cart(req.session.cart);
    // console.log(req.session.cart);
    res.render("partials/cart/shopping-cart", {
      products: cart.genArray(),
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/reduce/one/:id", userrCheckAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    let cart = new Cart(req.session.cart);
    cart.reduceOne(id);
    req.session.cart = cart;
    res.redirect("/cart");
  } catch (error) {
    next(error);
  }
});

router.get("/remove/one/:id", userrCheckAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    let cart = new Cart(req.session.cart);
    cart.remove(id);
    req.session.cart = cart;
    res.redirect("/cart");
  } catch (error) {
    next(error);
  }
});

router.get("/checkout", userrCheckAuth, async (req, res, next) => {
  try {
    // const { address } = await req.user;
    // console.log(address);
    if (!req.session.cart) {
      return res.redirect("/products");
    }
    let cart = new Cart(req.session.cart);
    // console.log(req.session.cart);
    res.render("partials/cart/checkout", {
      products: cart.genArray(),
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/order/place", userrCheckAuth, async (req, res, next) => {
  try {
    const user = await req.user;
    const order = new Orders(req.session.cart);
    order.user = user;
    // console.log(order);
    await order.save();
    // console.log(order.createdAt);
    const { items } = order;
    for (i in items) {
      temp = await Products.findById(i);
      let currentQty = parseInt(temp.stock);
      let finQty = currentQty - items[i].qty;
      // console.log(typeof finQty);
      let result = await Products.findByIdAndUpdate(i, { stock: finQty });
      // console.log(result);
    }
    delete req.session.cart;
    res.redirect("/products");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

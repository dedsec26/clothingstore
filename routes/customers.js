const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const Users = require("../models/users");
const Orders = require("../models/orders");

const userrCheckAuth = require("../utils/auth-rules/usercheck");
const checkNoAuth = require("../utils/auth-rules/checknoAuth");

router.get("/login", checkNoAuth, (req, res) => {
  res.render("partials/customers/login");
});
router.post(
  "/login",
  passport.authenticate("customers", {
    successRedirect: "/products",
    failureRedirect: "/customer/login",
    failureFlash: true,
  })
);

router.get("/signup", checkNoAuth, (req, res) => {
  const err = "";
  res.render("partials/customers/signup", { err });
});
router.post("/signup", checkNoAuth, async (req, res, next) => {
  try {
    const { email } = req.body.signup;
    const availability = await Users.findOne({ email: email });
    console.log(availability);
    if (availability) {
      err = "Email already exists";
      res.render("partials/customers/signup", {
        err,
        data: req.body.signup,
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.signup.password, 10);
      let newUser = new Users(req.body.signup);
      newUser.password = hashedPassword;
      let result = await newUser.save();
      // console.log(result);
      res.redirect("/customer/login");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/orders", userrCheckAuth, async (req, res, next) => {
  try {
    const user = await req.user;
    const orders = await Orders.find({ user: user });
    const msg = "";
    res.render("partials/orders/orders", { orders, msg });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

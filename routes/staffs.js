const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const Staffs = require("../models/staffs");

const checkAuth = require("../utils/auth-rules/staffchekAuth");
const checkNoAuth = require("../utils/auth-rules/checknoAuth");

const staffCheck = require("../utils/auth-rules/staffCheck");
const adminCheck = require("../utils/auth-rules/adminCheck");

router.get("/login", checkNoAuth, (req, res) => {
  res.render("partials/staff/login");
});
router.post(
  "/login",
  passport.authenticate("staffs", {
    successRedirect: "/products",
    failureRedirect: "/staff/login",
    failureFlash: true,
  })
);

router.get("/signup", checkAuth, adminCheck, (req, res) => {
  const err = "";
  res.render("partials/staff/signup", {
    err,
  });
});
router.post(
  "/signup",
  checkAuth,
  staffCheck,
  adminCheck,
  async (req, res, next) => {
    try {
      const { email } = req.body.signup;
      const availability = await Staffs.findOne({ email: email });
      console.log(availability);
      if (availability) {
        err = "Email already exists";
        res.render("partials/staff/signup", {
          err,
          data: req.body.signup,
        });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.signup.password, 10);
        let newStaff = new Staffs(req.body.signup);
        newStaff.password = hashedPassword;
        let result = await newStaff.save();
        // console.log(result);
        // res.send(req.body);
        res.redirect("/staff/login");
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

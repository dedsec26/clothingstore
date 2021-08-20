const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const Orders = require("../models/orders");

const checkAuth = require("../utils/auth-rules/staffchekAuth");

const staffCheck = require("../utils/auth-rules/staffCheck");

const pmCheck = require("../utils/auth-rules/pmCheck");

const caCheck = require("../utils/auth-rules/caCheck");

router.get("/all", checkAuth, staffCheck, async (req, res, next) => {
  try {
    const orders = await Orders.find();
    // console.log(orders);
    let msg = "";
    res.render("partials/orders/orders", { orders, msg });
  } catch (error) {
    next(error);
  }
});
router.get("/report/today", checkAuth, pmCheck, async (req, res, next) => {
  try {
    const previousDay = new Date(Date.now());
    previousDay.setDate(previousDay.getDate() - 1);

    const orders = await Orders.find({
      createdAt: {
        $lt: new Date(Date.now()),
        $gte: new Date(previousDay),
      },
    });
    // console.log(new Date(previousDay));
    const msg = "Orders in the past one day.";

    res.render("partials/orders/orders", { orders, msg });
  } catch (error) {
    next(error);
  }
});
router.get("/report/income", checkAuth, caCheck, async (req, res, next) => {
  try {
    const previousMonth = new Date(Date.now());
    previousMonth.setDate(previousMonth.getDate() - 30);
    // let previousMonth = new Date(Date.now() - 1);
    const orders = await Orders.find({
      status: "Fullfilled",
      createdAt: { $lt: new Date(Date.now()), $gte: previousMonth },
    });

    let income = 0;
    for (order of orders) {
      income = income + order.totalPrice;
    }

    res.render("partials/orders/report", { orders, income });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit", checkAuth, staffCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);
    res.render("partials/orders/editorder", {
      order,
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/:id", checkAuth, staffCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // console.log(req.body);
    const result = await Orders.findByIdAndUpdate(id, {
      status: status,
    });
    console.log(result);
    res.redirect(`/orders/all`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const sessionStore = require("connect-mongo");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Staffs = require("./models/staffs");
const AppError = require("./utils/AppError");
const { initializePassport } = require("./utils/passport-config");
initializePassport(passport);
dotenv.config();

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 100,
      ttl: 60 * 60 * 24,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port: ", port);
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Mongo Connection Successful"))
  .catch((err) => console.log(err.message));

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(async function (req, res, next) {
  try {
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.user = await req.user;
    next();
  } catch (error) {
    next(error);
  }
});

app.use(async function (req, res, next) {
  try {
    const pass = await bcrypt.hash("admin", 10);
    // console.log(pass);
    let admin = await Staffs.find({ type: "admin" });
    if (admin.length > 0) return next();
    const newAdmin = new Staffs({
      name: "Aflal",
      type: "admin",
      email: "aftocr@gmail.com",
      address: "No.60, Thakkiya Road, Mawanella, Sri Lanka 71500",
      phone: "0778353132",
      ephone: "0778353132",
      password: pass,
    });
    console.log(newAdmin);
    // console.log(admin);
    newAdmin.save();
    return next;
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => res.redirect("/products"));

app.use("/customer", require("./routes/customers"));
app.use("/staff", require("./routes/staffs"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/orders"));
app.use("/cart", require("./routes/cart"));

app.get("/logout", (req, res) => {
  req.logOut();
  req.session.cart = { items: {} };
  res.redirect("/");
});

app.get("*", (req, res, next) => next(new AppError("Not Found", 404)));
app.post("*", (req, res, next) => next(new AppError("Not Found", 400)));

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal Server Error" } = err;
  // console.log(status, message);
  res.status(status).render("partials/utils/error", { err });
});

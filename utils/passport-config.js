const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Users = require("../models/users");
const Staffs = require("../models/staffs");

module.exports.initializePassport = function (passport) {
  const authenticateCustomer = async (email, password, done) => {
    const user = await Users.findOne({ email: email });
    if (user == null) return done(null, false, { message: "Invalid Email" });

    try {
      const temp = await bcrypt.compare(password, user.password);
      if (temp) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect Password" });
      }
    } catch (error) {
      return done(error);
    }
  };
  const authenticateStaff = async (email, password, done) => {
    const user = await Staffs.findOne({ email: email });
    if (user == null) return done(null, false, { message: "Invalid Email" });

    try {
      const temp = await bcrypt.compare(password, user.password);
      if (temp) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect Password" });
      }
    } catch (error) {
      return done(error);
    }
  };
  const getUserById = async (id) => {
    const sId = await Staffs.findById(id);
    const cId = await Users.findById(id);
    if (cId) {
      return cId;
    } else if (sId) {
      return sId;
    }
  };
  passport.use(
    "customers",
    new LocalStrategy({ usernameField: "email" }, authenticateCustomer)
  );
  passport.use(
    "staffs",
    new LocalStrategy({ usernameField: "email" }, authenticateStaff)
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
};

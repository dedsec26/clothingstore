module.exports = async function (req, res, next) {
  try {
    await req.isAuthenticated();
    if (req.isAuthenticated()) return next();
    res.redirect("/staff/login");
  } catch (error) {
    next(error);
  }
};

module.exports = async function (req, res, next) {
  try {
    await req.isAuthenticated();
    if (req.isAuthenticated()) return res.redirect("/");
    next();
  } catch (error) {
    next(error);
  }
};

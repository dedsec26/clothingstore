module.exports = async function (req, res, next) {
  try {
    const { type } = await req.user;
    if (type === "admin") return next();
    res.render("partials/customers/noauth");
  } catch (error) {
    next(error);
  }
};

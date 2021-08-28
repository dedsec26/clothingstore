const cloudinary = require("./cloudinary");

let uploadimage = async (req, res, next) => {
  try {
    // console.log(req.file);
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.upload = result.secure_url;
      req.body.image = result.secure_url;
      next();
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = uploadimage;

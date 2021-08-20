const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  size: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img1: String,
  img2: String,
  img3: String,
});

module.exports = Mongoose.model("Products", productsSchema);

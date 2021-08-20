const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone1: {
    type: String,
    required: true,
  },
  phone2: {
    type: String,
    required: true,
  },
  password: String,
  type: {
    type: String,
    default: "user",
  },
});

module.exports = Mongoose.model("Users", usersSchema);

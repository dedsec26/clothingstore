const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const staffsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
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
  phone: {
    type: String,
    required: true,
  },
  ephone: {
    type: String,
    required: true,
  },
  password: String,
});

module.exports = Mongoose.model("Staffs", staffsSchema);

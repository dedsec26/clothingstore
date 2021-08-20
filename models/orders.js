const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const ordersSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: Object,
      required: true,
    },
    status: {
      type: Object,
      required: true,
      default: "Pending",
    },
    totalPrice: {
      type: Number,
    },
    totalQty: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Orders", ordersSchema);

const mongoose = require("mongoose");
const User = require("./UserModel");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    total: { type: Number, required: true },
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { path: { type: String, required: true } },
    count: { type: Number, required: true },

    paymentMethod: {
      type: String,
      required: true,
    },

    paidAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
    transactionHash: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
Order.watch().on("change", (data) => {
  if (data.operationType === "insert") {
    io.emit("newOrder", data.fullDocument);
  }
});
module.exports = Order;

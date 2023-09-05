const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const ObjectId = require("mongodb").ObjectId;

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: ObjectId(req.user._id) });
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "-password -isAdmin -_id -__v -createdAt -updatedAt")
      .orFail();
    res.send(order);
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    console.log(req.body);
    const { cartItem, paymentMethod, transactionHash, account, userInfo } =
      req.body;
    if (!cartItem || !paymentMethod || !account || !userInfo) {
      return res.status(400).send("All inputs are required");
    }
    console.log("BKUww");
    let ids = [cartItem.productID];
    let qty = [cartItem.quantity];
    console.log("BKU");
    // await Product.find({ _id: { $in: ids } }).then((products) => {
    //   console.log(products);
    //   products.forEach(function (product, idx) {
    //     product.sales += qty[idx];
    //     console.log("p", product);
    //     product.save();
    //   });
    // });
    console.log("BKU2", userInfo._id), ObjectId(userInfo._id);
    console.log("CJVCHH");
    const order = new Order({
      user: ObjectId(userInfo._id),
      total: (qty[0] * cartItem.price) / 9999999,
      quantity: qty[0],
      name: cartItem.name,
      price: cartItem.price / 9999999,
      image: cartItem.image,
      count: cartItem.count,

      paymentMethod,

      transactionHash: transactionHash,
      account,
      paymentMethod,
    });
    const createdOrder = await order.save();
    res.status(201).send(createdOrder);
  } catch (err) {
    next(err);
  }
};

const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "-password")
      .sort({ paymentMethod: "desc" });
    res.send(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderForAnalysis = async (req, res, next) => {
  try {
    const start = new Date(req.params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.params.date);
    end.setHours(23, 59, 59, 999);

    const order = await Order.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).sort({ createdAt: "asc" });
    res.send(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderForAnalysis,
};

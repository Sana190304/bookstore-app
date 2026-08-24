const Order = require("../models/Order");
const Book = require("../models/Book");
const { verifyPaymentSignature } = require("./paymentController");

// @route POST /api/orders
// expects the Razorpay payment details returned after a successful checkout
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details missing" });
    }

    const isValidPayment = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidPayment) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) return res.status(404).json({ message: `Book not found: ${item.bookId}` });
      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${book.title}` });
      }
      totalAmount += book.price * item.quantity;
      orderItems.push({ book: book._id, quantity: item.quantity, price: book.price });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentStatus: "paid",
    });

    // reduce stock
    for (const item of items) {
      await Book.findByIdAndUpdate(item.bookId, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.book", "title coverImage")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders  (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.book", "title")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/orders/:id/status  (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };

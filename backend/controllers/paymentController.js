const Razorpay = require("razorpay");
const crypto = require("crypto");

// created lazily so the server can still boot before keys are added to .env
let razorpayInstance = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// @route POST /api/payment/create-order
// creates a Razorpay order for the given amount (in rupees)
const createRazorpayOrder = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys not configured yet" });
    }

    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await getRazorpay().orders.create(options);
    res.json(razorpayOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verifies the payment signature returned by Razorpay checkout
// throws-free helper used by orderController before creating the order
const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

module.exports = { createRazorpayOrder, verifyPaymentSignature };

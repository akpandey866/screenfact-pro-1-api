const createRazorpayOrder = async (req, res) => {
  const razorpay = require("razorpay"); // Include Razorpay module

  // Set up your Razorpay instance with your API key and secret
  const rzp = new razorpay({
    key_id: "rzp_test_xtO2RWiNqyRHfJ",
    key_secret: "6m2NPEIyj36dlbYHa8fAEND0",
  });

  // Define order options
  const options = {
    amount: 50000, // amount in paise (in this case, 500 INR)
    currency: "INR",
    receipt: "order_receipt_" + Math.floor(Math.random() * 1000), // Unique receipt ID
    payment_capture: 1,
  };

  try {
    // Create Razorpay order
    const response = await rzp.orders.create(options);

    // Send the order response to the client
    res.json(response);
  } catch (error) {
    // Handle errors
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = createRazorpayOrder;

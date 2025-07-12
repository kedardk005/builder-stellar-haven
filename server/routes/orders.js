const express = require("express");
const { body, validationResult } = require("express-validator");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Item = require("../models/Item");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post(
  "/",
  protect,
  [
    body("itemId").isMongoId().withMessage("Valid item ID required"),
    body("shippingAddress").notEmpty().withMessage("Shipping address required"),
    body("paymentMethod")
      .isIn(["razorpay", "points"])
      .withMessage("Invalid payment method"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { itemId, shippingAddress, paymentMethod } = req.body;

      // Get the item
      const item = await Item.findById(itemId).populate("seller", "name email");

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      // Check if item is available
      if (item.status !== "active") {
        return res.status(400).json({
          success: false,
          message: "Item is not available for purchase",
        });
      }

      // Check if user is trying to buy their own item
      if (item.seller._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot buy your own item",
        });
      }

      // Calculate total amount
      const itemPrice = item.price;
      const shippingCost = item.finalShippingCost;
      const totalAmount = itemPrice + shippingCost;

      // If paying with points, check if user has enough
      if (paymentMethod === "points") {
        const pointsRequired = Math.floor(totalAmount * 10); // 1 rupee = 10 points
        if (req.user.points < pointsRequired) {
          return res.status(400).json({
            success: false,
            message: "Insufficient points for this purchase",
          });
        }
      }

      // Reserve the item temporarily
      await item.reserveItem(req.user._id, 15); // 15 minutes

      // Create order
      const orderData = {
        buyer: req.user._id,
        seller: item.seller._id,
        item: itemId,
        amount: totalAmount,
        itemPrice,
        shippingCost,
        shippingAddress,
        paymentMethod,
        status: "pending",
      };

      const order = await Order.create(orderData);

      if (paymentMethod === "razorpay") {
        // Create Razorpay order
        try {
          const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // Amount in paise
            currency: "INR",
            receipt: `order_${order._id}`,
            notes: {
              orderId: order._id.toString(),
              itemId: itemId,
              buyerId: req.user._id.toString(),
            },
          });

          order.razorpayOrderId = razorpayOrder.id;
          await order.save();

          res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: {
              order,
              razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
              },
              razorpayKeyId: process.env.RAZORPAY_KEY_ID,
            },
          });
        } catch (razorpayError) {
          console.error("Razorpay order creation error:", razorpayError);
          // Cancel the reservation
          await item.checkReservation();
          await Order.findByIdAndDelete(order._id);

          return res.status(500).json({
            success: false,
            message: "Failed to create payment order",
          });
        }
      } else if (paymentMethod === "points") {
        // Process points payment immediately
        try {
          const pointsRequired = Math.floor(totalAmount * 10);

          // Deduct points from buyer
          await req.user.deductPoints(
            pointsRequired,
            `Purchase: ${item.title}`,
          );

          // Mark order as paid
          order.status = "paid";
          order.paidAt = new Date();
          await order.save();

          // Mark item as sold
          await item.markAsSold(req.user._id);

          // Award points to seller
          const seller = await User.findById(item.seller._id);
          const sellerPoints = Math.floor(itemPrice * 5); // 5 points per rupee sold
          await seller.addPoints(sellerPoints, `Sale: ${item.title}`);

          res.status(201).json({
            success: true,
            message: "Order completed successfully with points",
            data: { order },
          });
        } catch (pointsError) {
          console.error("Points payment error:", pointsError);
          // Cancel the reservation
          await item.checkReservation();
          await Order.findByIdAndDelete(order._id);

          return res.status(400).json({
            success: false,
            message: pointsError.message,
          });
        }
      }
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
    }
  },
);

// @desc    Verify payment
// @route   POST /api/orders/verify-payment
// @access  Private
router.post(
  "/verify-payment",
  protect,
  [
    body("razorpay_order_id").notEmpty().withMessage("Order ID required"),
    body("razorpay_payment_id").notEmpty().withMessage("Payment ID required"),
    body("razorpay_signature").notEmpty().withMessage("Signature required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
      }

      // Find the order
      const order = await Order.findOne({
        razorpayOrderId: razorpay_order_id,
      }).populate("item");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if order belongs to the user
      if (order.buyer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to verify this payment",
        });
      }

      // Update order status
      order.status = "paid";
      order.paidAt = new Date();
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      // Mark item as sold
      const item = await Item.findById(order.item);
      await item.markAsSold(req.user._id);

      // Award points to seller
      const seller = await User.findById(order.seller);
      const sellerPoints = Math.floor(order.itemPrice * 5); // 5 points per rupee
      await seller.addPoints(sellerPoints, `Sale: ${item.title}`);

      // Award points to buyer
      const buyerPoints = Math.floor(order.itemPrice * 1); // 1 point per rupee spent
      await req.user.addPoints(buyerPoints, `Purchase: ${item.title}`);

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Verify payment error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify payment",
        error: error.message,
      });
    }
  },
);

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, type = "all" } = req.query;

    let query = {};
    if (type === "bought") {
      query.buyer = req.user._id;
    } else if (type === "sold") {
      query.seller = req.user._id;
    } else {
      query.$or = [{ buyer: req.user._id }, { seller: req.user._id }];
    }

    const orders = await Order.find(query)
      .populate("item", "title images price")
      .populate("buyer", "name avatar")
      .populate("seller", "name avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("item")
      .populate("buyer", "name email phone avatar")
      .populate("seller", "name email phone avatar");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is involved in this order
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user can cancel this order
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this order",
      });
    }

    // Update order status
    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    // Remove item reservation
    const item = await Item.findById(order.item);
    if (item) {
      await item.checkReservation();
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
});

module.exports = router;

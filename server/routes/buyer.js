const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const Order = require("../models/orders");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/api/createOrder", isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const { product, deliveryInstructions, deliveryFee, pickup } = req.body;

  try {
    const newProduct = new Product({
      name: product.name,
      description: product.description,
      weight: product.weight,
      dimensions: product.dimensions,
      productURL: product.productURL,
      value: product.value,
      quantity: product.quantity,
    });

    const newOrder = new Order({
      buyerId: userId,
      productId: newProduct._id,
      prefferedPickupPlace: pickup,
      initialDeliveryFee: deliveryFee,
      deliveryInstructions: deliveryInstructions,
    });

    await newProduct.save();
    await newOrder.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;

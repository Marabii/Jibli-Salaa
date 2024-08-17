const Product = require("../models/products");
const express = require("express");
const router = express.Router();

router.get("/api/getProduct/:id", async (req, res) => {
  const productId = req.params.id;
  console.log("get product api ran");
  try {
    const product = await Product.findById(productId);
    return res.status(200).json({ success: true, product: product });
  } catch (err) {
    console.error("Error getting product:", err.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;

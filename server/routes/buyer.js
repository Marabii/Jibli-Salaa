const express = require("express");
const router = express.Router();
// const Product = require("../models/Product");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/api/createOrder", isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  console.log(req.body);
  res.json({ success: true });
});

module.exports = router;

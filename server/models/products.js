const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  weight: { type: Number, required: true },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  productURL: { type: String, required: false },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
  quantity: { type: Number, required: true, default: 1 },
});

// Create and export the Product model
const ProductModel = model("Product", ProductSchema);

module.exports = ProductModel;

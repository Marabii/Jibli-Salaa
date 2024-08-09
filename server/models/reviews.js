const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ReviewSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  revieweeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Review model
const ReviewModel = model("Review", ReviewSchema);

module.exports = ReviewModel;

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  travelerId: { type: Schema.Types.ObjectId, ref: "Traveler", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  status: { type: String, required: true },
  placedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date },
  deliveredAt: { type: Date },
  deliveryFee: { type: Number, required: true },
  insuranceDetails: {
    isInsured: { type: Boolean, default: false },
    insuranceId: { type: Schema.Types.ObjectId, ref: "Insurance" },
  },
  deliveryInstructions: { type: String },
  trackingDetails: {
    currentStatus: { type: String, required: true },
    progress: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, required: true },
        location: { type: String, required: true },
      },
    ],
    currentLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Order model
const OrderModel = model("Order", OrderSchema);

module.exports = OrderModel;

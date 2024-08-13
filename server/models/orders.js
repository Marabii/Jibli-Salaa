const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AddressSchema = new Schema({
  formatted_address: { type: String, required: true },
  geometry: {
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  name: { type: String, required: true },
  html_attributions: [{ type: String, required: false }],
});

const OrderSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  travelerId: { type: Schema.Types.ObjectId, ref: "Traveler", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  status: { type: String, required: true },
  placedAt: { type: Date, default: () => Date.now() },
  prefferedPickupPlace: { type: AddressSchema, required: true },
  acceptedAt: { type: Date },
  deliveredAt: { type: Date },
  deliveryFee: {
    type: Number,
    min: [0, "Delivery fee cannot be negative"],
    required: true,
  },
  deliveryInstructions: { type: String },
  trackingDetails: {
    currentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Order Accpepted", "En route", "Delivered"],
      required: false,
    },
    progress: [
      {
        status: {
          type: String,
          enum: ["Pending", "Item Bought", "En route", "Delivered"],
          default: "Pending",
          required: false,
        },
        timestamp: { type: Date, required: false },
        location: { type: AddressSchema, required: false },
      },
    ],
  },
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

// Create and export the Order model
const OrderModel = model("Order", OrderSchema);

module.exports = OrderModel;

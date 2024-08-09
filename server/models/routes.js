const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RouteSchema = new Schema({
  travelerId: { type: Schema.Types.ObjectId, ref: "Traveler", required: true },
  tripDetails: {
    departureCity: { type: String, required: true },
    destinationCity: { type: String, required: true },
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    waypoints: [
      {
        city: { type: String, required: true },
        coordinates: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
      },
    ],
  },
  realTimeTracking: {
    currentLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Route model
const RouteModel = model("Route", RouteSchema);

module.exports = RouteModel;

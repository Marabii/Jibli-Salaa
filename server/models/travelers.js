const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TravelerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bio: { type: String, required: true },
  languagesSpoken: { type: [String], required: true },
  preferredDeliveryLocations: { type: [String], required: true },
  deliveryCapacity: {
    weightLimit: { type: Number, required: true },
    volumeLimit: { type: Number, required: true },
  },
  ratings: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  verified: { type: Boolean, default: false },
  premiumMember: { type: Boolean, default: false },
  trips: [
    {
      tripId: { type: Schema.Types.ObjectId, required: true },
      departureCity: { type: String, required: true },
      destinationCity: { type: String, required: true },
      departureDate: { type: Date, required: true },
      arrivalDate: { type: Date, required: true },
      flightDetails: {
        airline: { type: String, required: true },
        flightNumber: { type: String, required: true },
        layovers: { type: [String], required: true },
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Traveler model
const TravelerModel = model("Traveler", TravelerSchema);

module.exports = TravelerModel;

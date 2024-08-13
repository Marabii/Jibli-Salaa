const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AddressSchema = new Schema({
  formatted_address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const TripSchema = new Schema(
  {
    departureCity: { type: AddressSchema, required: true },
    destinationCity: { type: AddressSchema, required: true },
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    travelDetails: {
      isInternational: { type: Boolean, required: false },
      areTaxesIncluded: { type: Boolean, default: false, required: false },
    },
  },
  { _id: true }
);

const LanguageSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  { _id: false }
);

const TravelerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bio: { type: String, required: false },
  spokenLanguages: {
    type: [{ type: LanguageSchema, required: true }],
    required: true,
  },
  preferredDeliveryLocations: { type: [String], required: false },
  deliveryCapacity: {
    weightLimit: { type: Number, required: false },
    volumeLimit: { type: Number, required: false },
  },
  ratings: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  verified: { type: Boolean, default: false },
  premiumMember: { type: Boolean, default: false },
  trips: [
    {
      type: TripSchema,
      required: false,
    },
  ],
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

// Create and export the Traveler model
const TravelerModel = model("Traveler", TravelerSchema);

module.exports = TravelerModel;

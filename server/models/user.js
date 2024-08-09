const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AddressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
      match: /^[a-zA-Z0-9\s,'-]*$/,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      match: /^[a-zA-Z\s,'-]*$/,
    },
    postalCode: {
      type: String,
      required: true,
      match: /^[A-Za-z0-9]{3,10}$/,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      match: /^[a-zA-Z\s,'-]*$/,
    },
  },
  {
    _id: false,
  }
);

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true, index: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    index: true,
  },
  hash: {
    type: String,
    required: [true, "Password hash is required"],
  },
  salt: {
    type: String,
    required: [true, "Salt is required for password hashing"],
  },
  profilePicture: { type: String },
  phoneNumber: { type: String, required: true, maxLength: 10, minLength: 10 },
  address: { type: AddressSchema, required: true },
  isVerified: { type: Boolean, default: false },
  verificationDetails: {
    isEmailVerified: { type: Boolean, default: false },
    isPhoneNumberVerified: { type: Boolean, default: false },
  },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
  typeOfUser: { type: String, enum: ["shopper", "traveler"] },
});

// Create and export the User model
const UserModel = model("User", UserSchema);

module.exports = UserModel;

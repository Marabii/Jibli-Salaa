const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true, index: true },
  isAuthenticatedByGoogle: { type: Boolean, default: false }, // Changed default to false
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
    required: function () {
      return !this.isAuthenticatedByGoogle;
    },
  },
  salt: {
    type: String,
    required: function () {
      return !this.isAuthenticatedByGoogle;
    },
  },
  profilePicture: {
    type: String,
    default: `${process.env.BACK_END}/images/defaultUserIcon.png`,
  },
  phoneNumber: { type: String, required: false, maxLength: 10, minLength: 10 },
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

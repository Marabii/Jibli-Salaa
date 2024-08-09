const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PaymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Payment model
const PaymentModel = model("Payment", PaymentSchema);

module.exports = PaymentModel;

const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be a positive number"], // Prevent negative values
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true, // Remove extra spaces
  },
  description: {
    type: String,
    trim: true, // Remove extra spaces
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().toISOString().split("T")[0], // Stores only YYYY-MM-DD
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);

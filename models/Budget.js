// const mongoose = require("mongoose");

// const BudgetSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   limit: {
//     type: Number,
//     required: true,
//   },
//   spent: {
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Budget", BudgetSchema);

const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true }, // 0 - January, 1 - February, ..., 11 - December
  year: { type: Number, required: true },
  amount: { type: Number, required: true }
});

BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true }); // Ensure one budget per month/year

module.exports = mongoose.model('Budget', BudgetSchema);

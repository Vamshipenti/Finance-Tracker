const express = require("express");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route POST /api/transactions
 * @desc Add a new transaction
 * @access Private
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = new Transaction({
      user: req.user.id,
      amount,
      type,
      category,
      description,
      date: date || Date.now(),
    });

    await transaction.save();

    // Check if spending exceeds budget
    if (type === "expense") {
      let budget = await Budget.findOne({ user: req.user.id, category });

      if (budget) {
        budget.spent += amount;
        await budget.save();

        if (budget.spent > budget.limit) {
          return res.status(400).json({
            message: `Alert! You exceeded your budget for ${category} (Spent: ₹${budget.spent}, Limit: ₹${budget.limit})`,
          });
        }
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/**
 * @route GET /api/transactions
 * @desc Get all transactions with filtering & sorting
 * @access Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { type, category, sortBy, order } = req.query;
    let filter = { user: req.user.id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    let allowedSortFields = ["date", "amount", "category"];
    let sortField = allowedSortFields.includes(sortBy) ? sortBy : "date";
    let sortDirection = order === "asc" ? 1 : -1;

    const transactions = await Transaction.find(filter).sort({ [sortField]: sortDirection });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/**
 * @route PUT /api/transactions/:id
 * @desc Update a transaction
 * @access Private
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    Object.assign(transaction, req.body);
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/**
 * @route DELETE /api/transactions/:id
 * @desc Delete a transaction
 * @access Private
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;

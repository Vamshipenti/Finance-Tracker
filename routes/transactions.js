const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/auth");  // Ensure authentication
const router = express.Router();
const Budget = require("../models/Budget");

/**
 * @route POST /api/transactions
 * @desc Add a new transaction
 * @access Private
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = new Transaction({
      user: req.user.id,
      amount,
      type,
      category,
      description,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/**
 * @route GET /api/transactions
 * @desc Get all transactions for a user
 * @access Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
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

    const { amount, type, category, description } = req.body;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;

    await transaction.save();
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
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

    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


router.post("/add", auth, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;
    
    const transaction = new Transaction({
      userId: req.user.id,
      description,
      amount,
      type,
      category,
      date,
    });

    await transaction.save();

    // ✅ Check if spending exceeds budget
    if (type === "expense") {
      let budget = await Budget.findOne({ userId: req.user.id, category });

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

    res.status(201).json({ message: "Transaction added", transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

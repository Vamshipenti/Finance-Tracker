const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Budget = require("../models/Budget");

// ✅ Set Budget
router.post("/set", auth, async (req, res) => {
  try {
    const { category, limit } = req.body;

    let budget = await Budget.findOne({ userId: req.user.id, category });

    if (budget) {
      return res.status(400).json({ message: "Budget for this category already exists" });
    }

    budget = new Budget({ userId: req.user.id, category, limit });
    await budget.save();
    res.status(201).json({ message: "Budget set successfully", budget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Budgets
router.get("/", auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Budget
router.put("/update/:id", auth, async (req, res) => {
  try {
    const { limit } = req.body;
    let budget = await Budget.findById(req.params.id);

    if (!budget || budget.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.limit = limit;
    await budget.save();
    res.json({ message: "Budget updated", budget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Budget
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget || budget.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budget.remove();
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

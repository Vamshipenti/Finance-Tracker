// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authMiddleware");
// const Budget = require("../models/Budget");

// // ✅ Set Budget
// router.post("/set", auth, async (req, res) => {
//   try {
//     const { category, limit } = req.body;

//     let budget = await Budget.findOne({ userId: req.user.id, category });

//     if (budget) {
//       return res.status(400).json({ message: "Budget for this category already exists" });
//     }

//     budget = new Budget({ userId: req.user.id, category, limit });
//     await budget.save();
//     res.status(201).json({ message: "Budget set successfully", budget });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Get Budgets
// router.get("/", auth, async (req, res) => {
//   try {
//     const budgets = await Budget.find({ userId: req.user.id });
//     res.json(budgets);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Update Budget
// router.put("/update/:id", auth, async (req, res) => {
//   try {
//     const { limit } = req.body;
//     let budget = await Budget.findById(req.params.id);

//     if (!budget || budget.userId.toString() !== req.user.id) {
//       return res.status(404).json({ message: "Budget not found" });
//     }

//     budget.limit = limit;
//     await budget.save();
//     res.json({ message: "Budget updated", budget });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Delete Budget
// router.delete("/delete/:id", auth, async (req, res) => {
//   try {
//     let budget = await Budget.findById(req.params.id);

//     if (!budget || budget.userId.toString() !== req.user.id) {
//       return res.status(404).json({ message: "Budget not found" });
//     }

//     await budget.remove();
//     res.json({ message: "Budget deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const Budget = require('../models/Budget'); // Import Budget model

const router = express.Router();
// POST: Add or Update Monthly Budget
// Controller function to add/update monthly budget
const addOrUpdateBudget = async (req, res) => {
  const { userId, amount, month, year } = req.body;

  try {
    let budget = await Budget.findOne({ userId, month, year });

    if (budget) {
      // Update existing budget for the month
      budget.amount = amount;
      await budget.save();
      return res.json({ message: "Budget updated successfully", budget });
    } else {
      // Create new budget
      budget = new Budget({ userId, amount, month, year });
      await budget.save();
      return res.json({ message: "Budget added successfully", budget });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
router.post("/budget", addOrUpdateBudget);
// GET: Fetch Budget for Current Month
router.get('/budget', async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId; // ✅ Get userId safely
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    let { month, year } = req.query;

    // ✅ Ensure month and year are valid
    if (!month || !year) {
      const now = new Date();
      month = now.getMonth() + 1; // ✅ Convert to 1-based month
      year = now.getFullYear();
    } else {
      month = parseInt(month);
      year = parseInt(year);
    }

    console.log("Fetching budget for:", { userId, month, year });

    const budget = await Budget.findOne({ userId, month, year });

    res.status(200).json({ budget: budget ? budget.amount : 0 });

  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ error: 'Error fetching budget' });
  }
});


module.exports = router;

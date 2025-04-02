const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes loaded");

const transactionRoutes = require("./routes/transactions");  
app.use("/api/transactions", transactionRoutes);


app.use("/api/budget", require("./routes/budget"));




// Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

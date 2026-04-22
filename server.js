import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import materialRoutes from "./routes/materials.js";
import logRoutes from "./routes/logs.js";
import Vendor from "./models/Vendor.js";

dotenv.config(); // ✅ load env variables

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

// ─── ROUTES ───
app.use("/auth", authRoutes);
app.use("/materials", materialRoutes);
app.use("/logs", logRoutes);

// ─── EXPENSES ───
const expenseSchema = new mongoose.Schema({
  amount: Number,
  givenTo: String,
  category: String,
  date: String,
  notes: String,
  status: String
});

const Expense = mongoose.model("Expense", expenseSchema);

// GET
app.get("/expenses", async (req, res) => {
  try {
    const data = await Expense.find();
    res.json(data);
  } catch (err) {
    console.log("EXPENSE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST
app.post("/expenses", async (req, res) => {
  try {
    const data = new Expense(req.body);
    await data.save();
    res.json(data);
  } catch (err) {
    console.log("EXPENSE POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT
app.put("/expenses/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log("EXPENSE UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.log("EXPENSE DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── VENDORS ───
app.get("/vendors", async (req, res) => {
  try {
    const data = await Vendor.find();
    res.json(data);
  } catch (err) {
    console.log("VENDOR ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/vendors", async (req, res) => {
  try {
    const v = await Vendor.create(req.body);
    res.json(v);
  } catch (err) {
    console.log("VENDOR POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/vendors/:id", async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.log("VENDOR DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ DEBUG ROUTE (important)
app.get("/check", (req, res) => {
  res.send("Backend is working");
});

// ❌ HANDLE UNKNOWN ROUTES (this was causing your issue)
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    url: req.originalUrl,
    method: req.method
  });
});

// ❌ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// ✅ Dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
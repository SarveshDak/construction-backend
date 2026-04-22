import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import materialRoutes from "./routes/materials.js";
import logRoutes from "./routes/logs.js";
import Vendor from "./models/Vendor.js";

dotenv.config();

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ CONNECT MONGODB FIRST
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ Mongo Error:", err);
    process.exit(1); // stop app if DB fails
  }
};

connectDB();

// ─── ROUTES ───
app.use("/auth", authRoutes);
app.use("/materials", materialRoutes);
app.use("/logs", logRoutes);

// ─── EXPENSE MODEL ───
const expenseSchema = new mongoose.Schema({
  amount: Number,
  givenTo: String,
  category: String,
  date: String,
  notes: String,
  status: String
});

const Expense = mongoose.model("Expense", expenseSchema);

// ─── EXPENSE ROUTES ───
app.get("/expenses", async (req, res) => {
  try {
    const data = await Expense.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const data = new Expense(req.body);
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── VENDOR ROUTES ───
app.get("/vendors", async (req, res) => {
  try {
    const data = await Vendor.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/vendors", async (req, res) => {
  try {
    const v = await Vendor.create(req.body);
    res.json(v);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/vendors/:id", async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TEST ROUTES ───
app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/check", (req, res) => {
  res.send("Backend is working");
});

// ─── 404 HANDLER ───
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    url: req.originalUrl,
    method: req.method
  });
});

// ─── START SERVER ───
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
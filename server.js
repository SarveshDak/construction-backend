import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import materialRoutes from "./routes/materials.js";
import logRoutes from "./routes/logs.js";
import Vendor from "./models/Vendor.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

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

app.get("/expenses", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

app.post("/expenses", async (req, res) => {
  const data = new Expense(req.body);
  await data.save();
  res.json(data);
});

app.put("/expenses/:id", async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.delete("/expenses/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ─── VENDORS ───
app.get("/vendors", async (req, res) => {
  const data = await Vendor.find();
  res.json(data);
});

app.post("/vendors", async (req, res) => {
  const v = await Vendor.create(req.body);
  res.json(v);
});

app.delete("/vendors/:id", async (req, res) => {
  await Vendor.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// ─── TEST ───
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ Dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
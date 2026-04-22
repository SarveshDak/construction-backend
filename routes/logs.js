import express from "express";
import Log from "../models/Log.js";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const logs = await Log.find();
  res.json(logs);
});

// POST
router.post("/", async (req, res) => {
  const log = new Log(req.body);
  const saved = await log.save();
  res.json(saved);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Log.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// UPDATE (optional but better)
router.put("/:id", async (req, res) => {
  const updated = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export default router;
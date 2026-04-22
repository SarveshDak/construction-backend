import express from "express";
import Material from "../models/Material.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const materials = await Material.find();
  res.json(materials);
}); 

// GET all
router.put("/:id", async (req, res) => {
  const updated = await Material.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});
// POST
router.post("/", async (req, res) => {
  const material = new Material(req.body);
  const saved = await material.save();
  res.json(saved);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Material.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

export default router;
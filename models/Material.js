import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  unitCost: Number,
  totalCost: Number,
  date: String
});

export default mongoose.model("Material", materialSchema);
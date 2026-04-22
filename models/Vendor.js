import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  workType: String,
  notes: String
});

export default mongoose.model("Vendor", vendorSchema);
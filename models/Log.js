import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  date: String,
  title: String,
  note: String,
  workers: Number
});

export default mongoose.model("Log", logSchema);
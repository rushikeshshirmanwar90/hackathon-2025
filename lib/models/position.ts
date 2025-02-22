import { Schema, model, models } from "mongoose";

const PositionSchema = new Schema({
  title: { type: String, required: true, unique: true },
  category: { type: String, enum: ["student", "faculty"], required: true },
  description: { type: String },
  responsibilities: [{ type: String }],
});

const Position = models.Position || model("Position", PositionSchema);
export default Position;

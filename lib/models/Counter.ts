import mongoose, { Schema, Document } from "mongoose";

interface ICounter extends Document {
  _id: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 },
});

export default mongoose.models.Counter ||
  mongoose.model<ICounter>("Counter", CounterSchema);

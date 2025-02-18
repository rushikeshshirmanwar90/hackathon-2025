import { Schema, model, models } from "mongoose";

const ComplaintSchema = new Schema({
  complaintId: { type: String, required: true, unique: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending",
  },
  isAnonymous: { type: Boolean, default: true },
  isVisibleToPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Complaint = models.Complaint || model("Complaint", ComplaintSchema);

export { Complaint };

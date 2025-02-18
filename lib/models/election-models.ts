import { model, models, Schema } from "mongoose";

const ElectionSchema = new Schema({
  title: { type: String, required: true },
  candidates: [
    {
      studentId: { type: Schema.Types.ObjectId, ref: "Student" },
      votes: { type: Number, default: 0 },
    },
  ],
  totalVotes: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "active", "completed"],
    default: "pending",
  },
});

const Election = models.Election || model("Election", ElectionSchema);

const VoteSchema = new Schema({
  electionId: {
    type: Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Vote = models.Vote || model("Vote", VoteSchema);

export { Vote, Election };
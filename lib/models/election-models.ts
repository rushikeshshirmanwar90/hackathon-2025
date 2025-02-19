import { model, models, Schema } from "mongoose";

const ElectionSchema = new Schema({
  title: { type: String, required: true },
  candidates: [
    {
      position: { type: String, required: true },
      studentId: { type: String, required: true },
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

const VoteSchema = new Schema(
  {
    electionId: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    candidateId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Vote = models.Vote || model("Vote", VoteSchema);

export { Vote, Election };

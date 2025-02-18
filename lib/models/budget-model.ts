import { model, models, Schema } from "mongoose";

const BudgetSchema = new Schema({
  department: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  expenses: [
    {
      reason: { type: String, required: true },
      amount: { type: Number, required: true },
      proof: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Budget = models.Budget || model("Budget", BudgetSchema);

export { Budget };

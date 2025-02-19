import { NextRequest, NextResponse } from "next/server";
import { Budget } from "@/lib/models/budget-model";
import connect from "@/lib/db";

// 📌 GET: Fetch all department budgets
export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const budgets = await Budget.find();
    return NextResponse.json(budgets, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching budgets", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 POST: Create a new department budget
export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const { department, totalBudget } = await req.json();

    if (!department || !totalBudget) {
      return NextResponse.json(
        { message: "Department and budget are required" },
        { status: 400 }
      );
    }

    const newBudget = new Budget({ department, totalBudget, expenses: [] });
    const savedBudget = await newBudget.save();

    return NextResponse.json(savedBudget, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating budget", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PATCH: Add Expense or Update Total Budget
export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const budgetId = searchParams.get("id");
    const { reason, amount, proof, totalBudget } = await req.json();

    if (!budgetId) {
      return NextResponse.json(
        { message: "Budget ID is required" },
        { status: 400 }
      );
    }

    let updatedBudget;

    // 📌 If reason & amount exist, add expense
    if (reason && amount) {
      updatedBudget = await Budget.findByIdAndUpdate(
        budgetId,
        { $push: { expenses: { reason, amount, proof } } },
        { new: true }
      );
    }

    // 📌 If totalBudget exists, update the budget
    if (totalBudget !== undefined) {
      updatedBudget = await Budget.findByIdAndUpdate(
        budgetId,
        { totalBudget },
        { new: true }
      );
    }

    if (!updatedBudget) {
      return NextResponse.json(
        { message: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Budget updated successfully", updatedBudget },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating budget", error: error.message },
      { status: 500 }
    );
  }
};
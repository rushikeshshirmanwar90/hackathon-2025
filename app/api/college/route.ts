import { NextRequest, NextResponse } from "next/server";
import { College } from "@/lib/models/user-model";
import connect from "@/lib/db";

// 📌 GET Request - Fetch All Colleges or a Single College by ID
export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("id");

    const collegeData = collegeId
      ? await College.findById(collegeId)
      : await College.find();

    if (!collegeData) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collegeData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to fetch colleges", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 POST Request - Add a New College
export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const body = await req.json();

    const newCollege = new College(body);
    await newCollege.save();

    return NextResponse.json(newCollege, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to register college", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PUT Request - Update College Data
export const PUT = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("id");
    const updatedData = await req.json();

    if (!collegeId) {
      return NextResponse.json(
        { message: "College ID is required" },
        { status: 400 }
      );
    }

    const updatedCollege = await College.findByIdAndUpdate(
      collegeId,
      updatedData,
      { new: true }
    );

    if (!updatedCollege) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCollege, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update college", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 DELETE Request - Remove a College
export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("id");

    if (!collegeId) {
      return NextResponse.json(
        { message: "College ID is required" },
        { status: 400 }
      );
    }

    const deletedCollege = await College.findByIdAndDelete(collegeId);

    if (!deletedCollege) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `${deletedCollege.name} deleted successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to delete college", error: error.message },
      { status: 500 }
    );
  }
};
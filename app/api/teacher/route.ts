import { NextRequest, NextResponse } from "next/server";
import { Teacher } from "@/lib/models/user-model";
import connect from "@/lib/db";

// Function to generate the next sequential teacherId
const generateTeacherId = async (): Promise<string> => {
  const lastTeacher = await Teacher.findOne().sort({ teacherId: -1 });
  const lastId = lastTeacher ? parseInt(lastTeacher.teacherId, 10) : 0;
  return (lastId + 1).toString();
};

// 📌 GET Request - Fetch All Teachers or a Single Teacher by ID
export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");

    let teacherData;
    if (teacherId) {
      teacherData = await Teacher.findOne({ teacherId });
    } else {
      teacherData = await Teacher.find();
    }

    if (!teacherData) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teacherData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to fetch teacher data", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 POST Request - Register a New Teacher (Password is Empty)
export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const body = await req.json();

    const newTeacherId = await generateTeacherId();

    const teacher = new Teacher({
      teacherId: newTeacherId,
      ...body,
      password: "", // Password remains empty during registration
    });

    const newTeacher = await teacher.save();

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to register teacher", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PUT Request - Update a Teacher (Full Update)
export const PUT = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");
    const updatedData = await req.json();

    if (!teacherId) {
      return NextResponse.json(
        { message: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { teacherId },
      { ...updatedData, password: "" }, // Password remains unchanged
      { new: true }
    );

    if (!updatedTeacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Teacher updated successfully", updatedTeacher },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update teacher", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PATCH Request - Partially Update a Teacher (Only Specific Fields)
export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");
    const updatedData = await req.json();

    if (!teacherId) {
      return NextResponse.json(
        { message: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { teacherId },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedTeacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Teacher updated successfully", updatedTeacher },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update teacher", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 DELETE Request - Remove a Teacher
export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");

    if (!teacherId) {
      return NextResponse.json(
        { message: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const deletedTeacher = await Teacher.findOneAndDelete({ teacherId });

    if (!deletedTeacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `${deletedTeacher.name} deleted successfully`,
        deletedTeacher,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to delete teacher", error: error.message },
      { status: 500 }
    );
  }
};

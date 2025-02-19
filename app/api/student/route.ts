import { NextRequest, NextResponse } from "next/server";

import { Student } from "@/lib/models/user-model";
import connect from "@/lib/db";

// Function to generate the next sequential studentId
const generateStudentId = async (): Promise<string> => {
  const lastStudent = await Student.findOne().sort({ studentId: -1 });

  // Start from 1000 if no students exist
  const lastId = lastStudent ? parseInt(lastStudent.studentId, 10) : 999;

  return (lastId + 1).toString();
};

// 📌 GET Request - Fetch All Student or a Single Student by ID
export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("id");

    let studentData;
    if (studentId) {
      studentData = await Student.findOne({ studentId });
    } else {
      studentData = await Student.find();
    }

    if (!studentData) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(studentData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to fetch Student data", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 POST Request - Register a New Student (Password is Empty)
export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const body = await req.json();

    const newStudentId = await generateStudentId();

    const student = await new Student({
      studentId: newStudentId,
      ...body,
      password: "", // Password remains empty during registration
    });

    const newStudent = await student.save();

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to register student", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PUT Request - Update a Student (Full Update)
export const PUT = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("id");
    const updatedData = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 }
      );
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { studentId },
      { ...updatedData, password: "" }, // Password remains unchanged
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student updated successfully", updatedStudent },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update Student", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PATCH Request - Partially Update a Student (Only Specific Fields)

export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("id");
    const updatedData = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 }
      );
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { studentId },
      { ...updatedData, password: "" },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student updated successfully", updatedStudent },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update Student", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 DELETE Request - Remove a Student
export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 }
      );
    }

    const deletedStudent = await Student.findOneAndDelete({ studentId });

    if (!deletedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `${deletedStudent.name} deleted successfully`,
        deletedStudent,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to delete Student", error: error.message },
      { status: 500 }
    );
  }
};

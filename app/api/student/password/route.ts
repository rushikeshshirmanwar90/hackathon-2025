import { NextRequest, NextResponse } from "next/server";
import { Student } from "@/lib/models/user-model";
import connect from "@/lib/db";
import bcrypt from "bcrypt";

export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("id");
    const { password } = await req.json();

    if (!studentId || !password) {
      return NextResponse.json(
        { message: "Student ID and password are required" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedStudent = await Student.findOneAndUpdate(
      { studentId },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Password generated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to generate password", error: error.message },
      { status: 500 }
    );
  }
};

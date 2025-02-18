import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Teacher } from "@/lib/models/user-model";
import connect from "@/lib/db";

export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");
    const { password } = await req.json();

    if (!teacherId || !password) {
      return NextResponse.json(
        { message: "Teacher ID and password are required" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { teacherId },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedTeacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
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

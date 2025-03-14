import { NextRequest, NextResponse } from "next/server";
import { College } from "@/lib/models/user-model";
import connect from "@/lib/db";
import bcrypt from "bcrypt";

export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("id");
    const { password } = await req.json();

    if (!collegeId || !password) {
      return NextResponse.json(
        { message: "doctor ID and password are required" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedDoctor = await College.findOneAndUpdate(
      { collegeId },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedDoctor) {
      return NextResponse.json(
        { message: "college not found" },
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

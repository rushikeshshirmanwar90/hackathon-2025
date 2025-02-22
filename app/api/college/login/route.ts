import connect from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { College } from "@/lib/models/user-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const cookieStore = await cookies();
    const { email, password } = await req.json();

    const JWT_SECRET = process.env.JWT_SECRET!;
    const COOKIE_NAME = "college_auth_token";

    const college = await College.findOne({ email });

    if (!college) {
      return NextResponse.json(
        {
          message: "Given emailId not found..!",
        },
        {
          status: 401, // Unauthorized
        }
      );
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, college.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "Invalid Password",
        },
        {
          status: 401, // Unauthorized
        }
      );
    }

    const collegeId = college.collegeId;
    const payload = { email, collegeId };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1000d",
    });

    cookieStore.set(COOKIE_NAME, token, {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 1000,
    });

    return NextResponse.json(
      {
        message: "Login successful..!",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.message.includes("buffering timed out")) {
      return NextResponse.json(
        {
          message: "Database connection timed out. Please try again later.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Can't log in: " + error.message,
      },
      {
        status: 500,
      }
    );
  }
};

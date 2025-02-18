import { NextRequest, NextResponse } from "next/server";

import { Doctor } from "@/lib/models/user-model";
import connect from "@/lib/db";

// Function to generate the next sequential teacherId
const generateDoctorId = async (): Promise<string> => {
  const lastDoctor = await Doctor.findOne().sort({ doctorId: -1 });
  const lastId = lastDoctor ? parseInt(lastDoctor.doctorId, 10) : 0;
  return (lastId + 1).toString();
};

// 📌 GET Request - Fetch All Doctor or a Single Teacher by ID
export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("id");

    let doctorData;
    if (doctorId) {
      doctorData = await Doctor.findOne({ doctorId });
    } else {
      doctorData = await Doctor.find();
    }

    if (!doctorData) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(doctorData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to fetch Student data", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 POST Request - Register a New Doctor (Password is Empty)
export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const body = await req.json();

    const newDoctorId = await generateDoctorId();

    const doctor = await new Doctor({
      DoctorId: newDoctorId,
      ...body,
      password: "", // Password remains empty during registration
    });

    const newDoctor = await doctor.save();

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to register student", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PUT Request - Update a Doctor (Full Update)
export const PUT = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("id");
    const updatedData = await req.json();

    if (!doctorId) {
      return NextResponse.json(
        { message: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorId },
      { ...updatedData, password: "" }, // Password remains unchanged
      { new: true }
    );

    if (!updatedDoctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Doctor updated successfully", updatedDoctor },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update Doctor", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PATCH Request - Partially Update a Doctor (Only Specific Fields)

export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("id");
    const updatedData = await req.json();

    if (!doctorId) {
      return NextResponse.json(
        { message: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorId },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedDoctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Doctor updated successfully", updatedDoctor },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update Doctor", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 DELETE Request - Remove a Student
export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("id");

    if (!doctorId) {
      return NextResponse.json(
        { message: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const deletedDoctor = await Doctor.findOneAndDelete({ doctorId });

    if (!deletedDoctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `${deletedDoctor.name} deleted successfully`,
        deletedDoctor,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to delete Doctor", error: error.message },
      { status: 500 }
    );
  }
};
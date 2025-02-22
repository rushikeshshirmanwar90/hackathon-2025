import { NextRequest, NextResponse } from "next/server";
import { Department } from "@/lib/models/user-model"; // Adjust path as per your project structure
import connect from "@/lib/db";

// 📌 GET: Fetch all departments
export const GET = async (req: NextRequest) => {
    try {
        await connect();
        const departments = await Department.find();
        return NextResponse.json(departments, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error fetching departments", error: error.message },
            { status: 500 }
        );
    }
};

// 📌 POST: Add a new department
export const POST = async (req: NextRequest) => {
    try {
        await connect();
        const body = await req.json();

        // Basic validation
        if (!body.collegeId || !body.head || !body.name) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const newDepartment = new Department(body);
        const savedDepartment = await newDepartment.save();
        return NextResponse.json(savedDepartment, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error adding department", error: error.message },
            { status: 500 }
        );
    }
};

// 📌 PATCH: Update department details
export const PATCH = async (req: NextRequest) => {
    try {
        await connect();
        const { searchParams } = new URL(req.url);
        const departmentId = searchParams.get("id");
        const updates = await req.json();

        if (!departmentId) {
            return NextResponse.json(
                { message: "Department ID required" },
                { status: 400 }
            );
        }

        const updatedDepartment = await Department.findByIdAndUpdate(
            departmentId,
            { $set: updates },
            { new: true }
        );

        if (!updatedDepartment) {
            return NextResponse.json(
                { message: "Department not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedDepartment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error updating department", error: error.message },
            { status: 500 }
        );
    }
};

// 📌 DELETE: Remove a department
export const DELETE = async (req: NextRequest) => {
    try {
        await connect();
        const { searchParams } = new URL(req.url);
        const departmentId = searchParams.get("id");

        if (!departmentId) {
            return NextResponse.json(
                { message: "Department ID required" },
                { status: 400 }
            );
        }

        const deletedDepartment = await Department.findByIdAndDelete(departmentId);

        if (!deletedDepartment) {
            return NextResponse.json(
                { message: "Department not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Department deleted successfully", deletedDepartment },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error deleting department", error: error.message },
            { status: 500 }
        );
    }
};
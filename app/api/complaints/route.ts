import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { Complaint } from "@/lib/models/complaint-model";

// Utility Function: Generate Complaint ID
const generateComplaintId = async (): Promise<string> => {
  const lastComplaint = await Complaint.findOne().sort({ complaintId: -1 });
  const lastId = lastComplaint ? parseInt(lastComplaint.complaintId, 10) : 0;
  return (lastId + 1).toString();
};

//  GET - Fetch Complaints
export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const complaintId = searchParams.get("id");
    const studentId = searchParams.get("studentId");
    const publicOnly = searchParams.get("public");

    let query: any = {};
    if (complaintId) query.complaintId = complaintId;
    if (studentId) query.studentId = studentId;
    if (publicOnly) query.isVisibleToPublic = true;

    const complaints = await Complaint.find(query);

    if (!complaints.length) {
      return NextResponse.json(
        { message: "No complaints found" },
        { status: 404 }
      );
    }

    return NextResponse.json(complaints, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to fetch complaints", error: error.message },
      { status: 500 }
    );
  }
};


// POST - Submit a Complaint
export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const body = await req.json();

    const newComplaintId = await generateComplaintId();

    const complaint = new Complaint({
      complaintId: newComplaintId,
      ...body,
    });

    const savedComplaint = await complaint.save();

    return NextResponse.json(savedComplaint, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to submit complaint", error: error.message },
      { status: 500 }
    );
  }
};

//  PATCH - Update Complaint Status (Review/Resolve)
export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const complaintId = searchParams.get("id");
    const { status, approvePublic } = await req.json();

    if (!complaintId) {
      return NextResponse.json(
        { message: "Complaint ID is required" },
        { status: 400 }
      );
    }

    // Prepare update object dynamically
    let updateFields: any = {};
    if (status) updateFields.status = status;
    if (approvePublic !== undefined)
      updateFields.isVisibleToPublic = approvePublic;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { message: "At least one field (status or approvePublic) is required" },
        { status: 400 }
      );
    }

    const updatedComplaint = await Complaint.findOneAndUpdate(
      { complaintId },
      updateFields,
      { new: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Complaint updated successfully",
        updatedComplaint,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update complaint", error: error.message },
      { status: 500 }
    );
  }
};


// DELETE - Remove a Complaint
export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const complaintId = searchParams.get("id");

    if (!complaintId) {
      return NextResponse.json(
        { message: "Complaint ID is required" },
        { status: 400 }
      );
    }

    const deletedComplaint = await Complaint.findOneAndDelete({ complaintId });

    if (!deletedComplaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Complaint deleted successfully", deletedComplaint },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to delete complaint", error: error.message },
      { status: 500 }
    );
  }
};
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { Election } from "@/lib/models/election-models";

export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const body = await req.json();

    const newElection = new Election({
      title: body.title,
      candidates: body.candidates, // Array of studentId
      status: "pending",
    });

    const savedElection = await newElection.save();

    return NextResponse.json(savedElection, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to create election", error: error.message },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const electionId = searchParams.get("id");

    let electionData;
    if (electionId) {
      electionData = await Election.findById(electionId).populate(
        "candidates.studentId"
      );
    } else {
      electionData = await Election.find().populate("candidates.studentId");
    }

    if (!electionData) {
      return NextResponse.json(
        { message: "Election not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(electionData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to fetch elections", error: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const electionId = searchParams.get("id");
    const updatedData = await req.json();

    if (!electionId) {
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    const updatedElection = await Election.findByIdAndUpdate(
      electionId,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedElection) {
      return NextResponse.json(
        { message: "Election not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedElection, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to update election", error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const electionId = searchParams.get("id");

    if (!electionId) {
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    const deletedElection = await Election.findByIdAndDelete(electionId);

    if (!deletedElection) {
      return NextResponse.json(
        { message: "Election not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Election deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to delete election", error: error.message },
      { status: 500 }
    );
  }
};

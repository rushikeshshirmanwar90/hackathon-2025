import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Vote } from "@/lib/models/election-models";
import { Election } from "@/lib/models/election-models";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { electionId, studentId, candidateId } = await req.json();

    const election = await Election.findById(electionId);
    if (!election || election.status !== "active") {
      return NextResponse.json(
        { message: "Election is not active" },
        { status: 400 }
      );
    }

    // Check if the student has already voted
    const existingVote = await Vote.findOne({ electionId, studentId });
    if (existingVote) {
      return NextResponse.json(
        { message: "You have already voted" },
        { status: 403 }
      );
    }

    // Add vote to the database
    const newVote = new Vote({ electionId, studentId, candidateId });
    await newVote.save();

    // Increment vote count for the candidate
    await Election.findOneAndUpdate(
      { _id: electionId, "candidates.studentId": candidateId },
      { $inc: { "candidates.$.votes": 1, totalVotes: 1 } }
    );

    return NextResponse.json(
      { message: "Vote cast successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to cast vote", error: error.message },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const electionId = searchParams.get("electionId");

    if (!electionId) {
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    const votes = await Vote.find({ electionId }).populate(
      "studentId candidateId"
    );

    return NextResponse.json(votes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error: Unable to fetch votes", error: error.message },
      { status: 500 }
    );
  }
};

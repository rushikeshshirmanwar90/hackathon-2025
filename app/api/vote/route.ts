import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Vote } from "@/lib/models/election-models";
import { Election } from "@/lib/models/election-models";
export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { electionId, studentId, candidateId, positionId } = await req.json();

    const election = await Election.findById(electionId);
    if (!election || election.status !== "active") {
      return NextResponse.json(
        { message: "Election is not active or the election has completed" },
        { status: 400 }
      );
    }

    const validCandidate = election.candidates.find(
      (candidate: any) =>
        candidate.positionId.toString() === positionId &&
        candidate.studentId === candidateId
    );

    if (!validCandidate) {
      return NextResponse.json(
        { message: "Invalid candidate for this position" },
        { status: 400 }
      );
    }

    // Check if the student has already voted
    const existingVote = await Vote.findOne({
      electionId,
      studentId,
      positionId,
    });
    if (existingVote) {
      return NextResponse.json(
        { message: "You have already voted" },
        { status: 403 }
      );
    }

    // Add vote to the database
    const newVote = new Vote({
      electionId,
      studentId,
      candidateId,
      positionId,
    });
    await newVote.save();

    await Election.findOneAndUpdate(
      {
        _id: electionId,
        candidates: {
          $elemMatch: { studentId: candidateId },
        },
      },
      {
        $inc: {
          "candidates.$.votes": 1,
          totalVotes: 1,
        },
      },
      { new: true }
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

import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { Election } from "@/lib/models/election-models";

export const PATCH = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const activeElection: any = await Election.findByIdAndUpdate(
      id,
      { status: "active" },
      { new: true }
    );

    if (activeElection) {
      return NextResponse.json(
        {
          message: `election is active successfully`,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: `Election not found`,
        },
        { status: 404 }
      );
    }
  } catch (error: any) {}
};

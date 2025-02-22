import connect from "@/lib/db";
import Position from "@/lib/models/position";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let data;

    if (!id) {
      data = await Position.find();
    } else {
      data = await Position.findById(id);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      message: "Error : can't get the position",
      error: error.message,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const body = await req.json();
    const position = await new Position(body);
    const savedData = await position.save();

    return NextResponse.json(savedData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      message: "Error : can't add the position",
      error: error.message,
    });
  }
};

import { NextRequest, NextResponse } from "next/server";
import { Facility } from "@/lib/models/facilityBooking-model";
import connect from "@/lib/db";

// 📌 GET: Fetch all facilities
export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const facilities = await Facility.find();
    return NextResponse.json(facilities, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching facilities", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 POST: Add a new facility
export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const body = await req.json();
    const newFacility = new Facility(body);
    const savedFacility = await newFacility.save();
    return NextResponse.json(savedFacility, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error adding facility", error: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const facilityId = searchParams.get("id");
    const body = await req.json();

    if (!facilityId)
      return NextResponse.json(
        { message: "Facility ID required" },
        { status: 400 }
      );

    const updatedFacility = await Facility.findByIdAndUpdate(facilityId, body, {
      new: true,
    });

    if (!updatedFacility)
      return NextResponse.json(
        { message: "Facility not found" },
        { status: 404 }
      );

    return NextResponse.json(updatedFacility, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating facility", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PATCH: Update facility availability
export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const facilityId = searchParams.get("id");
    const { availability } = await req.json();

    if (!facilityId)
      return NextResponse.json(
        { message: "Facility ID required" },
        { status: 400 }
      );

    const updatedFacility = await Facility.findByIdAndUpdate(
      facilityId,
      { availability },
      { new: true }
    );

    if (!updatedFacility)
      return NextResponse.json(
        { message: "Facility not found" },
        { status: 404 }
      );

    return NextResponse.json(updatedFacility, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating facility", error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const facilityId = searchParams.get("id");

    if (!facilityId)
      return NextResponse.json(
        { message: "Facility ID required" },
        { status: 400 }
      );

    const deleteFacility = await Facility.findByIdAndDelete(facilityId);

    if (!deleteFacility) {
      return NextResponse.json(
        { message: "Facility not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Facility Deleted successfully", deleteFacility },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error Delete facility", error: error.message },
      { status: 500 }
    );
  }
};

import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/lib/models/facilityBooking-model";
import connect from "@/lib/db";

// 📌 GET: Fetch bookings (all or for a specific student)
export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    const bookings = studentId
      ? await Booking.find({ bookedBy: studentId }).populate(
          "facilityId bookedBy"
        )
      : await Booking.find().populate("facilityId bookedBy");

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching bookings", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 POST: Request a facility booking
export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const { facilityId, bookedBy, date, timeSlot } = await req.json();

    if (!facilityId || !bookedBy || !date || !timeSlot) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingBooking = await Booking.findOne({
      facilityId,
      date,
      timeSlot,
    });

    if (existingBooking) {
      return NextResponse.json(
        { message: "Time slot already booked" },
        { status: 409 }
      );
    }

    const newBooking = new Booking({ facilityId, bookedBy, date, timeSlot });
    const savedBooking = await newBooking.save();

    return NextResponse.json(savedBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error booking facility", error: error.message },
      { status: 500 }
    );
  }
};

// 📌 PATCH: Approve or Reject a Booking
export const PATCH = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");
    const { status } = await req.json();

    if (!bookingId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Valid booking ID and status required" },
        { status: 400 }
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Booking status updated", updatedBooking },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating booking", error: error.message },
      { status: 500 }
    );
  }
};

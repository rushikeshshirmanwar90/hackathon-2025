import { model, models, Schema } from "mongoose";

const FacilitySchema = new Schema({
  facilityName: { type: String, required: true }, // e.g., Auditorium, Sports Ground
  description: { type: String },
  availability: { type: Boolean, default: true },
});

const BookingSchema = new Schema({
  facilityId: {
    type: Schema.Types.ObjectId,
    ref: "Facility",
    required: true,
  },
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Facility = models.Facility || model("Facility", FacilitySchema);
const Booking = models.Booking || model("Booking", BookingSchema);

export { Facility, Booking };

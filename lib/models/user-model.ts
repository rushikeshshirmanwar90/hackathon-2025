import { Schema, model, models } from "mongoose";
import Counter from "./Counter";

const CollegeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    emailPrefix: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const College = models.College || model("College", CollegeSchema);

// Student Schema
const StudentSchema = new Schema(
  {
    studentId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    password: { type: String, required: false, default: "" }, // 🔹 Password can be empty

    parentEmail: { type: String, required: true },
    parentPhone: { type: String, required: true },
    secondaryParentEmail: { type: String, required: false },
    secondaryParentPhone: { type: String, required: false },

    department: { type: String, required: true },
    joiningYear: { type: Number, required: true },
    semester: { type: Number, required: true },
    section: { type: String },
    role: { type: String, default: "student" },
  },
  { timestamps: true }
);

const Student = models.Student || model("Student", StudentSchema);

StudentSchema.pre("save", async function (next) {
  if (!this.studentId) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "studentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.studentId = counter!.seq;
  }
  next();
});

// Teacher Schema

const TeacherSchema = new Schema(
  {
    teacherId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: "" },
    department: { type: String, required: true },
    position: { type: String, required: true }, // e.g., HOD, Professor, Coordinator
    role: { type: String, default: "teacher" },
  },
  { timestamps: true }
);

const Teacher = models.Teacher || model("Teacher", TeacherSchema);

const DoctorSchema = new Schema(
  {
    doctorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "doctor" },
    collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
  },
  { timestamps: true }
);

const Doctor = models.Doctor || model("Doctor", DoctorSchema);

export { College, Student, Teacher, Doctor };

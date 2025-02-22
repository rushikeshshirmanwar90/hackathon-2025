import { Schema, model, models } from "mongoose";

const CollegeSchema = new Schema(
  {
    collegeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: false },
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

    password: { type: String, required: false, default: "" },

    parentEmail: { type: String, required: true },
    parentPhone: { type: String, required: true },
    secondaryParentEmail: { type: String, required: false },
    secondaryParentPhone: { type: String, required: false },

    department: { type: String, required: true },
    joiningYear: { type: Number, required: true },
    semester: { type: Number, required: true },
    section: { type: String },
    role: { type: String, default: "student" },
    collegeId: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = models.Student || model("Student", StudentSchema);

// Teacher Schema
const TeacherSchema = new Schema(
  {
    teacherId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: "" },
    department: { type: String, required: true },
    position: { type: String, required: true },
    collegeId: { type: String, required: true },
  },
  { timestamps: true }
);

const Teacher = models.Teacher || model("Teacher", TeacherSchema);

const DoctorSchema = new Schema(
  {
    doctorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: false },
    collegeId: { type: String, required: true },
  },
  { timestamps: true }
);

const Doctor = models.Doctor || model("Doctor", DoctorSchema);

const DepartmentSchema = new Schema({
  collegeId: { type: String, required: true },
  head: { type: String, required: true }, // teacher id
  name: {
    type: String,
    required: true,
  },
});

const Department = models.Department || model("Department", DepartmentSchema);

export { College, Student, Teacher, Doctor, Department };

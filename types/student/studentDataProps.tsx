// types/studentProps.ts
export interface StudentDataProps {
    studentId?: number;
    name: string;
    email: string;
    phone: string;
    password?: string;
    parentEmail: string;
    parentPhone: string;
    secondaryParentEmail?: string;
    secondaryParentPhone?: string;
    department: string;
    joiningYear: number;
    semester: number;
    section?: string;
    role: string;
    collegeId: string;
}
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Book, University, Users2 } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import { EditableSectionCard } from "@/components/EditableCards";
import { errorToast, successToast } from "@/components/toast";
import { StudentDataProps as StudentProps } from "@/types/student/studentDataProps";
import { Field } from "@/types/editableCard";
import { deptProps } from "@/types/dept";
import axios from "axios";
import { domain } from "@/domain";

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemQuery = searchParams.get("item");

    const [deptData, setDeptData] = useState<deptProps[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<StudentProps>({
        collegeId: "1",
        department: "",
        email: "",
        joiningYear: 0,
        name: "",
        parentEmail: "",
        parentPhone: "",
        phone: "",
        role: "",
        semester: 0,
        secondaryParentEmail: "",
        secondaryParentPhone: "",
        section: "",
    });

    // Fetch department data
    const fetchDeptData = async () => {
        try {
            const res = await axios.get(`${domain}/api/dept`);
            setDeptData(res.data);
        } catch (error) {
            console.error("Error fetching department data:", error);
        }
    };

    // Populate formData with query params data if we're editing
    useEffect(() => {
        fetchDeptData();
        if (itemQuery) {
            try {
                const parsedItem = JSON.parse(itemQuery) as StudentProps;
                setFormData(parsedItem);
                setIsEditing(true); // Set to edit mode
            } catch (error) {
                console.error("Error parsing item query:", error);
                errorToast("Failed to load student data for editing");
            }
        }
    }, [itemQuery]);

    const personalData: Field[] = [
        {
            key: "name",
            label: "Name",
            value: formData.name,
            type: "text",
        },
        {
            key: "email",
            label: "Email",
            value: formData.email,
            type: "text",
        },
        {
            key: "phone",
            label: "Phone",
            value: formData.phone,
            type: "text",
        },
        {
            key: "role",
            label: "Role",
            value: formData.role,
            type: "text",
        },
    ];

    const parentData: Field[] = [
        {
            key: "parentEmail",
            label: "Parent Email",
            value: formData.parentEmail,
            type: "text",
        },
        {
            key: "parentPhone",
            label: "Parent Phone",
            value: formData.parentPhone,
            type: "text",
        },
        {
            key: "secondaryParentEmail",
            label: "Secondary Parent Email",
            value: formData.secondaryParentEmail || "",
            type: "text",
        },
        {
            key: "secondaryParentPhone",
            label: "Secondary Parent Phone",
            value: formData.secondaryParentPhone || "",
            type: "text",
        },
    ];

    const collegeData: Field[] = [
        {
            key: "department",
            label: "Department",
            value: formData.department,
            type: "select",
            options: deptData.map((item) => ({
                label: item.name,
                value: item.name,
            })),
        },
        {
            key: "joiningYear",
            label: "Joining Year",
            value: formData.joiningYear,
            type: "number",
        },
        {
            key: "semester",
            label: "Semester",
            value: formData.semester,
            type: "number",
        },
        {
            key: "section",
            label: "Section",
            value: formData.section || "",
            type: "text",
        },
    ];

    const handleInputChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const isFormValid = () => {
        return (
            formData.name.trim() !== "" &&
            formData.email.trim() !== "" &&
            formData.phone.trim() !== "" &&
            formData.parentEmail.trim() !== "" &&
            formData.parentPhone.trim() !== "" &&
            formData.department.trim() !== "" &&
            formData.joiningYear > 0 &&
            formData.semester > 0 &&
            formData.collegeId.trim() !== ""
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) {
            errorToast("Please fill all required fields");
            return;
        }

        try {
            if (isEditing) {
                // Update existing student
                const response = await axios.put(`${domain}/api/student?id=${formData.studentId}`, formData);
                if (response.status === 200) {
                    successToast(`${formData.name} updated successfully`);
                    router.push("/student");
                }
            } else {
                // Add new student
                const response = await axios.post(`${domain}/api/student`, formData);
                if (response.status === 201) {
                    successToast(`${formData.name} added successfully`);
                    router.push("/student");
                }
            }
        } catch (error) {
            console.error("Error in form submission:", error);
            errorToast(`Failed to ${isEditing ? "update" : "add"} student`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto space-y-6 p-6">
            <TopHeader
                buttonText={isEditing ? "Update Student" : "Add Student"}
                tagTitle="Student"
                title={isEditing ? `Edit Student: ${formData.name}` : "Set up student registrations"}
                buttonDisable={!isFormValid()}
            />
            <div className="flex flex-col justify-between gap-10">
                <div>
                    <EditableSectionCard
                        title="Personal Information"
                        fields={personalData}
                        icon={<Book size={20} color="#073B3A" />}
                        onFieldChange={handleInputChange}
                    />
                </div>
                <div className="flex justify-between gap-10 w-full mt-5">
                    <div className="w-[50%]">
                        <EditableSectionCard
                            title="Parent Information"
                            fields={parentData}
                            icon={<Users2 size={20} color="#073B3A" />}
                            onFieldChange={handleInputChange}
                        />
                    </div>
                    <div className="w-[50%]">
                        <EditableSectionCard
                            title="College Information"
                            fields={collegeData}
                            icon={<University size={20} color="#073B3A" />}
                            onFieldChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Page;
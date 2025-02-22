"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Book, University, Users2 } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import { EditableSectionCard } from "@/components/EditableCards";
import { errorToast, successToast } from "@/components/toast";
import { Field } from "@/types/editableCard";
import { deptProps } from "@/types/dept";
import axios from "axios";
import { domain } from "@/domain";
import { TeacherProps } from "@/types/Teacher";


const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemQuery = searchParams.get("item");

    const [deptData, setDeptData] = useState<deptProps[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<TeacherProps>({
        collegeId: "1",
        department: "",
        email: "",
        name: "",
        password: "",
        phone: "",
        position: "",
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
                const parsedItem = JSON.parse(itemQuery) as TeacherProps;
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
        }
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
            key: "position",
            label: "Position",
            value: formData.position,
            type: "text"
        }
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
            formData.department.trim() !== "" &&
            formData.collegeId.trim() !== "" &&
            formData.position.trim() !== ""
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
                const response = await axios.put(`${domain}/api/teacher?id=${formData.teacherId}`, formData);
                if (response.status === 200) {
                    successToast(`${formData.name} updated successfully`);
                    router.push("/teacher");
                }
            } else {
                const response = await axios.post(`${domain}/api/teacher`, formData);
                if (response.status === 201) {
                    successToast(`${formData.name} added successfully`);
                    router.push("/teacher");
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
                buttonText={isEditing ? "Update Teacher" : "Add Teacher"}
                tagTitle="Student"
                title={isEditing ? `Edit Student: ${formData.name}` : "Set up student registrations"}
                buttonDisable={!isFormValid()}
            />
            <div className="flex flex-col justify-between gap-10 w-full mt-5">
                <div className="w-[100%]">
                    <EditableSectionCard
                        title="Parent Information"
                        fields={personalData}
                        icon={<Users2 size={20} color="#073B3A" />}
                        onFieldChange={handleInputChange}
                    />
                </div>
                <div>
                    <EditableSectionCard
                        title="College Information"
                        fields={collegeData}
                        icon={<Book size={20} color="#073B3A" />}
                        onFieldChange={handleInputChange}
                    />
                </div>
            </div>
        </form>
    );
};

export default Page;
import { domain } from "@/domain";
import { StudentDataProps as FormData } from "@/types/student/studentDataProps";

const endPoint = "student"

export const getSingleStudent = async (StudentId: string) => {
    const res = await fetch(`${domain}/api/${endPoint}?id=${StudentId}`);
    const data = await res.json();
    return data;
}

export const getAllStudent = async () => {
    const res = await fetch(`${domain}/api/${endPoint}`);
    const data = await res.json();
    return data;
}

export const deleteStudent = async (StudentId: string) => {
    const res = await fetch(`${domain}/api/${endPoint}?id=${StudentId}`, {
        method: "DELETE"
    })
    const data = await res.json();
    return data;
}

export const updateStudent = async (updatedData: FormData, StudentId: string) => {
    const res = await fetch(`${domain}/api/${endPoint}?id=${StudentId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
    })
    const data = await res.json();
    return data;
}

export const addStudent = async (data: FormData) => {
    try {
        const res = await fetch(`${domain}/api/${endPoint}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('API Error:', errorData);
            throw new Error(`API Error: ${errorData.message}`);
        }

        const newData = await res.json();
        return newData;
    } catch (error) {
        console.error('Error in addStudent:', error);
        return null;
    }
};
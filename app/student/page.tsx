// pages/students.tsx
"use client";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { domain } from '@/domain';
import TopHeader from '@/components/TopHeader';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import StudentRow from '@/components/table/StudentRow';

import { StudentDataProps as studentProps } from '@/types/student/studentDataProps';


const StudentsPage = () => {

    const router = useRouter();

    const [studentData, setStudentData] = useState<studentProps[]>([]);
    const [handleChange, setHandleChange] = useState<number>();

    const fetchTeacherData = async () => {
        try {
            const res = await axios.get(`${domain}/api/student`);
            const data = res.data;
            setStudentData(data);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const refreshData = () => {
        setHandleChange(Math.random());
    };

    useEffect(() => {
        fetchTeacherData();
    }, [handleChange]);

    const handleDelete = async (studentId: number | undefined) => {
        try {
            await axios.delete(`${domain}/api/student?id=${studentId}`);
            refreshData();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const handleEdit = (item: studentProps) => {
        const dataQuery = JSON.stringify(item);
        router.push(`/student-form?item=${dataQuery}`)
    };

    return (
        <div>
            <TopHeader
                buttonText='Add Student'
                tagTitle='Students'
                title='Our Students'
                TagIcon={<Plus />}
                link="/student-form"
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentData.map((item: studentProps) => (
                        <StudentRow
                            key={item.studentId}
                            item={item}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default StudentsPage;
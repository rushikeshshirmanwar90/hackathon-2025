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

import { TeacherProps } from '@/types/Teacher';
import TeacherRow from '@/components/table/TeacherRow';


const StudentsPage = () => {

    const router = useRouter();

    const [teacherData, setTeacherData] = useState<TeacherProps[]>([]);
    const [handleChange, setHandleChange] = useState<number>();

    const fetchTeacherData = async () => {
        try {
            const res = await axios.get(`${domain}/api/teacher`);
            const data = res.data;
            setTeacherData(data);
        } catch (error) {
            console.error("Error fetching Teacher data:", error);
        }
    };

    const refreshData = () => {
        setHandleChange(Math.random());
    };

    useEffect(() => {
        fetchTeacherData();
    }, [handleChange]);

    const handleDelete = async (studentId: string | undefined) => {
        try {
            await axios.delete(`${domain}/api/teacher?id=${studentId}`);
            refreshData();
        } catch (error) {
            console.error("Error deleting teacher:", error);
        }
    };

    const handleEdit = (item: TeacherProps) => {
        const dataQuery = JSON.stringify(item);
        router.push(`/teacher-form?item=${dataQuery}`)
    };

    return (
        <div>
            <TopHeader
                buttonText='Add Teacher'
                tagTitle='Teacher'
                title='Our Students'
                TagIcon={<Plus />}
                link="/teacher-form"
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Teacher Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>position</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teacherData.map((item: TeacherProps) => (
                        <TeacherRow
                            key={item.teacherId}
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
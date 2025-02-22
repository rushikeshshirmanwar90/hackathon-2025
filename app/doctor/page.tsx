"use client";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { domain } from '@/domain';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DoctorProps } from '@/types/Doctor';
import DoctorRows from '@/components/table/DoctorRow';
import Tag from '@/components/Tag';
import { DoctorDialog } from '@/components/DoctorDialog';
import { Button } from '@/components/ui/button';

const DoctorsPage = () => {
    const [formData, setFormData] = useState({
        collegeId: '1',
        name: '',
        email: '',
        phone: '',
        doctorId: '', // Keep it in state but we'll exclude it for POST
    });
    const [doctorData, setDoctorData] = useState<DoctorProps[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editItem, setEditItem] = useState<DoctorProps | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchDoctorData = async () => {
        try {
            const res = await axios.get(`${domain}/api/doctor`);
            setDoctorData(res.data);
        } catch (error) {
            console.error("Error fetching Doctor data:", error);
        }
    };

    const handleSubmit = async (closeDialog: () => void, isEdit: boolean = false) => {
        try {
            if (isEdit && formData.doctorId) {
                // Update existing doctor with doctorId
                await axios.put(`${domain}/api/doctor?id=${formData.doctorId}`, {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    doctorId: formData.doctorId,
                });
            } else {
                await axios.post(`${domain}/api/doctor`, {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    collegeId: '1'
                });
            }
            setFormData({ name: '', email: '', phone: '', doctorId: '', collegeId: '1' });

            setEditItem(null);
            setRefreshTrigger(prev => prev + 1);
            closeDialog();
        } catch (error) {
            console.error(`Error ${isEdit ? 'updating' : 'adding'} doctor:`, error);
        }
    };

    const handleDelete = async (doctorId: string | undefined) => {
        if (!doctorId) return;
        try {
            await axios.delete(`${domain}/api/doctor?id=${doctorId}`);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting doctor:", error);
        }
    };

    const handleEdit = (item: DoctorProps) => {
        setEditItem(item);
        setIsDialogOpen(true);
    };

    const openDialogForAdd = () => {
        setEditItem(null);
        setFormData({ name: '', email: '', phone: '', doctorId: '', collegeId: '1' });
        setIsDialogOpen(true);
    };

    useEffect(() => {
        fetchDoctorData();
    }, [refreshTrigger]);

    return (
        <div className="p-2">
            <div className='flex items-center justify-between mt-2'>
                <div className='flex flex-col gap-2'>
                    <div className='w-fit'>
                        <Tag title="Doctor" />
                    </div>
                    <h1 className='text-3xl font-semibold'>Our Doctors</h1>
                </div>
                <div>
                    <Button onClick={openDialogForAdd} variant="outline" className='bg-[#FCC608] hover:bg-[#fcc708de]'>
                        Add Doctor
                    </Button>
                    <DoctorDialog
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        editData={editItem}
                        isOpen={isDialogOpen}
                        setIsOpen={setIsDialogOpen}
                    />
                </div>
            </div>

            <div className="mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Doctor Id</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctorData.map((item: DoctorProps) => (
                            <DoctorRows
                                key={item.doctorId}
                                item={item}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DoctorsPage;
"use client";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { domain } from '@/domain';
import { Ellipsis, Pencil, Plus, Trash } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import DeleteContent from '@/components/DeleteContent';
import { deptProps } from '@/types/dept';
import Tag from '@/components/Tag';
import { DepartmentDialog } from '@/components/DeptDialog';

const DepartmentPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        head: '',
        collegeId: '1', // Default value
    });
    const [deptData, setDeptData] = useState<deptProps[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editItem, setEditItem] = useState<deptProps | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState<string | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchDepartmentData = async () => {
        try {
            const res = await axios.get(`${domain}/api/dept`);
            setDeptData(res.data);
        } catch (error) {
            console.error("Error fetching department data:", error);
        }
    };

    const handleAdd = async (closeDialog: () => void) => {
        try {
            await axios.post(`${domain}/api/dept`, formData);
            setFormData({ name: '', head: '', collegeId: '1' });
            setRefreshTrigger(prev => prev + 1);
            closeDialog();
        } catch (error) {
            console.error("Error adding department:", error);
        }
    };

    const handleUpdate = async (closeDialog: () => void, id: string) => {
        try {
            await axios.put(`${domain}/api/dept?id=${id}`, formData);
            setFormData({ name: '', head: '', collegeId: '1' });
            setEditItem(null);
            setRefreshTrigger(prev => prev + 1);
            closeDialog();
        } catch (error) {
            console.error("Error updating department:", error);
        }
    };

    const handleDelete = () => {
        if (deleteItemId) {
            try {
                axios.delete(`${domain}/api/dept?id=${deleteItemId}`);
                setRefreshTrigger(prev => prev + 1);
                setDeleteItemId(undefined);
            } catch (error) {
                console.error("Error deleting department:", error);
            }
        }
        setIsDeleteModalOpen(false);
    };

    const handleEdit = (item: deptProps) => {
        setEditItem(item);
        setIsDialogOpen(true);
    };

    const handleOpenDelete = (e: React.MouseEvent, id: string | undefined) => {
        e.preventDefault();
        setDeleteItemId(id);
        setIsDeleteModalOpen(true);
    };

    const openDialogForAdd = () => {
        setEditItem(null);
        setFormData({ name: '', head: '', collegeId: '1' });
        setIsDialogOpen(true);
    };

    useEffect(() => {
        fetchDepartmentData();
    }, [refreshTrigger]);

    return (
        <div className="p-2">
            <div className='flex items-center justify-between mt-2'>
                <div className='flex flex-col gap-2'>
                    <div className='w-fit'>
                        <Tag title="Department" />
                    </div>
                    <h1 className='text-3xl font-semibold'>Our Departments</h1>
                </div>
                <div>
                    <Button onClick={openDialogForAdd} variant="outline" className='bg-[#FCC608] hover:bg-[#fcc708de]'>
                        Add Department
                    </Button>
                    <DepartmentDialog
                        nameValue={formData.name}
                        headValue={formData.head}
                        setFormData={setFormData}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
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
                            <TableHead>Department Name</TableHead>
                            <TableHead>Head of Department</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deptData.map((item: deptProps) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.head}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Ellipsis className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Department Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit Department
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => handleOpenDelete(e, item._id)}>
                                                <Trash className="mr-2 h-4 w-4" /> Delete Department
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <DeleteContent
                handleDelete={handleDelete}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
            />
        </div>
    );
};

export default DepartmentPage;
// components/StudentRow.tsx
"use client";
import React, { useState } from 'react';
import {
    TableCell,
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
import { Ellipsis, Pencil, Trash } from 'lucide-react';
import DeleteContent from '@/components/DeleteContent';
import { DoctorProps } from '@/types/Doctor';

interface DoctorRowProps {
    item: DoctorProps;
    onDelete: (teacherId: string | undefined) => void;
    onEdit: (item: DoctorProps) => void;
}

const DoctorRows: React.FC<DoctorRowProps> = ({ item, onDelete, onEdit }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        onDelete(item.doctorId);
        setIsDeleteModalOpen(false);
    };

    const handleOpenDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDropdownOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        onEdit(item);
        setIsDropdownOpen(false);
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{item.doctorId}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="font-medium">{item.email}</TableCell>
                <TableCell className="font-medium">{item.phone}</TableCell>
                <TableCell>
                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Ellipsis className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Doctor Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleEdit}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleOpenDelete}>
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            <DeleteContent
                handleDelete={handleDelete}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
            />
        </>
    );
};

export default DoctorRows;
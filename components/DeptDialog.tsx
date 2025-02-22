import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { deptProps } from '@/types/dept';

interface DeptFormData {
    name: string;
    head: string;
    collegeId: string;
}

interface DepartmentDialogProps {
    nameValue: string;
    headValue: string;
    setFormData: Dispatch<SetStateAction<DeptFormData>>;
    onAdd: (closeDialog: () => void) => void; // Separate function for adding
    onUpdate: (closeDialog: () => void, id: string) => void; // Separate function for updating
    editData?: deptProps | null;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const DepartmentDialog: React.FC<DepartmentDialogProps> = ({
    nameValue,
    headValue,
    setFormData,
    onAdd,
    onUpdate,
    editData,
    isOpen,
    setIsOpen,
}) => {
    useEffect(() => {
        if (editData && isOpen) {
            setFormData({
                name: editData.name,
                head: editData.head,
                collegeId: editData.collegeId,
            });
        } else if (!editData && isOpen) {
            setFormData({
                name: '',
                head: '',
                collegeId: '1', // Default value as specified
            });
        }
    }, [editData, isOpen, setFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = () => {
        if (editData && editData._id) {
            onUpdate(() => setIsOpen(false), editData._id);
        } else {
            onAdd(() => setIsOpen(false));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Edit Department' : 'Add Department'}</DialogTitle>
                    <DialogDescription>
                        {editData ? 'Update the department details below.' : 'Enter the details for the new department here.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={nameValue}
                            onChange={handleChange}
                            className="col-span-3"
                            placeholder="Enter department name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="head" className="text-right">Head</Label>
                        <Input
                            id="head"
                            value={headValue}
                            onChange={handleChange}
                            className="col-span-3"
                            placeholder="Enter head of department"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>
                        {editData ? 'Update Department' : 'Add Department'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
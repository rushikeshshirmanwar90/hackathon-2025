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
import { DoctorProps } from '@/types/Doctor';

interface DoctorFormData {
    name: string;
    email: string;
    phone: string;
    doctorId?: string;
}

interface DoctorDialogProps {
    formData: DoctorFormData;
    setFormData: Dispatch<SetStateAction<DoctorFormData>>;
    onSubmit: (closeDialog: () => void, isEdit?: boolean) => void;
    editData?: DoctorProps | null;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const DoctorDialog: React.FC<DoctorDialogProps> = ({
    formData,
    setFormData,
    onSubmit,
    editData,
    isOpen,
    setIsOpen,
}) => {
    useEffect(() => {
        if (editData && isOpen) {
            setFormData({
                name: editData.name,
                email: editData.email,
                phone: editData.phone,
                doctorId: editData.doctorId,
            });
        } else if (!editData && isOpen) {
            setFormData({
                name: '',
                email: '',
                phone: '',
                doctorId: '', // Ensure it's empty for new entries
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
        onSubmit(() => setIsOpen(false), !!editData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
                    <DialogDescription>
                        {editData ? 'Update the doctor details below.' : 'Enter the details for the new doctor here.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="col-span-3"
                            placeholder="Enter doctor's name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="col-span-3"
                            type="email"
                            placeholder="Enter doctor's email"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Phone</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="col-span-3"
                            type="tel"
                            placeholder="Enter doctor's phone"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>
                        {editData ? 'Update Doctor' : 'Add Doctor'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
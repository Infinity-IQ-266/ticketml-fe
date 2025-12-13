import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    addMemberMutation,
    getMembersQueryKey,
} from '@/services/client/@tanstack/react-query.gen';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    orgId: string;
}

export const AddMemberModal = ({
    isOpen,
    onClose,
    orgId,
}: AddMemberModalProps) => {
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<
        'OWNER' | 'MANAGER' | 'STAFF'
    >('STAFF');
    const queryClient = useQueryClient();

    const addMember = useMutation({
        ...addMemberMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getMembersQueryKey({
                    path: { orgId: Number(orgId) },
                }),
            });
            toast.success('Member added successfully');
            onClose();
            setNewMemberEmail('');
            setNewMemberRole('STAFF');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to add member');
        },
    });

    const handleSubmit = () => {
        if (!newMemberEmail.trim()) {
            toast.error('Please enter an email address');
            return;
        }
        addMember.mutate({
            path: {
                orgId: Number(orgId),
            },
            body: {
                email: newMemberEmail,
                role: newMemberRole,
            },
        });
    };

    const handleClose = () => {
        onClose();
        setNewMemberEmail('');
        setNewMemberRole('STAFF');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl border border-gray-light bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-black">
                    Add New Member
                </h2>
                <div className="space-y-4">
                    <div>
                        <Label
                            htmlFor="member-email"
                            className="mb-2 block text-sm font-semibold text-black"
                        >
                            Email Address
                        </Label>
                        <Input
                            id="member-email"
                            type="email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            placeholder="member@example.com"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="member-role"
                            className="mb-2 block text-sm font-semibold text-black"
                        >
                            Role
                        </Label>
                        <select
                            id="member-role"
                            value={newMemberRole}
                            onChange={(e) =>
                                setNewMemberRole(
                                    e.target.value as
                                        | 'OWNER'
                                        | 'MANAGER'
                                        | 'STAFF',
                                )
                            }
                            className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-secondary focus:outline-none"
                        >
                            <option value="STAFF">Staff</option>
                            <option value="MANAGER">Manager</option>
                            <option value="OWNER">Owner</option>
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={addMember.isPending}
                            className="flex-1 bg-secondary hover:bg-secondary-darken"
                        >
                            {addMember.isPending ? 'Adding...' : 'Add Member'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

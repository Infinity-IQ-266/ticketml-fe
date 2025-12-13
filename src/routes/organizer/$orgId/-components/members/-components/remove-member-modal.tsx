import { Button } from '@/components/ui/button';
import {
    getMembersQueryKey,
    removeMemberMutation,
} from '@/services/client/@tanstack/react-query.gen';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Member {
    userId: number;
    email: string;
    fullName: string;
    role: 'OWNER' | 'MANAGER' | 'STAFF';
}

interface RemoveMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: Member | null;
    orgId: string;
}

export const RemoveMemberModal = ({
    isOpen,
    onClose,
    member,
    orgId,
}: RemoveMemberModalProps) => {
    const queryClient = useQueryClient();

    const removeMember = useMutation({
        ...removeMemberMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getMembersQueryKey({
                    path: { orgId: Number(orgId) },
                }),
            });
            toast.success('Member removed successfully');
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to remove member');
        },
    });

    const handleRemove = () => {
        if (!member) return;

        removeMember.mutate({
            path: {
                orgId: Number(orgId),
                userId: member.userId,
            },
        });
    };

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl border border-gray-light bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-red/10">
                        <AlertTriangle className="size-6 text-red" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-black">
                            Remove Team Member?
                        </h2>
                        <p className="mt-2 text-sm text-gray">
                            Are you sure you want to remove{' '}
                            <span className="font-semibold text-black">
                                {member.fullName}
                            </span>{' '}
                            from the organization? This action cannot be undone.
                        </p>
                        <div className="mt-3 rounded-lg bg-gray-light/30 p-3">
                            <p className="text-xs text-gray">
                                <span className="font-semibold">Email:</span>{' '}
                                {member.email}
                            </p>
                            <p className="mt-1 text-xs text-gray">
                                <span className="font-semibold">Role:</span>{' '}
                                {member.role}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                        disabled={removeMember.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRemove}
                        disabled={removeMember.isPending}
                        className="flex-1 bg-red hover:bg-red/90"
                    >
                        {removeMember.isPending ? 'Removing...' : 'Remove'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

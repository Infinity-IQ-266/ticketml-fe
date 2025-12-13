import { UserPlus, Users } from 'lucide-react';

import { MemberCard } from './-components';

interface Member {
    userId: number;
    email: string;
    fullName: string;
    role: 'OWNER' | 'MANAGER' | 'STAFF';
    status: string | null;
}

interface MembersTabProps {
    members: Member[];
    currentUserId?: number;
    isLoading: boolean;
    onAddMember: () => void;
    onRemoveMember: (member: Member) => void;
}

export const MembersTab = ({
    members,
    currentUserId,
    isLoading,
    onAddMember,
    onRemoveMember,
}: MembersTabProps) => {
    return (
        <div className="space-y-4">
            {/* Add Member Button */}
            <button
                onClick={onAddMember}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-secondary bg-secondary/5 p-6 font-semibold text-black transition-all hover:bg-secondary/10 hover:shadow-md"
            >
                <UserPlus className="size-6" />
                <span className="text-lg">Add New Member</span>
            </button>

            {/* Members List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-light bg-gray-light/10 py-20">
                    <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-gray-light border-t-secondary"></div>
                    <p className="text-lg font-semibold text-gray">
                        Loading members...
                    </p>
                </div>
            ) : members.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-light bg-gray-light/10 py-20">
                    <Users className="mb-4 size-16 text-gray-light" />
                    <p className="text-xl font-semibold text-gray">
                        No members yet
                    </p>
                    <p className="mt-2 text-sm text-gray">
                        Add your first member to get started
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {members.map((member) => (
                        <MemberCard
                            key={member.userId}
                            member={member}
                            currentUserId={currentUserId}
                            onRemove={onRemoveMember}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

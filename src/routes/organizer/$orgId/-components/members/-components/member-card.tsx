import { cn } from '@/lib/utils';
import { Trash2, Users } from 'lucide-react';

interface Member {
    userId: number;
    email: string;
    fullName: string;
    role: 'OWNER' | 'MANAGER' | 'STAFF';
    status: string | null;
}

interface MemberCardProps {
    member: Member;
    currentUserId?: number;
    onRemove: (member: Member) => void;
}

export const MemberCard = ({
    member,
    currentUserId,
    onRemove,
}: MemberCardProps) => {
    return (
        <div className="group flex flex-col gap-4 rounded-xl border border-gray-light bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:flex-row md:items-center md:justify-between md:p-6">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                    <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20">
                        <Users className="size-6 text-secondary-darken" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-bold text-black">
                            {member.fullName}
                        </h3>
                        <p className="truncate text-sm text-gray">
                            {member.email}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="flex flex-col items-start md:items-end">
                    <span
                        className={cn(
                            'rounded-full px-4 py-1 text-sm font-semibold',
                            member.role === 'OWNER'
                                ? 'bg-primary/20 text-primary-darken'
                                : member.role === 'MANAGER'
                                  ? 'bg-secondary/20 text-secondary-darken'
                                  : 'bg-gray-light/50 text-gray',
                        )}
                    >
                        {member.role}
                    </span>
                    {member.status && (
                        <span className="mt-1 text-xs text-gray">
                            Status: {member.status}
                        </span>
                    )}
                </div>
                {member.userId !== currentUserId && (
                    <button
                        onClick={() => onRemove(member)}
                        className="flex-shrink-0 rounded-lg bg-red/10 p-3 text-red transition-all hover:bg-red hover:text-white hover:shadow-md"
                    >
                        <Trash2 className="size-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

import { GoogleIcon, UserIcon } from '@/assets/icons';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BACKEND_URL } from '@/envs';
import { useMe } from '@/hooks';
import { cn } from '@/lib/utils';
import { getMyOrganizationsOptions } from '@/services/client/@tanstack/react-query.gen';
import type { MeData, Organization } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router';
import {
    Building2,
    Calendar,
    ChevronRight,
    FileText,
    LogOut,
    Menu as MenuIcon,
    Ticket,
    X,
} from 'lucide-react';

interface MenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const Menu = ({ open, onOpenChange }: MenuProps) => {
    const matchRoute = useMatchRoute();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: rawMeData } = useMe();
    const meData = rawMeData?.data as MeData;

    const { data: orgResponse } = useQuery({
        ...getMyOrganizationsOptions(),
        staleTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: !!meData, // Only fetch if user is logged in
    });

    const myOrganizations = orgResponse?.data as Organization[];

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        queryClient.removeQueries();
        onOpenChange(false);
        navigate({ to: '/' });
    };

    const closeMenu = () => onOpenChange(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[90vh] max-w-sm overflow-hidden rounded-xl border border-gray-light p-0 shadow-xl md:max-w-md"
                showCloseButton={false}
            >
                <div className="flex h-full max-h-[90vh] flex-col">
                    {/* Header */}
                    <DialogHeader className="border-b border-gray-light bg-white p-5 md:p-6">
                        <DialogTitle className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 md:size-12">
                                    <MenuIcon className="size-5 text-primary md:size-6" />
                                </div>
                                <span className="text-2xl font-bold text-black md:text-3xl">
                                    Menu
                                </span>
                            </div>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-light/50 active:scale-95"
                                aria-label="Close menu"
                            >
                                <X className="size-5 text-gray md:size-6" />
                            </button>
                        </DialogTitle>
                    </DialogHeader>

                    {/* User Section */}
                    <div className="border-b border-gray-light p-5 md:p-6">
                        {meData ? (
                            <div className="flex items-center gap-3">
                                <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-gray-light bg-primary/5 md:size-14">
                                    <UserIcon className="aspect-[34/38] h-auto w-7 md:w-8" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-base font-bold text-black md:text-lg">
                                        {meData.fullName}
                                    </p>
                                    <p className="truncate text-xs text-gray md:text-sm">
                                        {meData.email}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
                                }}
                                className="group flex w-full items-center justify-center gap-2 rounded-lg border border-gray-light bg-white px-4 py-3 text-base font-semibold shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md active:scale-95 md:text-lg"
                            >
                                <GoogleIcon className="size-5 transition-transform duration-200 group-hover:scale-110 md:size-6" />
                                <span className="text-black">
                                    Login with Google
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Menu Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Navigation Links */}
                        <div className="border-b border-gray-light p-4 md:p-5">
                            <h3 className="mb-3 px-2 text-xs font-semibold tracking-wider text-gray/70 uppercase md:text-sm">
                                Navigation
                            </h3>
                            <nav className="space-y-1">
                                <Link
                                    to="/"
                                    onClick={closeMenu}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 md:text-lg',
                                        matchRoute({ to: '/', fuzzy: true })
                                            ? 'bg-primary/10 text-black shadow-sm'
                                            : 'text-gray hover:bg-gray-light/50 hover:text-black',
                                    )}
                                >
                                    <Calendar className="size-5 shrink-0" />
                                    <span className="flex-1">Events</span>
                                    <ChevronRight className="size-5 opacity-50 transition-transform group-hover:translate-x-0.5" />
                                </Link>

                                <Link
                                    to="/my-tickets"
                                    onClick={closeMenu}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 md:text-lg',
                                        matchRoute({
                                            to: '/my-tickets',
                                            fuzzy: false,
                                        })
                                            ? 'bg-primary/10 text-black shadow-sm'
                                            : 'text-gray hover:bg-gray-light/50 hover:text-black',
                                    )}
                                >
                                    <Ticket className="size-5 shrink-0" />
                                    <span className="flex-1">My Tickets</span>
                                    <ChevronRight className="size-5 opacity-50 transition-transform group-hover:translate-x-0.5" />
                                </Link>

                                <Link
                                    to="/resources"
                                    onClick={closeMenu}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 md:text-lg',
                                        matchRoute({
                                            to: '/resources',
                                            fuzzy: true,
                                        })
                                            ? 'bg-primary/10 text-black shadow-sm'
                                            : 'text-gray hover:bg-gray-light/50 hover:text-black',
                                    )}
                                >
                                    <FileText className="size-5 shrink-0" />
                                    <span className="flex-1">Resources</span>
                                    <ChevronRight className="size-5 opacity-50 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </nav>
                        </div>

                        {/* Organizations Section (only show if logged in and has orgs) */}
                        {meData &&
                            myOrganizations &&
                            myOrganizations.length > 0 && (
                                <div className="border-b border-gray-light p-4 md:p-5">
                                    <h3 className="mb-3 px-2 text-xs font-semibold tracking-wider text-gray/70 uppercase md:text-sm">
                                        My Organizations
                                    </h3>
                                    <nav className="space-y-1">
                                        {myOrganizations.map((org) => (
                                            <button
                                                key={org.organizationId}
                                                onClick={() => {
                                                    closeMenu();
                                                    navigate({
                                                        to: '/organizer/$orgId',
                                                        params: {
                                                            orgId: org.organizationId,
                                                        },
                                                    });
                                                }}
                                                className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium text-gray transition-all duration-200 hover:bg-gray-light/50 hover:text-black md:text-lg"
                                            >
                                                <Building2 className="size-5 shrink-0" />
                                                <span className="flex-1 truncate">
                                                    {org.name}
                                                </span>
                                                <ChevronRight className="size-5 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5" />
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            )}
                    </div>

                    {/* Footer with Logout (only show if logged in) */}
                    {meData && (
                        <div className="border-t border-gray-light p-5 md:p-6">
                            <button
                                onClick={handleLogout}
                                className="group flex w-full items-center justify-center gap-2 rounded-lg border border-red/20 bg-red/5 px-4 py-3 text-base font-semibold text-red transition-all duration-200 hover:border-red/40 hover:bg-red/10 active:scale-95 md:text-lg"
                            >
                                <LogOut className="size-5 transition-transform group-hover:-translate-x-0.5" />
                                <span>Log out</span>
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

import { useMe } from '@/hooks/use-me';
import { cn } from '@/lib/utils';
import {
    addMemberMutation,
    getDashboardOptions,
    getEventsByOrganizationOptions,
    getMembersOptions,
    getMyOrganizationsOptions,
    removeMemberMutation,
} from '@/services/client/@tanstack/react-query.gen';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
    Building2,
    Calendar,
    DollarSign,
    Mail,
    MapPin,
    Phone,
    Plus,
    QrCode,
    Settings,
    Ticket,
    Trash2,
    TrendingUp,
    UserPlus,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { CreateEventModal } from './-components';

export const Route = createFileRoute('/organizer/$orgId/')({
    component: RouteComponent,
});

type TabType = 'events' | 'members' | 'settings';

// Types based on actual API response
interface Organization {
    organizationId: number;
    name: string;
    description: string;
    logoUrl: string;
    email: string | null;
    phoneNumber: string | null;
    address: string;
}

interface Member {
    userId: number;
    email: string;
    fullName: string;
    role: 'OWNER' | 'MANAGER' | 'STAFF';
    status: string | null;
}

interface TicketType {
    id: number;
    type: string;
    price: number;
    totalQuantity: number;
    remainingQuantity: number;
    status: string | null;
}

interface EventData {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    organizationId: number;
    organizationName: string;
    ticketTypes: TicketType[];
}

interface DashboardData {
    totalRevenue: number;
    totalOrders: number;
    totalTicketsSold: number;
    totalEvents: number;
}

function RouteComponent() {
    const { orgId } = Route.useParams();
    const [activeTab, setActiveTab] = useState<TabType>('events');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<
        'OWNER' | 'MANAGER' | 'STAFF'
    >('STAFF');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Get current user info
    const { data: meResponse } = useMe();
    const currentUser = meResponse?.data as
        | { userId: number; email: string }
        | undefined;

    // Fetch organization details from my organizations list
    const { data: orgsResponse } = useQuery({
        ...getMyOrganizationsOptions(),
        staleTime: 60 * 60 * 1000,
    });

    // Fetch dashboard data for stats
    const { data: dashboardResponse } = useQuery({
        ...getDashboardOptions({
            path: { orgId: Number(orgId) },
        }),
        staleTime: 5 * 60 * 1000,
    });

    // Fetch events for this organization
    const { data: eventsResponse, isLoading: isLoadingEvents } = useQuery({
        ...getEventsByOrganizationOptions({
            path: { orgId: Number(orgId) },
        }),
        staleTime: 5 * 60 * 1000,
    });

    // Fetch members for this organization
    const { data: membersResponse, isLoading: isLoadingMembers } = useQuery({
        ...getMembersOptions({
            path: { orgId: Number(orgId) },
        }),
        staleTime: 5 * 60 * 1000,
    });

    // Extract organization from the organizations list
    const organizations = (orgsResponse?.data as Organization[]) ?? [];
    const currentOrg = organizations.find(
        (org) => org.organizationId === Number(orgId),
    );

    const organization = currentOrg
        ? {
              id: currentOrg.organizationId,
              name: currentOrg.name ?? 'My Organization',
              description: currentOrg.description ?? 'No description available',
              email: currentOrg.email ?? '',
              phoneNumber: currentOrg.phoneNumber ?? '',
              address: currentOrg.address ?? '',
              logoUrl: currentOrg.logoUrl ?? '',
          }
        : {
              id: Number(orgId),
              name: 'Loading...',
              description: '',
              email: '',
              phoneNumber: '',
              address: '',
              logoUrl: '',
          };

    // Extract dashboard stats
    const dashboardData = dashboardResponse?.data as DashboardData | undefined;

    // Extract members and check current user's role
    const members = (membersResponse?.data as Member[]) ?? [];
    const currentUserMember = members.find(
        (member) => member.email === currentUser?.email,
    );
    const canManageMembers =
        currentUserMember?.role === 'OWNER' ||
        currentUserMember?.role === 'MANAGER';

    // Mutations for member management
    const addMember = useMutation({
        ...addMemberMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getMembers', { path: { orgId: Number(orgId) } }],
            });
            toast.success('Member added successfully');
            setIsAddMemberModalOpen(false);
            setNewMemberEmail('');
            setNewMemberRole('STAFF');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to add member');
        },
    });

    const removeMember = useMutation({
        ...removeMemberMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getMembers', { path: { orgId: Number(orgId) } }],
            });
            toast.success('Member removed successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to remove member');
        },
    });

    // Extract events from API response and calculate stats
    const apiEvents = (eventsResponse?.data as EventData[]) ?? [];
    const events = apiEvents.map((event) => {
        // Calculate tickets sold from ticket types
        const totalTickets = event.ticketTypes.reduce(
            (sum, tt) => sum + tt.totalQuantity,
            0,
        );
        const ticketsSold = event.ticketTypes.reduce(
            (sum, tt) => sum + (tt.totalQuantity - tt.remainingQuantity),
            0,
        );
        const revenue = event.ticketTypes.reduce(
            (sum, tt) =>
                sum + tt.price * (tt.totalQuantity - tt.remainingQuantity),
            0,
        );

        return {
            id: String(event.id),
            title: event.title ?? 'Untitled Event',
            startDate: event.startDate ?? '',
            endDate: event.endDate ?? '',
            location: event.location ?? 'TBA',
            ticketsSold,
            totalTickets,
            revenue,
            status: 'ACTIVE',
        };
    });

    if (isLoadingEvents || !currentOrg) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-gray-light border-t-primary"></div>
                    <p className="text-lg font-semibold text-gray">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col px-5 py-5 md:px-10 md:py-10">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                        {organization.logoUrl ? (
                            <img
                                src={organization.logoUrl}
                                alt={organization.name}
                                className="size-16 rounded-xl border-2 border-black object-cover md:size-20"
                            />
                        ) : (
                            <div className="flex size-16 items-center justify-center rounded-xl border-2 border-black bg-primary/20 md:size-20">
                                <Building2 className="size-8 text-primary-darken md:size-10" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-black md:text-4xl">
                                {organization.name}
                            </h1>
                            <p className="mt-1 text-sm text-gray md:text-base">
                                {organization.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats Cards */}
                {dashboardData && (
                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-gradient-to-br from-green/10 to-green/5 p-4 shadow-sm">
                            <div className="rounded-lg bg-green/20 p-2">
                                <DollarSign className="size-5 text-green-darken" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray">
                                    Total Revenue
                                </p>
                                <p className="truncate text-lg font-bold text-black">
                                    {dashboardData.totalRevenue.toLocaleString()}{' '}
                                    VND
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-gradient-to-br from-primary/10 to-primary/5 p-4 shadow-sm">
                            <div className="rounded-lg bg-primary/20 p-2">
                                <TrendingUp className="size-5 text-primary-darken" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray">
                                    Total Orders
                                </p>
                                <p className="truncate text-lg font-bold text-black">
                                    {dashboardData.totalOrders}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-gradient-to-br from-secondary/10 to-secondary/5 p-4 shadow-sm">
                            <div className="rounded-lg bg-secondary/20 p-2">
                                <Ticket className="size-5 text-secondary-darken" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray">
                                    Tickets Sold
                                </p>
                                <p className="truncate text-lg font-bold text-black">
                                    {dashboardData.totalTicketsSold}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-gradient-to-br from-blue/10 to-blue/5 p-4 shadow-sm">
                            <div className="rounded-lg bg-blue/20 p-2">
                                <Calendar className="size-5 text-blue" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray">
                                    Total Events
                                </p>
                                <p className="truncate text-lg font-bold text-black">
                                    {dashboardData.totalEvents}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Organization Info Cards */}
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {organization.email && (
                        <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-white p-4 shadow-sm">
                            <div className="rounded-lg bg-secondary/20 p-2">
                                <Mail className="size-5 text-secondary-darken" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray">
                                    Email
                                </p>
                                <p className="truncate text-sm font-semibold text-black">
                                    {organization.email}
                                </p>
                            </div>
                        </div>
                    )}
                    {organization.phoneNumber && (
                        <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-white p-4 shadow-sm">
                            <div className="rounded-lg bg-primary/20 p-2">
                                <Phone className="size-5 text-primary-darken" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray">
                                    Phone
                                </p>
                                <p className="truncate text-sm font-semibold text-black">
                                    {organization.phoneNumber}
                                </p>
                            </div>
                        </div>
                    )}
                    {organization.address && (
                        <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-white p-4 shadow-sm">
                            <div className="rounded-lg bg-green/20 p-2">
                                <MapPin className="size-5 text-green-darken" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray">
                                    Address
                                </p>
                                <p className="truncate text-sm font-semibold text-black">
                                    {organization.address}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 rounded-xl border border-gray-light bg-white p-1">
                <button
                    onClick={() => setActiveTab('events')}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
                        activeTab === 'events'
                            ? 'bg-primary text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    <Calendar className="size-5" />
                    <span>Events ({events.length})</span>
                </button>
                {canManageMembers && (
                    <button
                        onClick={() => setActiveTab('members')}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
                            activeTab === 'members'
                                ? 'bg-secondary/20 text-black shadow-md'
                                : 'text-gray hover:bg-gray-light/30 hover:text-black',
                        )}
                    >
                        <Users className="size-5" />
                        <span>Members ({members.length})</span>
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('settings')}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
                        activeTab === 'settings'
                            ? 'bg-gray/20 text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    <Settings className="size-5" />
                    <span>Settings</span>
                </button>
            </div>

            {/* Content */}
            {activeTab === 'events' && (
                <div className="space-y-4">
                    {/* Create Event Button */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-primary/5 p-6 font-semibold text-black transition-all hover:bg-primary/10 hover:shadow-md"
                    >
                        <Plus className="size-6" />
                        <span className="text-lg">Create New Event</span>
                    </button>

                    {/* Events List */}
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-light bg-gray-light/10 py-20">
                            <Calendar className="mb-4 size-16 text-gray-light" />
                            <p className="text-xl font-semibold text-gray">
                                No events yet
                            </p>
                            <p className="mt-2 text-sm text-gray">
                                Create your first event to get started
                            </p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div
                                key={event.id}
                                className="group rounded-xl border border-gray-light bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6"
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Event Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-black transition-colors group-hover:text-primary-darken md:text-2xl">
                                                {event.title}
                                            </h3>
                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-4" />
                                                    {event.startDate}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="size-4" />
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 flex-col gap-2 md:flex-row">
                                            <Link
                                                to="/organizer/$orgId/event/$eventId/check-in"
                                                params={{
                                                    orgId,
                                                    eventId: event.id,
                                                }}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-green px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-darken hover:shadow-md md:text-base"
                                            >
                                                <QrCode className="size-4" />
                                                <span>Check-In</span>
                                            </Link>
                                            <button
                                                className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-primary-darken hover:shadow-md md:px-6 md:py-3 md:text-base"
                                                onClick={() => {
                                                    navigate({
                                                        to: '/organizer/$orgId/event/$eventId',
                                                        params: {
                                                            orgId,
                                                            eventId: event.id,
                                                        },
                                                    });
                                                }}
                                            >
                                                Manage
                                            </button>
                                        </div>
                                    </div>

                                    {/* Event Stats */}
                                    <div className="grid grid-cols-3 gap-4 border-t border-gray-light/50 pt-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray">
                                                Tickets Sold
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-black">
                                                {event.ticketsSold}/
                                                {event.totalTickets}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray">
                                                Revenue
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-black">
                                                {event.revenue.toLocaleString()}{' '}
                                                VND
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray">
                                                Status
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-green">
                                                Active
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'members' && canManageMembers && (
                <div className="space-y-4">
                    {/* Add Member Button */}
                    <button
                        onClick={() => setIsAddMemberModalOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-secondary bg-secondary/5 p-6 font-semibold text-black transition-all hover:bg-secondary/10 hover:shadow-md"
                    >
                        <UserPlus className="size-6" />
                        <span className="text-lg">Add New Member</span>
                    </button>

                    {/* Members List */}
                    {isLoadingMembers ? (
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
                                <div
                                    key={member.userId}
                                    className="group flex items-center justify-between rounded-xl border border-gray-light bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-secondary/20">
                                                <Users className="size-6 text-secondary-darken" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-black">
                                                    {member.fullName}
                                                </h3>
                                                <p className="text-sm text-gray">
                                                    {member.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <span
                                                className={cn(
                                                    'rounded-full px-4 py-1 text-sm font-semibold',
                                                    member.role === 'OWNER'
                                                        ? 'bg-primary/20 text-primary-darken'
                                                        : member.role ===
                                                            'MANAGER'
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
                                        {member.userId !==
                                            currentUser?.userId && (
                                            <button
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            `Are you sure you want to remove ${member.fullName}?`,
                                                        )
                                                    ) {
                                                        removeMember.mutate({
                                                            path: {
                                                                orgId: Number(
                                                                    orgId,
                                                                ),
                                                                userId: member.userId,
                                                            },
                                                        });
                                                    }
                                                }}
                                                className="rounded-lg bg-red/10 p-3 text-red transition-all hover:bg-red hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                                disabled={
                                                    removeMember.isPending
                                                }
                                            >
                                                <Trash2 className="size-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Member Modal */}
                    {isAddMemberModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <div className="w-full max-w-md rounded-xl border border-gray-light bg-white p-6 shadow-xl">
                                <h2 className="mb-6 text-2xl font-bold text-black">
                                    Add New Member
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-black">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={newMemberEmail}
                                            onChange={(e) =>
                                                setNewMemberEmail(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="member@example.com"
                                            className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-secondary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-black">
                                            Role
                                        </label>
                                        <select
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
                                            <option value="MANAGER">
                                                Manager
                                            </option>
                                            <option value="OWNER">Owner</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setIsAddMemberModalOpen(false);
                                                setNewMemberEmail('');
                                                setNewMemberRole('STAFF');
                                            }}
                                            className="flex-1 rounded-lg border-2 border-gray-light px-6 py-3 font-semibold text-black transition-all hover:bg-gray-light/30"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (!newMemberEmail.trim()) {
                                                    toast.error(
                                                        'Please enter an email address',
                                                    );
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
                                            }}
                                            disabled={addMember.isPending}
                                            className="flex-1 rounded-lg bg-secondary px-6 py-3 font-semibold text-white transition-all hover:bg-secondary-darken hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {addMember.isPending
                                                ? 'Adding...'
                                                : 'Add Member'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="rounded-xl border border-gray-light bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-bold text-black">
                        Organization Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Organization Name
                            </label>
                            <input
                                type="text"
                                defaultValue={organization.name}
                                className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Description
                            </label>
                            <textarea
                                defaultValue={organization.description}
                                rows={3}
                                className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-black">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    defaultValue={organization.email}
                                    className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-black">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    defaultValue={organization.phoneNumber}
                                    className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Address
                            </label>
                            <input
                                type="text"
                                defaultValue={organization.address}
                                className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                            />
                        </div>
                        <button className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary-darken hover:shadow-md md:w-auto">
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                orgId={orgId}
            />
        </div>
    );
}

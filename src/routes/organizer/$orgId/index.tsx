import { useMe } from '@/hooks/use-me';
import { cn } from '@/lib/utils';
import {
    getDashboardOptions,
    getEventsByOrganizationOptions,
    getMembersOptions,
    getMyOrganizationsOptions,
} from '@/services/client/@tanstack/react-query.gen';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Calendar, Settings, Users } from 'lucide-react';
import { useState } from 'react';

import {
    AddMemberModal,
    CreateEventModal,
    DashboardStats,
    EventsTab,
    MembersTab,
    OrganizationHeader,
    OrganizationInfoCards,
    OrganizationSettings,
    RemoveMemberModal,
} from './-components';

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
    const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] =
        useState(false);
    const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
    const navigate = useNavigate();

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
                <OrganizationHeader
                    organization={{
                        logoUrl: organization.logoUrl,
                        name: organization.name,
                        description: organization.description,
                    }}
                />

                {/* Dashboard Stats Cards */}
                {dashboardData && <DashboardStats stats={dashboardData} />}

                {/* Organization Info Cards */}
                <OrganizationInfoCards
                    organization={{
                        email: organization.email,
                        phoneNumber: organization.phoneNumber,
                        address: organization.address,
                    }}
                />
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 rounded-xl border border-gray-light bg-white p-1">
                <button
                    onClick={() => setActiveTab('events')}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 font-semibold transition-all duration-200 md:px-6',
                        activeTab === 'events'
                            ? 'bg-primary text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    <Calendar className="size-5" />
                    <span className="hidden sm:inline">
                        Events ({events.length})
                    </span>
                    <span className="sm:hidden">{events.length}</span>
                </button>
                {canManageMembers && (
                    <button
                        onClick={() => setActiveTab('members')}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 font-semibold transition-all duration-200 md:px-6',
                            activeTab === 'members'
                                ? 'bg-secondary/20 text-black shadow-md'
                                : 'text-gray hover:bg-gray-light/30 hover:text-black',
                        )}
                    >
                        <Users className="size-5" />
                        <span className="hidden sm:inline">
                            Members ({members.length})
                        </span>
                        <span className="sm:hidden">{members.length}</span>
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('settings')}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 font-semibold transition-all duration-200 md:px-6',
                        activeTab === 'settings'
                            ? 'bg-gray/20 text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    <Settings className="size-5" />
                    <span className="hidden sm:inline">Settings</span>
                </button>
            </div>

            {/* Content */}
            {activeTab === 'events' && (
                <EventsTab
                    events={events}
                    orgId={orgId}
                    onCreateEvent={() => setIsCreateModalOpen(true)}
                    onManageEvent={(eventId) => {
                        navigate({
                            to: '/organizer/$orgId/event/$eventId',
                            params: {
                                orgId,
                                eventId,
                            },
                        });
                    }}
                />
            )}

            {activeTab === 'members' && canManageMembers && (
                <>
                    <MembersTab
                        members={members}
                        currentUserId={currentUser?.userId}
                        isLoading={isLoadingMembers}
                        onAddMember={() => setIsAddMemberModalOpen(true)}
                        onRemoveMember={(member) => {
                            setMemberToRemove(member);
                            setIsRemoveMemberModalOpen(true);
                        }}
                    />

                    {/* Add Member Modal */}
                    <AddMemberModal
                        isOpen={isAddMemberModalOpen}
                        onClose={() => setIsAddMemberModalOpen(false)}
                        orgId={orgId}
                    />

                    {/* Remove Member Modal */}
                    <RemoveMemberModal
                        isOpen={isRemoveMemberModalOpen}
                        onClose={() => {
                            setIsRemoveMemberModalOpen(false);
                            setMemberToRemove(null);
                        }}
                        member={memberToRemove}
                        orgId={orgId}
                    />
                </>
            )}

            {activeTab === 'settings' && (
                <OrganizationSettings
                    organization={organization}
                    orgId={orgId}
                />
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

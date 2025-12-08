import { cn } from '@/lib/utils';
import { CreateEventModal } from '@/routes/organizer/$orgId/-components';
import { getEventByIdOptions } from '@/services/client/@tanstack/react-query.gen';
import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Edit,
    MapPin,
    Plus,
    Ticket,
    Users,
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/organizer/$orgId/event/$eventId/')({
    component: RouteComponent,
});

type TabType = 'overview' | 'tickets' | 'attendees';

// Types based on actual API response
interface TicketTypeData {
    id: number;
    type: string;
    price: number;
    totalQuantity: number;
    remainingQuantity: number;
    status: string | null;
}

interface EventApiData {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    organizationId: number;
    organizationName: string;
    ticketTypes: TicketTypeData[];
}

// Transformed ticket type for UI
interface TransformedTicketType {
    id: string;
    name: string;
    price: number;
    totalQuantity: number;
    soldQuantity: number;
    remainingQuantity: number;
    status: string;
}

function RouteComponent() {
    const { orgId, eventId } = Route.useParams();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fetch event details by ID
    const { data: eventResponse, isLoading: isLoadingEvent } = useQuery({
        ...getEventByIdOptions({
            path: { eventId: Number(eventId) },
        }),
        staleTime: 5 * 60 * 1000,
    });

    // Extract event data from API response
    const apiEvent = eventResponse?.data as EventApiData | undefined;

    // Transform API data to component format
    const event = apiEvent
        ? (() => {
              // Calculate stats from ticket types
              const totalTickets = apiEvent.ticketTypes.reduce(
                  (sum, tt) => sum + tt.totalQuantity,
                  0,
              );
              const soldTickets = apiEvent.ticketTypes.reduce(
                  (sum, tt) => sum + (tt.totalQuantity - tt.remainingQuantity),
                  0,
              );
              const revenue = apiEvent.ticketTypes.reduce(
                  (sum, tt) =>
                      sum +
                      tt.price * (tt.totalQuantity - tt.remainingQuantity),
                  0,
              );

              return {
                  id: String(apiEvent.id),
                  title: apiEvent.title ?? 'Untitled Event',
                  description:
                      apiEvent.description ?? 'No description available',
                  startDate: apiEvent.startDate ?? '',
                  endDate: apiEvent.endDate ?? '',
                  location: apiEvent.location ?? 'TBA',
                  bannerUrl: '',
                  ticketTypes: apiEvent.ticketTypes.map((tt) => ({
                      id: String(tt.id),
                      name: tt.type ?? 'Standard',
                      price: tt.price ?? 0,
                      totalQuantity: tt.totalQuantity ?? 0,
                      soldQuantity: tt.totalQuantity - tt.remainingQuantity,
                      remainingQuantity: tt.remainingQuantity ?? 0,
                      status: tt.status?.toLowerCase() ?? 'active',
                  })),
                  stats: {
                      totalTickets,
                      soldTickets,
                      revenue,
                      checkedIn: 0, // This would need to come from a separate API endpoint
                  },
              };
          })()
        : {
              id: eventId,
              title: 'Loading...',
              description: '',
              startDate: '',
              endDate: '',
              location: '',
              bannerUrl: '',
              ticketTypes: [],
              stats: {
                  totalTickets: 0,
                  soldTickets: 0,
                  revenue: 0,
                  checkedIn: 0,
              },
          };

    if (isLoadingEvent) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-gray-light border-t-primary"></div>
                    <p className="text-lg font-semibold text-gray">
                        Loading event...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col px-5 py-5 md:px-10 md:py-10">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <Link
                    to="/organizer/$orgId"
                    params={{ orgId }}
                    className="flex items-center gap-2 text-black transition-colors hover:text-primary-darken"
                >
                    <ArrowLeft className="size-6" />
                    <span className="text-lg font-semibold">
                        Back to Dashboard
                    </span>
                </Link>
                <Link
                    to="/organizer/$orgId/event/$eventId/check-in"
                    params={{ orgId, eventId }}
                    className="flex items-center gap-2 rounded-lg bg-green px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-green-darken hover:shadow-lg active:scale-95"
                >
                    <Ticket className="size-5" />
                    <span>Check-In</span>
                </Link>
            </div>

            {/* Event Header */}
            <div className="mb-8 rounded-2xl border-2 border-black bg-white p-6 shadow-lg md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-black md:text-4xl">
                            {event.title}
                        </h1>
                        <p className="mt-3 text-base text-gray md:text-lg">
                            {event.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-gray">
                            <span className="flex items-center gap-2">
                                <Calendar className="size-5" />
                                {event.startDate} - {event.endDate}
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin className="size-5" />
                                {event.location}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary-darken hover:shadow-md"
                    >
                        <Edit className="size-5" />
                        <span>Edit Event</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-light pt-6 md:grid-cols-4">
                    <div className="rounded-lg bg-primary/10 p-4">
                        <div className="flex items-center gap-2 text-primary-darken">
                            <Ticket className="size-5" />
                            <p className="text-sm font-medium">Tickets Sold</p>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-black">
                            {event.stats.soldTickets}/{event.stats.totalTickets}
                        </p>
                    </div>
                    <div className="rounded-lg bg-green/10 p-4">
                        <div className="flex items-center gap-2 text-green-darken">
                            <DollarSign className="size-5" />
                            <p className="text-sm font-medium">Revenue</p>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-black">
                            {event.stats.revenue.toLocaleString()} VND
                        </p>
                    </div>
                    <div className="rounded-lg bg-secondary/10 p-4">
                        <div className="flex items-center gap-2 text-secondary-darken">
                            <Users className="size-5" />
                            <p className="text-sm font-medium">Checked In</p>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-black">
                            {event.stats.checkedIn}
                        </p>
                    </div>
                    <div className="rounded-lg bg-blue/10 p-4">
                        <div className="flex items-center gap-2 text-blue">
                            <Calendar className="size-5" />
                            <p className="text-sm font-medium">Status</p>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-green">
                            Active
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 rounded-xl border border-gray-light bg-white p-1">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
                        activeTab === 'overview'
                            ? 'bg-primary text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    <Calendar className="size-5" />
                    <span className="hidden sm:inline">Overview</span>
                </button>
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
                        activeTab === 'tickets'
                            ? 'bg-primary text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    <Ticket className="size-5" />
                    <span className="hidden sm:inline">
                        Tickets ({event.ticketTypes.length})
                    </span>
                    <span className="sm:hidden">Tickets</span>
                </button>
                <button
                    onClick={() => setActiveTab('attendees')}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
                        activeTab === 'attendees'
                            ? 'bg-primary text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    <Users className="size-5" />
                    <span className="hidden sm:inline">Attendees</span>
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="rounded-xl border border-gray-light bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-2xl font-bold text-black">
                        Event Overview
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray">
                                Description
                            </label>
                            <p className="mt-1 text-base text-black">
                                {event.description}
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-semibold text-gray">
                                    Start Date
                                </label>
                                <p className="mt-1 text-base font-medium text-black">
                                    {event.startDate}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray">
                                    End Date
                                </label>
                                <p className="mt-1 text-base font-medium text-black">
                                    {event.endDate}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray">
                                Location
                            </label>
                            <p className="mt-1 text-base font-medium text-black">
                                {event.location}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'tickets' && (
                <div className="space-y-4">
                    {/* Add Ticket Type Button */}
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-primary/5 p-6 font-semibold text-black transition-all hover:bg-primary/10 hover:shadow-md">
                        <Plus className="size-6" />
                        <span className="text-lg">Add Ticket Type</span>
                    </button>

                    {/* Ticket Types List */}
                    {event.ticketTypes.map(
                        (ticketType: TransformedTicketType) => (
                            <div
                                key={ticketType.id}
                                className="rounded-xl border border-gray-light bg-white p-6 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-black">
                                            {ticketType.name}
                                        </h3>
                                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                                            <span className="font-medium text-gray">
                                                Price:{' '}
                                                <span className="font-bold text-black">
                                                    {ticketType.price.toLocaleString()}{' '}
                                                    VND
                                                </span>
                                            </span>
                                            <span className="font-medium text-gray">
                                                Sold:{' '}
                                                <span className="font-bold text-black">
                                                    {ticketType.soldQuantity}/
                                                    {ticketType.totalQuantity}
                                                </span>
                                            </span>
                                            <span className="font-medium text-gray">
                                                Available:{' '}
                                                <span className="font-bold text-green">
                                                    {
                                                        ticketType.remainingQuantity
                                                    }
                                                </span>
                                            </span>
                                            <span
                                                className={cn(
                                                    'rounded-full px-3 py-1 text-xs font-bold',
                                                    ticketType.status ===
                                                        'available' ||
                                                        ticketType.status ===
                                                            'active'
                                                        ? 'bg-green/20 text-green'
                                                        : ticketType.status ===
                                                            'sold_out'
                                                          ? 'bg-red/20 text-red'
                                                          : 'bg-gray/20 text-gray',
                                                )}
                                            >
                                                {ticketType.status
                                                    ? ticketType.status
                                                          .toUpperCase()
                                                          .replace('_', ' ')
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary-darken hover:shadow-md">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            )}

            {activeTab === 'attendees' && (
                <div className="rounded-xl border border-gray-light bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-2xl font-bold text-black">
                        Attendees List
                    </h2>
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Users className="mb-4 size-16 text-gray-light" />
                        <p className="text-xl font-semibold text-gray">
                            Attendees feature coming soon
                        </p>
                        <p className="mt-2 text-sm text-gray">
                            View and manage event attendees
                        </p>
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}
            <CreateEventModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                orgId={orgId}
                eventToEdit={{
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    location: event.location,
                }}
            />
        </div>
    );
}

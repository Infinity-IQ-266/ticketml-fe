import { Calendar, Plus } from 'lucide-react';

import { EventCard } from './-components';

interface Event {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    ticketsSold: number;
    totalTickets: number;
    revenue: number;
    status: string;
}

interface EventsTabProps {
    events: Event[];
    orgId: string;
    onCreateEvent: () => void;
    onManageEvent: (eventId: string) => void;
}

export const EventsTab = ({
    events,
    orgId,
    onCreateEvent,
    onManageEvent,
}: EventsTabProps) => {
    return (
        <div className="space-y-4">
            {/* Create Event Button */}
            <button
                onClick={onCreateEvent}
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
                    <EventCard
                        key={event.id}
                        event={event}
                        orgId={orgId}
                        onManage={onManageEvent}
                    />
                ))
            )}
        </div>
    );
};

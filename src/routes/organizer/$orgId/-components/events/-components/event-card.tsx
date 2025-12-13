import { Link } from '@tanstack/react-router';
import { Calendar, MapPin, QrCode } from 'lucide-react';

interface EventCardProps {
    event: {
        id: string;
        title: string;
        startDate: string;
        endDate: string;
        location: string;
        ticketsSold: number;
        totalTickets: number;
        revenue: number;
        status: string;
    };
    orgId: string;
    onManage: (eventId: string) => void;
}

export const EventCard = ({ event, orgId, onManage }: EventCardProps) => {
    return (
        <div className="group rounded-xl border border-gray-light bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6">
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
                            onClick={() => onManage(event.id)}
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
                            {event.ticketsSold}/{event.totalTickets}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray">Revenue</p>
                        <p className="mt-1 text-lg font-bold text-black">
                            {event.revenue.toLocaleString()} VND
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray">Status</p>
                        <p className="mt-1 text-lg font-bold text-green">
                            Active
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

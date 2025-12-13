import { cn } from '@/lib/utils';
import { getTicketsOptions } from '@/services/client/@tanstack/react-query.gen';
import type { Ticket } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, CheckCircle2, Ticket as TicketIcon } from 'lucide-react';
import { useState } from 'react';

import { TicketQRModal } from './-components/ticket-qr-modal';

export const Route = createFileRoute('/my-tickets/')({
    component: RouteComponent,
});

type TabType = 'available' | 'used';

function RouteComponent() {
    const [activeTab, setActiveTab] = useState<TabType>('available');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const { data: response, isLoading } = useQuery({
        ...getTicketsOptions(),
    });

    const handleViewQR = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsQRModalOpen(true);
    };

    const tickets = (response?.data as Ticket[]) ?? [];
    const availableTickets = tickets.filter(
        (ticket) => ticket.checkedIn === false,
    );
    const usedTickets = tickets.filter((ticket) => ticket.checkedIn === true);

    const displayTickets =
        activeTab === 'available' ? availableTickets : usedTickets;

    return (
        <div className="flex w-full flex-col px-5 py-5 md:px-10 md:py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black md:text-4xl xl:text-5xl">
                    My Tickets
                </h1>
                <p className="mt-2 text-lg text-gray">
                    Manage and view all your event tickets
                </p>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-light bg-gradient-to-br from-primary/20 to-primary/5 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary p-3">
                            <TicketIcon className="size-6 text-black" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray">
                                Available Tickets
                            </p>
                            <p className="text-3xl font-bold text-black">
                                {availableTickets.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-light bg-gradient-to-br from-gray/10 to-gray/5 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray/20 p-3">
                            <CheckCircle2 className="size-6 text-gray" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray">
                                Used Tickets
                            </p>
                            <p className="text-3xl font-bold text-black">
                                {usedTickets.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 rounded-xl border border-gray-light bg-white p-1">
                <button
                    onClick={() => setActiveTab('available')}
                    className={cn(
                        'flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
                        activeTab === 'available'
                            ? 'bg-primary text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    Available ({availableTickets.length})
                </button>
                <button
                    onClick={() => setActiveTab('used')}
                    className={cn(
                        'flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
                        activeTab === 'used'
                            ? 'bg-gray/20 text-black shadow-md'
                            : 'text-gray hover:bg-gray-light/30 hover:text-black',
                    )}
                >
                    Used ({usedTickets.length})
                </button>
            </div>

            {/* Tickets Grid */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : displayTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-light bg-gray-light/10 py-20">
                        <TicketIcon className="mb-4 size-16 text-gray-light" />
                        <p className="text-xl font-semibold text-gray">
                            No {activeTab} tickets found
                        </p>
                        <p className="mt-2 text-sm text-gray">
                            {activeTab === 'available'
                                ? 'Purchase tickets to see them here'
                                : 'Used tickets will appear here after check-in'}
                        </p>
                    </div>
                ) : (
                    displayTickets.map((ticket, index) => (
                        <div
                            key={ticket.id || index}
                            className={cn(
                                'group rounded-xl border border-gray-light bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6',
                                activeTab === 'used' && 'opacity-75',
                            )}
                        >
                            <div className="flex flex-col gap-3">
                                {/* Top section - Event info */}
                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            'rounded-lg p-2',
                                            activeTab === 'available'
                                                ? 'bg-primary/20'
                                                : 'bg-gray/10',
                                        )}
                                    >
                                        <TicketIcon
                                            className={cn(
                                                'size-5',
                                                activeTab === 'available'
                                                    ? 'text-primary-darken'
                                                    : 'text-gray',
                                            )}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-bold text-black transition-colors group-hover:text-primary-darken md:text-xl">
                                            {ticket.eventName}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-1 text-sm text-gray">
                                            <Calendar className="size-4 flex-shrink-0" />
                                            <span className="truncate">
                                                {ticket.eventStartDate}
                                            </span>
                                        </div>
                                    </div>
                                    {activeTab === 'used' && (
                                        <div className="flex-shrink-0 rounded-lg bg-green/10 p-2">
                                            <CheckCircle2 className="size-5 text-green" />
                                        </div>
                                    )}
                                </div>

                                {/* Bottom section - Ticket type and action button */}
                                <div className="flex items-center justify-between gap-3 border-t border-gray-light/50 pt-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-gray md:text-sm">
                                            Ticket Type
                                        </p>
                                        <p className="truncate text-base font-bold text-black md:text-lg">
                                            {ticket.ticketTypeName}
                                        </p>
                                    </div>
                                    {activeTab === 'available' && (
                                        <button
                                            onClick={() => handleViewQR(ticket)}
                                            className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-primary-darken hover:shadow-md md:px-6 md:py-3 md:text-base"
                                        >
                                            View QR
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* QR Modal */}
            <TicketQRModal
                ticket={selectedTicket}
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
            />
        </div>
    );
}

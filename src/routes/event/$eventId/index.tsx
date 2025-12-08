import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getEventByIdOptions } from '@/services/client/@tanstack/react-query.gen';
import type { Event } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, DollarSign, Info, MapPin, Ticket } from 'lucide-react';

import { BuyTicketModal } from './-components';

export const Route = createFileRoute('/event/$eventId/')({
    component: RouteComponent,
});

function RouteComponent() {
    const { eventId } = Route.useParams();

    const { data: response } = useQuery({
        ...getEventByIdOptions({
            path: {
                eventId: eventId as unknown as number,
            },
        }),
        staleTime: 5 * 60 * 1000,
    });

    const event = (response?.data as Event | null) ?? null;

    if (!event) {
        return (
            <div className="flex min-h-screen items-center justify-center">
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
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-light/20 pb-16">
            {/* Hero Section with Image */}
            <div className="relative h-[400px] md:h-[500px]">
                <img
                    src={event.imageUrl ?? '/images/emxinhsayhi.png'}
                    alt={event.title}
                    className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                {/* Event Header Card - Overlapping Hero */}
                <div className="relative z-10 -mt-32 mb-8">
                    <div className="rounded-2xl border border-gray-light bg-white p-6 shadow-2xl md:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            {/* Left: Event Info */}
                            <div className="flex-1">
                                <h1 className="mb-4 text-3xl font-bold text-black md:text-5xl">
                                    {event.title}
                                </h1>

                                {/* Event Details Grid */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
                                        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                            <Calendar className="size-6 text-black" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray uppercase">
                                                Date
                                            </p>
                                            <p className="font-bold text-black">
                                                {event.startDate
                                                    ? new Date(
                                                          event.startDate,
                                                      ).toLocaleDateString(
                                                          'en-US',
                                                          {
                                                              weekday: 'short',
                                                              year: 'numeric',
                                                              month: 'short',
                                                              day: 'numeric',
                                                          },
                                                      )
                                                    : 'TBA'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg bg-secondary/10 p-4">
                                        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                                            <MapPin className="size-6 text-black" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray uppercase">
                                                Location
                                            </p>
                                            <p className="font-bold text-black">
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg bg-green/10 p-4">
                                        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-green">
                                            <DollarSign className="size-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray uppercase">
                                                Starting Price
                                            </p>
                                            <p className="text-xl font-bold text-green-darken">
                                                {event.ticketTypes[0]?.price.toLocaleString()}{' '}
                                                đ
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg bg-blue/10 p-4">
                                        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-blue">
                                            <Ticket className="size-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray uppercase">
                                                Ticket Types
                                            </p>
                                            <p className="font-bold text-black">
                                                {event.ticketTypes.length}{' '}
                                                Available
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Buy Ticket Card */}
                            <div className="w-full lg:w-80">
                                <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
                                    <h3 className="mb-4 text-center text-xl font-bold text-black">
                                        Get Your Tickets
                                    </h3>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="w-full rounded-xl bg-primary px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 hover:bg-primary-darken hover:shadow-lg">
                                                Buy Tickets Now
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                                            <BuyTicketModal
                                                ticketTypes={event.ticketTypes}
                                                eventId={eventId}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mb-8 rounded-2xl border border-gray-light bg-white p-6 shadow-md md:p-10">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary">
                            <Info className="size-5 text-black" />
                        </div>
                        <h2 className="text-2xl font-bold text-black md:text-3xl">
                            About This Event
                        </h2>
                    </div>
                    {event.description ? (
                        <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray">
                            {event.description}
                        </p>
                    ) : (
                        <p className="text-lg text-gray italic">
                            No description available for this event.
                        </p>
                    )}
                </div>

                {/* Ticket Types Section */}
                <div className="rounded-2xl border border-gray-light bg-white p-6 shadow-md md:p-10">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                            <Ticket className="size-5 text-black" />
                        </div>
                        <h2 className="text-2xl font-bold text-black md:text-3xl">
                            Ticket Options
                        </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {event.ticketTypes.map((ticketType) => (
                            <div
                                key={ticketType.id}
                                className="group rounded-xl border-2 border-gray-light bg-gradient-to-br from-white to-gray-light/20 p-6 transition-all hover:border-primary hover:shadow-lg"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-black">
                                        {ticketType.type}
                                    </h3>
                                    <div className="rounded-full bg-primary px-3 py-1">
                                        <Ticket className="size-4 text-black" />
                                    </div>
                                </div>
                                <div className="mb-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary-darken">
                                        {ticketType.price.toLocaleString()}
                                    </span>
                                    <span className="text-lg font-semibold text-gray">
                                        đ
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray">
                                    <p>
                                        <span className="font-semibold">
                                            Available:
                                        </span>{' '}
                                        {ticketType.remainingQuantity} /{' '}
                                        {ticketType.totalQuantity}
                                    </p>
                                    {ticketType.status && (
                                        <p className="inline-flex rounded-full bg-green/20 px-3 py-1 text-xs font-semibold text-green-darken">
                                            {ticketType.status}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

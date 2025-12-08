import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { getAllEventsOptions } from '@/services/client/@tanstack/react-query.gen';
import type { Event } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ChatBotButton, ChatBotModal, EventCard } from './-components';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: response } = useQuery({
        ...getAllEventsOptions(),
        staleTime: 5 * 60 * 1000,
    });
    const events = (response?.data as Event[]) ?? [];
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 9;
    const navigate = useNavigate();

    const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

    // Auto-open chat when component mounts
    useEffect(() => {
        setIsChatOpen(true);
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(events.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const currentEvents = events.slice(startIndex, endIndex);

    // Featured events for carousel (first 5)
    const featuredEvents = events.slice(0, 5);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 600, behavior: 'smooth' });
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-light/20">
            {/* Hero Carousel */}
            <section className="relative mx-auto w-full max-w-7xl px-4 py-8 md:px-16">
                {featuredEvents.length > 0 ? (
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                        }}
                        plugins={[plugin.current]}
                        className="w-full"
                    >
                        <CarouselContent>
                            {featuredEvents.map((event) => (
                                <CarouselItem key={event.id}>
                                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                        <div className="relative h-[400px] w-full md:h-[500px]">
                                            <img
                                                src={
                                                    event.imageUrl ??
                                                    '/images/emxinhsayhi.png'
                                                }
                                                alt={event.title}
                                                className="size-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                            {/* Event Info Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-12">
                                                <div className="mx-auto max-w-4xl space-y-4">
                                                    <h2 className="line-clamp-2 text-3xl leading-tight font-bold md:text-5xl">
                                                        {event.title}
                                                    </h2>
                                                    <p className="line-clamp-2 text-base opacity-90 md:text-xl">
                                                        {event.description ||
                                                            'Join us for an amazing experience!'}
                                                    </p>
                                                    <div className="flex flex-row flex-wrap gap-3 text-sm md:gap-6 md:text-lg">
                                                        <span className="truncate rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                                                            {event.location}
                                                        </span>
                                                        <span className="rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                                                            {event.startDate
                                                                ? new Date(
                                                                      event.startDate,
                                                                  ).toLocaleDateString()
                                                                : 'TBA'}
                                                        </span>
                                                        <span className="rounded-full bg-primary px-4 py-2 font-bold text-black">
                                                            From{' '}
                                                            {event.ticketTypes[0]?.price.toLocaleString()}{' '}
                                                            đ
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            navigate({
                                                                to: '/event/$eventId',
                                                                params: {
                                                                    eventId:
                                                                        event.id.toString(),
                                                                },
                                                            })
                                                        }
                                                        className="mt-4 rounded-full bg-primary px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:bg-primary-darken hover:shadow-xl md:px-10 md:py-4 md:text-lg"
                                                    >
                                                        View Event Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 size-12 border-2 border-white/20 bg-white/90 text-black shadow-xl transition-all hover:scale-110 hover:bg-white md:left-6" />
                        <CarouselNext className="right-4 size-12 border-2 border-white/20 bg-white/90 text-black shadow-xl transition-all hover:scale-110 hover:bg-white md:right-6" />
                    </Carousel>
                ) : (
                    <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gray-light/20">
                        <p className="text-xl text-gray">No events available</p>
                    </div>
                )}
            </section>

            {/* All Events Section */}
            <section className="mx-auto w-full max-w-7xl px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-black">
                        All Events
                    </h2>
                    <div className="text-sm text-gray">
                        Showing {startIndex + 1}-
                        {Math.min(endIndex, events.length)} of {events.length}{' '}
                        events
                    </div>
                </div>

                {currentEvents.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {currentEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    id={event.id}
                                    image={
                                        event.imageUrl ??
                                        '/images/emxinhsayhi.png'
                                    }
                                    title={event.title}
                                    date={
                                        event.startDate
                                            ? new Date(
                                                  event.startDate,
                                              ).toLocaleDateString()
                                            : 'TBA'
                                    }
                                    location={event.location}
                                    price={`From: ${event.ticketTypes[0]?.price.toLocaleString()} đ`}
                                    tags={['Event']}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex size-10 items-center justify-center rounded-lg border-2 border-gray-light bg-white text-black transition-all hover:bg-gray-light disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`flex size-10 items-center justify-center rounded-lg border-2 font-semibold transition-all ${
                                            currentPage === page
                                                ? 'border-primary bg-primary text-black'
                                                : 'border-gray-light bg-white text-black hover:bg-gray-light'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex size-10 items-center justify-center rounded-lg border-2 border-gray-light bg-white text-black transition-all hover:bg-gray-light disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-light bg-gray-light/10">
                        <p className="text-xl text-gray">No events available</p>
                    </div>
                )}
            </section>

            {/* Chatbot Components */}
            {!isChatOpen && (
                <ChatBotButton onClick={() => setIsChatOpen(true)} />
            )}
            <ChatBotModal open={isChatOpen} onOpenChange={setIsChatOpen} />
        </div>
    );
}

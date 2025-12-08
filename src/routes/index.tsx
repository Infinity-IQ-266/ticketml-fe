import { getAllEventsOptions } from '@/services/client/@tanstack/react-query.gen';
import type { Event } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const [isChatOpen, setIsChatOpen] = useState(true); // Auto-open on page load

    // Auto-open chat when component mounts
    useEffect(() => {
        setIsChatOpen(true);
    }, []);

    return (
        <div className="flex flex-col items-center px-10">
            <div className="relative flex w-5/6 flex-row items-center justify-center gap-18 py-5">
                <div className="justify-center">
                    <ArrowLeft className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-black p-3 transition duration-200 hover:cursor-pointer hover:bg-black/10" />
                </div>

                <div className="relative w-full">
                    <img
                        src="/images/emxinhsayhi.png"
                        alt="emxinhsaybye"
                        className="h-auto w-full rounded-lg object-cover"
                    />
                    <button className="text-purple-800 hover:bg-purple-300 absolute right-4 bottom-4 rounded-full border-0 bg-white px-6 py-2.5 font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
                        View Event
                    </button>
                </div>

                <div className="justify-center">
                    <ArrowRight className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-black p-3 transition duration-200 hover:cursor-pointer hover:bg-black/10" />
                </div>
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Special Events Section */}
                <section className="mb-12">
                    <h2 className="mb-6 text-2xl font-bold">Special events</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <EventCard
                                id={event.id}
                                image="/images/emxinhsayhi.png"
                                title={event.title}
                                date={event.startDate?.toLocaleString() ?? ''}
                                location={event.location}
                                price={
                                    'From: ' + event.ticketTypes[0].price + ' đ'
                                }
                                tags={['Concert', 'Theater']}
                                time="19:00 - 23:00"
                            />
                        ))}
                    </div>
                </section>

                {/* Theaters & Arts Section */}
                <section>
                    <h2 className="mb-6 text-2xl font-bold">Theaters & arts</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <EventCard
                                id={event.id}
                                image="/images/emxinhsayhi.png"
                                title={event.title}
                                date={event.startDate?.toLocaleString() ?? ''}
                                location={event.location}
                                price={
                                    'From: ' + event.ticketTypes[0].price + ' đ'
                                }
                                tags={['Concert', 'Theater']}
                                time="19:00 - 23:00"
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* Chatbot Components */}
            {!isChatOpen && (
                <ChatBotButton onClick={() => setIsChatOpen(true)} />
            )}
            <ChatBotModal open={isChatOpen} onOpenChange={setIsChatOpen} />
        </div>
    );
}

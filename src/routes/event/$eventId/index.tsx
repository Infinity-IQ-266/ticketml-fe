import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getEventByIdOptions } from '@/services/client/@tanstack/react-query.gen';
import type { Event } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, ChevronsDown, DollarSign, MapPin } from 'lucide-react';
import { useRef } from 'react';

import { BuyTicketModal } from './-components';

export const Route = createFileRoute('/event/$eventId/')({
    component: RouteComponent,
});

function RouteComponent() {
    const { eventId } = Route.useParams();
    const ticketInfoElement = useRef<HTMLDivElement>(null);

    const { data: response } = useQuery({
        ...getEventByIdOptions({
            path: {
                eventId: eventId as unknown as number,
            },
        }),
        staleTime: 5 * 60 * 1000,
    });

    const event = (response?.data as Event | null) ?? null;
    return (
        <div className="flex w-full flex-col px-10">
            <div className="my-10 flex flex-row justify-center rounded-xl">
                <div className="flex max-w-1/3 flex-col rounded-l-xl border border-r-0 border-black bg-gray-light p-6">
                    <div className="w-full rounded-xl border border-black bg-primary p-4">
                        <p className="text-xl font-bold text-wrap">
                            {event?.title}
                        </p>
                    </div>

                    <div className="grid grid-flow-col grid-rows-3 gap-4 py-10">
                        <Calendar className="text-black" />
                        <MapPin className="text-black" />
                        <DollarSign className="text-black" />
                        <p className="text-nowrap">
                            {event?.startDate?.toLocaleString()}
                        </p>
                        <p className="">{event?.location}</p>
                        <p className="text-nowrap">
                            {event?.ticketTypes[0].price} VND
                        </p>
                    </div>

                    <div className="mt-auto flex flex-col items-center">
                        <hr className="w-full bg-black" />
                        <Dialog>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="mt-10 mb-5 max-w-11/12 rounded-xl border-2 border-black bg-primary px-20 py-2 drop-shadow-lg hover:cursor-pointer hover:bg-primary-darken"
                                >
                                    <p className="text-lg font-bold">
                                        Buy ticket now
                                    </p>
                                </button>
                            </DialogTrigger>
                            {event?.ticketTypes && (
                                <DialogContent className="max-h-11/12 overflow-y-auto">
                                    <BuyTicketModal
                                        ticketTypes={event?.ticketTypes}
                                        eventId={eventId}
                                    />
                                </DialogContent>
                            )}
                        </Dialog>
                    </div>
                </div>
                <img
                    src={event?.imageUrl ?? '/images/ntpmm.png'}
                    className="ms-8 w-2/3 rounded-r-xl border border-r-0 border-black"
                />
            </div>
            <button
                className="group inline-flex w-full justify-center"
                onClick={() => {
                    if (ticketInfoElement.current)
                        ticketInfoElement.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                }}
            >
                <ChevronsDown className="size-10 text-black group-hover:cursor-pointer group-hover:text-gray" />
            </button>
            <div className="my-10 flex flex-col rounded-xl border border-black">
                <p className="m-4 text-xl font-bold">Overview:</p>
                <hr className="w-full bg-black" />
                <div className="flex flex-col gap-y-2 rounded-b-xl bg-gray-light px-3 py-4">
                    <p className="font-bold uppercase">{event?.title}</p>
                    <p>{event?.description}</p>
                    <p className="font-bold uppercase">Event Info</p>
                    <p>
                        <span className="font-semibold">Time:</span>{' '}
                        {event?.startDate?.toLocaleString()}
                    </p>
                    <p>
                        <span className="font-semibold">Location:</span>{' '}
                        {event?.location}
                    </p>
                </div>
            </div>

            <div
                className="mb-10 flex flex-col rounded-xl bg-black"
                ref={ticketInfoElement}
            >
                <p className="m-4 text-xl font-bold text-white">Ticket Info:</p>
                {event?.ticketTypes.map((ticketType, index) => (
                    <div
                        className={cn(
                            'bg-opacity-70 flex flex-row items-center px-5 py-4',
                            index % 2 == 0 ? 'bg-[#5f6366]' : 'bg-black',
                        )}
                    >
                        <p className="text-white">{ticketType.type}</p>
                        <p className="ms-auto rounded-lg bg-secondary p-2 font-semibold drop-shadow-sm duration-200">
                            {ticketType.price?.toLocaleString('de-DE')} VND
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { getEventByIdOptions } from '@/services/client/@tanstack/react-query.gen';
import type { Event } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Calendar, ChevronsDown, DollarSign, MapPin } from 'lucide-react';

export const Route = createFileRoute('/event/$eventId/')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { eventId } = Route.useParams();

    const { data: response } = useQuery({
        ...getEventByIdOptions({
            path: {
                eventId: eventId as unknown as number,
            },
        }),
        staleTime: 5 * 60 * 1000,
    });

    const event = (response?.data as Event) ?? null;
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
                        <button
                            className="mt-10 mb-5 max-w-11/12 rounded-xl border-2 border-black bg-primary px-20 py-2 drop-shadow-lg hover:cursor-pointer hover:bg-primary-darken"
                            onClick={() =>
                                navigate({
                                    to: '/event/$eventId/payment',
                                    params: { eventId },
                                })
                            }
                        >
                            <p className="text-lg font-bold">Buy ticket now</p>
                        </button>
                    </div>
                </div>
                <img
                    src="/images/ntpmm.png"
                    className="ms-8 w-2/3 rounded-r-xl border border-r-0 border-black"
                />
            </div>
            <button className="group inline-flex w-full justify-center">
                <ChevronsDown className="size-10 text-black group-hover:cursor-pointer group-hover:text-gray" />
            </button>
        </div>
    );
}

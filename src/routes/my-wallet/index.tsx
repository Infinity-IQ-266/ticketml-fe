import { useMe } from '@/hooks';
import { cn } from '@/lib/utils';
import { getTicketsOptions } from '@/services/client/@tanstack/react-query.gen';
import type { Ticket } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronsDown, RefreshCcw, SquareArrowOutUpRight } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/my-wallet/')({
    component: RouteComponent,
});

function RouteComponent() {
    const [url, setUrl] = useState('');
    const [isShowingAvailableTickets, setIsShowingAvailableTickets] =
        useState(false);
    const [isShowingUsedTickets, setIsShowingUsedTickets] = useState(false);

    const { data: response } = useQuery({
        ...getTicketsOptions(),
        staleTime: 5 * 60 * 1000,
    });

    const tickets = (response?.data as Ticket[]) ?? [];
    const availableTickets = tickets.filter(
        (ticket) => ticket.checkedIn === false,
    );
    const usedTickets = tickets.filter((ticket) => ticket.checkedIn === true);

    const { data: meData } = useMe();

    useEffect(() => {
        console.log(response?.data);
        QRCode.toDataURL('https://ticketml.vercel.app', { width: 200 })
            .then(setUrl)
            .catch(console.error);
    }, []);
    return (
        <div className="flex w-full flex-col px-5 py-5 md:flex-row md:px-10 md:py-10">
            <div className="md:w-3/4">
                <p className="text-2xl font-bold">My Wallet</p>
                <div className="my-5 flex w-full flex-col rounded-xl border-2 border-black p-5 md:mb-0 md:flex-row">
                    <div className="flex aspect-square items-center justify-center rounded-xl bg-secondary/30 p-3 drop-shadow-2xl md:min-w-1/2">
                        {url ? (
                            <img
                                src={url}
                                alt="QR Code"
                                className="size-full bg-transparent"
                            />
                        ) : (
                            <img src="/images/mock-qr.svg" />
                        )}
                    </div>
                    <div className="ms-5 flex w-full flex-col justify-center">
                        <div className="grid grid-flow-col grid-rows-1 gap-4 py-5">
                            <p className="font-bold">Name: </p>
                            <p className="text-end font-medium">
                                {meData?.fullName}
                            </p>
                        </div>

                        <div className="mt-auto flex flex-col items-center md:w-full">
                            <hr className="w-full bg-black" />
                            <button className="mt-10 mb-5 inline-flex max-w-11/12 items-center justify-center gap-3 rounded-xl border-2 border-black bg-secondary px-20 py-2 drop-shadow-lg hover:cursor-pointer hover:bg-secondary-darken md:w-full">
                                <p className="text-lg font-bold text-nowrap">
                                    Reload
                                </p>
                                <RefreshCcw />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-5 flex w-full flex-col rounded-xl border-2 border-black p-5 md:my-0 md:ms-10 md:w-1/4">
                <div className="group my-2 inline-flex items-center justify-center gap-4 hover:cursor-pointer">
                    <p className="text-xl font-bold text-nowrap group-hover:underline">
                        Wallet Information
                    </p>
                    <SquareArrowOutUpRight />
                </div>
                <hr className="w-full bg-black" />

                <div className="my-2 inline-flex items-center">
                    <p className="text-xl font-bold">Name:</p>
                    <p className="ms-auto max-w-1/2 truncate text-xl font-semibold group-hover:underline">
                        0xa134fgf05423094859034204892349238350
                    </p>
                </div>
                <hr className="w-full bg-black" />

                <div className="my-2 inline-flex items-center">
                    <p className="text-xl font-bold">Available Tickets:</p>
                    <p className="ms-auto max-w-1/2 truncate text-xl font-semibold group-hover:underline">
                        {tickets.length}
                    </p>
                </div>
                <div
                    className={cn(
                        'grid transform grid-cols-2 duration-100',
                        isShowingAvailableTickets
                            ? 'animate-dropdown origin-top opacity-100 ease-out'
                            : 'pointer-events-none size-0 origin-bottom opacity-0 ease-in',
                    )}
                >
                    {availableTickets.map((ticket) => (
                        <>
                            <p className="text-xl font-medium">
                                {ticket.eventName}
                            </p>
                            <p className="ms-auto text-end text-xl font-semibold">
                                1
                            </p>
                        </>
                    ))}
                </div>
                <button
                    className="my-2 self-center hover:text-gray"
                    onClick={() =>
                        setIsShowingAvailableTickets((prev) => !prev)
                    }
                >
                    <ChevronsDown
                        className={cn(
                            isShowingAvailableTickets
                                ? 'rotate-180 transition duration-100'
                                : '',
                        )}
                    />
                </button>
                <hr className="w-full bg-black" />

                <div className="my-2 inline-flex items-center">
                    <p className="text-xl font-bold">Used Tickets:</p>
                    <p className="ms-auto max-w-1/2 truncate text-xl font-semibold group-hover:underline">
                        {usedTickets.length}
                    </p>
                </div>
                <div
                    className={cn(
                        'grid transform grid-cols-2 duration-100',
                        isShowingUsedTickets
                            ? 'animate-dropdown origin-top opacity-100 ease-out'
                            : 'pointer-events-none size-0 origin-bottom opacity-0 ease-in',
                    )}
                >
                    {usedTickets.map((ticket) => (
                        <>
                            <p className="text-xl font-medium">
                                {ticket.eventName}
                            </p>
                            <p className="ms-auto text-end text-xl font-semibold">
                                1
                            </p>
                        </>
                    ))}
                </div>
                <button
                    className="my-2 self-center hover:text-gray"
                    onClick={() => setIsShowingUsedTickets((prev) => !prev)}
                >
                    <ChevronsDown
                        className={cn(
                            isShowingUsedTickets
                                ? 'rotate-180 transition duration-100'
                                : '',
                        )}
                    />
                </button>
                <hr className="w-full bg-black" />
            </div>
        </div>
    );
}

import { getEventByIdOptions } from '@/services/client/@tanstack/react-query.gen';
import { useTicketStore } from '@/stores';
import type { Event } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { Calendar, Clock, CreditCard, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/event/$eventId/payment/')({
    component: RouteComponent,
    beforeLoad: () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            toast.error('You must log in before visiting this page.', {
                className: '!text-red !bg-white',
            });
            throw redirect({
                to: '/',
            });
        }
    },
});

function RouteComponent() {
    const { eventId } = Route.useParams();
    const navigate = useNavigate();
    const ticketStore = useTicketStore();

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
        <div className="flex w-full gap-8 py-[80px] pr-[140px] pl-[192px]">
            {/* Left Column - Event Info & Form */}
            <div className="flex-1">
                <h1 className="border-b border-black pb-4 text-3xl font-bold text-black">
                    {event?.title}
                </h1>

                {/* Time and Location */}
                <div className="mt-1 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray" />
                        <span className="text-gray">
                            {event?.startDate?.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray" />
                        <span className="text-gray-700">{event?.location}</span>
                    </div>
                </div>

                {/* Question Form */}
                <div className="mt-24 rounded-lg border-2 border-black">
                    <div className="border-b border-black px-6 py-4">
                        <h2 className="text-xl font-bold text-black">
                            QUESTION FORM
                        </h2>
                    </div>

                    <div className="space-y-6 p-6">
                        <div>
                            <label className="mb-3 block font-bold text-black">
                                Họ & tên / Full name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your answer"
                                className="bg-gray-100 placeholder-gray-500 w-full rounded-md border-0 px-4 py-3 text-black focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block font-bold text-black">
                                Email của bạn là gì?
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your answer"
                                className="bg-gray-100 placeholder-gray-500 w-full rounded-md border-0 px-4 py-3 text-black focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block font-bold text-black">
                                Số điện thoại của bạn là gì?
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter your answer"
                                className="bg-gray-100 placeholder-gray-500 w-full rounded-md border-0 px-4 py-3 text-black focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-4 block font-bold text-black">
                                Thể lệ & Điều kiện
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="agree1"
                                        className="mt-1 h-4 w-4 border-2 border-black text-black focus:ring-black"
                                    />
                                    <label
                                        htmlFor="agree1"
                                        className="text-sm leading-relaxed text-black"
                                    >
                                        Tôi đồng ý nhận các thông tin và liên
                                        lạc cũng cả chương trình ưu đãi qua
                                        email và số điện thoại
                                    </label>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="agree2"
                                        className="mt-1 h-4 w-4 border-2 border-black text-black focus:ring-black"
                                    />
                                    <label
                                        htmlFor="agree2"
                                        className="text-sm leading-relaxed text-black"
                                    >
                                        Tôi đồng ý cho TicketML & BTC sử dụng
                                        thông tin cá nhân nhằm mục đích vận hành
                                        sự kiện
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Booking Timer & Ticket Info */}
            <div className="w-96 space-y-6">
                {/* Complete Your Booking Timer */}
                <div className="overflow-hidden rounded-lg border-2 border-black">
                    <div className="bg-black px-6 py-4 text-white">
                        <h3 className="text-lg font-bold">
                            Complete your booking
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <Clock className="text-red-500 h-5 w-5" />
                            <span className="text-gray-700">
                                Time remaining:
                            </span>
                        </div>
                        {/* <div className="text-3xl font-bold text-red-500 mb-4">
                            {formatTime(timeLeft)}
                        </div> */}
                        <p className="text-gray-600 text-sm">
                            Please complete your booking within the time limit
                            to secure your tickets.
                        </p>
                    </div>
                </div>

                {/* Ticket Information */}
                <div className="overflow-hidden rounded-lg border-2 border-black">
                    <div className="bg-black px-6 py-4 text-white">
                        <h3 className="text-lg font-bold">
                            Ticket Information
                        </h3>
                    </div>
                    <div className="space-y-4 p-6">
                        {/* Ticket Type */}
                        <div className="border-gray-200 border-b pb-4">
                            {ticketStore.selectedTickets.map((ticket) => (
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-black">
                                            {ticket.type}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            General Admission
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {ticket.quantity}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {ticket.price} VND
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Subtotal:</span>
                                <span className="font-semibold">
                                    {event?.ticketTypes[0].price} VND
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">
                                    Service fee:
                                </span>
                                <span className="font-semibold">
                                    {event?.ticketTypes[0].price * 0.08} VND
                                </span>
                            </div>
                            <div className="border-gray-200 border-t pt-2">
                                <div className="flex justify-between">
                                    <span className="font-bold text-black">
                                        Total:
                                    </span>
                                    <span className="font-bold text-black">
                                        {event?.ticketTypes[0].price * 1.08} VND
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Continue Payment Button */}
                        <button
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-green px-4 py-3 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-green-darken"
                            onClick={() => {
                                navigate({
                                    to: '/event/$eventId/payment/confirm',
                                    params: {
                                        eventId,
                                    },
                                });
                            }}
                        >
                            <CreditCard className="h-5 w-5" />
                            Continue Payment
                        </button>

                        {/* Payment Methods */}
                        <div className="mt-4">
                            <p className="text-gray-500 mb-3 text-center text-xs">
                                Accepted payment methods:
                            </p>
                            <div className="flex justify-center gap-2">
                                <img
                                    src="/images/vnpay.png"
                                    alt="VNPAY"
                                    className="h-6 w-8 object-contain"
                                />
                                <img
                                    src="/images/vietqr.png"
                                    alt="VietQR"
                                    className="h-6 w-8 object-contain"
                                />
                                <img
                                    src="/images/zalopay.png"
                                    alt="ZaloPay"
                                    className="h-6 w-8 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

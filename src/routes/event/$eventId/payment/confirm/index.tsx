import {
    createOrderMutation,
    getEventByIdOptions,
} from '@/services/client/@tanstack/react-query.gen';
import type { Event } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, Clock, CreditCard, MapPin } from 'lucide-react';

export const Route = createFileRoute('/event/$eventId/payment/confirm/')({
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

    const event = (response?.data as Event) ?? null;

    const createOrder = useMutation({
        ...createOrderMutation(),
        onSuccess(data, variables, onMutateResult, context) {
            const paymentUrl = (data.data as any)?.paymentUrl as string;
            window.location.href = paymentUrl;
        },
    });
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

                {/* PAYMENT INFO */}
                <div className="mt-24 rounded-lg border-2 border-black">
                    <div className="border-b border-black px-6 py-4">
                        <h2 className="text-xl font-bold text-black">
                            PAYMENT INFO
                        </h2>
                    </div>

                    <div className="space-y-6 p-6">
                        {/* Ticket receiving info */}
                        <div className="rounded-lg bg-gray-light p-4">
                            <h3 className="mb-2 font-semibold text-black">
                                Ticket receiving info
                            </h3>
                            <p className="text-sm text-gray">
                                E-tickets will be displayed in "My Wallet"
                                section of your account
                            </p>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-lg bg-gray-light p-4">
                            <h3 className="mb-4 font-semibold text-black">
                                Payment Method
                            </h3>
                            <div className="space-y-4">
                                {/* VNPAY/Mobile Banking App */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="vnpay"
                                        name="payment"
                                        className="h-4 w-4 border-2 border-black text-black focus:ring-black"
                                        defaultChecked
                                    />
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="/images/vnpay.png"
                                            alt="VNPAY"
                                            className="h-6 w-8 object-contain"
                                        />
                                        <label
                                            htmlFor="vnpay"
                                            className="font-medium text-black"
                                        >
                                            VNPAY/Mobile Banking App
                                        </label>
                                    </div>
                                </div>

                                {/* VietQR */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="vietqr"
                                        name="payment"
                                        className="h-4 w-4 border-2 border-black text-black focus:ring-black"
                                    />
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="/images/vietqr.png"
                                            alt="VietQR"
                                            className="h-6 w-8 object-contain"
                                        />
                                        <label
                                            htmlFor="vietqr"
                                            className="font-medium text-black"
                                        >
                                            VietQR
                                        </label>
                                    </div>
                                </div>

                                {/* ZaloPay */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="zalopay"
                                        name="payment"
                                        className="h-4 w-4 border-2 border-black text-black focus:ring-black"
                                    />
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="/images/zalopay.png"
                                            alt="ZaloPay"
                                            className="h-6 w-8 object-contain"
                                        />
                                        <label
                                            htmlFor="zalopay"
                                            className="font-medium text-black"
                                        >
                                            ZaloPay
                                        </label>
                                    </div>
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
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-semibold text-black">
                                        {event?.ticketTypes[0].type}
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        General Admission
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">1x</p>
                                    <p className="text-gray-600 text-sm">
                                        {event?.ticketTypes[0].price} VND
                                    </p>
                                </div>
                            </div>
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
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-green px-4 py-3 font-semibold text-white transition-colors hover:bg-green-darken"
                            onClick={() => {
                                createOrder.mutate({
                                    body: {
                                        items: [
                                            {
                                                ticketTypeId: event
                                                    ?.ticketTypes[0]
                                                    .id as unknown as number,
                                                quantity: 1,
                                            },
                                        ],
                                    },
                                });
                            }}
                        >
                            <CreditCard className="h-5 w-5" />
                            Payment
                        </button>

                        {/* Terms and Conditions */}
                        <div className="mt-4 text-left">
                            <p className="text-xs text-gray">
                                By proceeding the order, you agree to the{' '}
                                <a
                                    href="#"
                                    className="text-blue hover:underline"
                                >
                                    General Trading Conditions
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

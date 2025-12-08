import { Button } from '@/components/ui/button';
import {
    createOrderMutation,
    getEventByIdOptions,
} from '@/services/client/@tanstack/react-query.gen';
import type { OrderItemRequestDto } from '@/services/client/types.gen';
import { useTicketStore } from '@/stores';
import type { Event, Order } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import {
    Calendar,
    CheckCircle2,
    CreditCard,
    MapPin,
    Ticket,
} from 'lucide-react';
import { useState } from 'react';
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
    const ticketStore = useTicketStore();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: response } = useQuery({
        ...getEventByIdOptions({
            path: {
                eventId: Number(eventId),
            },
        }),
        staleTime: 5 * 60 * 1000,
    });

    const event = response?.data as Event | undefined;

    const createOrder = useMutation({
        ...createOrderMutation(),
        onSuccess(data) {
            const orderData = data.data as Order | undefined;
            const paymentUrl = orderData?.paymentUrl;
            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                toast.error('Payment URL not found');
                setIsProcessing(false);
            }
        },
        onError() {
            toast.error('Failed to create order. Please try again.');
            setIsProcessing(false);
        },
    });

    const calculateTotal = () => {
        return ticketStore.selectedTickets.reduce(
            (total, ticket) =>
                total + (ticket.price ?? 0) * (ticket.quantity ?? 0),
            0,
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!fullName.trim()) {
            toast.error('Please enter your full name');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            toast.error('Please enter a valid email');
            return;
        }
        if (!phoneNumber.trim()) {
            toast.error('Please enter your phone number');
            return;
        }
        if (!agreeTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }
        if (ticketStore.selectedTickets.length === 0) {
            toast.error('No tickets selected');
            return;
        }

        setIsProcessing(true);

        const orderItems: OrderItemRequestDto[] = ticketStore.selectedTickets
            .filter((ticket) => ticket.id !== undefined)
            .map((ticket) => ({
                ticketTypeId: ticket.id!,
                quantity: ticket.quantity,
            }));

        createOrder.mutate({
            body: {
                fullName: fullName.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
                items: orderItems,
            },
        });
    };

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
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-light/20 py-12">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-8 lg:flex-row"
                >
                    {/* Left Column - Event Info & Form */}
                    <div className="flex-1">
                        {/* Event Header */}
                        <div className="mb-8 rounded-2xl border border-gray-light bg-white p-6 shadow-md md:p-8">
                            <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
                                {event.title}
                            </h1>

                            {/* Event Details */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                                        <Calendar className="size-5 text-primary-darken" />
                                    </div>
                                    <span className="text-gray">
                                        {event.startDate
                                            ? new Date(
                                                  event.startDate,
                                              ).toLocaleDateString('en-US', {
                                                  weekday: 'short',
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : 'TBA'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-secondary/10">
                                        <MapPin className="size-5 text-secondary-darken" />
                                    </div>
                                    <span className="text-gray">
                                        {event.location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information Form */}
                        <div className="rounded-2xl border border-gray-light bg-white shadow-md">
                            <div className="border-b border-gray-light bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 md:px-8">
                                <h2 className="text-xl font-bold text-black md:text-2xl">
                                    Customer Information
                                </h2>
                            </div>

                            <div className="space-y-6 p-6 md:p-8">
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="mb-2 block font-semibold text-black"
                                    >
                                        Full Name{' '}
                                        <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                        placeholder="Enter your full name"
                                        required
                                        className="w-full rounded-lg border-2 border-gray-light bg-gray-light/20 px-4 py-3 text-black transition-colors placeholder:text-gray focus:border-primary focus:bg-white focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block font-semibold text-black"
                                    >
                                        Email{' '}
                                        <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="your.email@example.com"
                                        required
                                        className="w-full rounded-lg border-2 border-gray-light bg-gray-light/20 px-4 py-3 text-black transition-colors placeholder:text-gray focus:border-primary focus:bg-white focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phoneNumber"
                                        className="mb-2 block font-semibold text-black"
                                    >
                                        Phone Number{' '}
                                        <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                        placeholder="0987654321"
                                        required
                                        className="w-full rounded-lg border-2 border-gray-light bg-gray-light/20 px-4 py-3 text-black transition-colors placeholder:text-gray focus:border-primary focus:bg-white focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-3 rounded-lg bg-gray-light/30 p-4">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="agreeMarketing"
                                            checked={agreeMarketing}
                                            onChange={(e) =>
                                                setAgreeMarketing(
                                                    e.target.checked,
                                                )
                                            }
                                            className="mt-1 size-4 rounded border-2 border-gray text-primary focus:ring-2 focus:ring-primary"
                                        />
                                        <label
                                            htmlFor="agreeMarketing"
                                            className="text-sm leading-relaxed text-black"
                                        >
                                            I agree to receive promotional
                                            information and updates via email
                                            and phone
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="agreeTerms"
                                            checked={agreeTerms}
                                            onChange={(e) =>
                                                setAgreeTerms(e.target.checked)
                                            }
                                            required
                                            className="mt-1 size-4 rounded border-2 border-gray text-primary focus:ring-2 focus:ring-primary"
                                        />
                                        <label
                                            htmlFor="agreeTerms"
                                            className="text-sm leading-relaxed text-black"
                                        >
                                            I agree to TicketML's{' '}
                                            <span className="font-semibold text-primary-darken">
                                                Terms & Conditions
                                            </span>{' '}
                                            and allow the use of my personal
                                            information for event management{' '}
                                            <span className="text-red">*</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-96">
                        <div className="sticky top-8 space-y-6">
                            {/* Ticket Information */}
                            <div className="overflow-hidden rounded-2xl border border-gray-light bg-white shadow-md">
                                <div className="bg-gradient-to-r from-primary to-primary-darken px-6 py-4">
                                    <h3 className="text-lg font-bold text-black">
                                        Order Summary
                                    </h3>
                                </div>
                                <div className="space-y-4 p-6">
                                    {/* Ticket List */}
                                    <div className="space-y-3 border-b border-gray-light pb-4">
                                        {ticketStore.selectedTickets.map(
                                            (ticket, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start justify-between rounded-lg bg-gray-light/30 p-3"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                                                            <Ticket className="size-4 text-black" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-black">
                                                                {ticket.type}
                                                            </h4>
                                                            <p className="text-sm text-gray">
                                                                Quantity:{' '}
                                                                {ticket.quantity ??
                                                                    0}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-black">
                                                            {(
                                                                (ticket.price ??
                                                                    0) *
                                                                (ticket.quantity ??
                                                                    0)
                                                            ).toLocaleString()}{' '}
                                                            đ
                                                        </p>
                                                        <p className="text-xs text-gray">
                                                            {(
                                                                ticket.price ??
                                                                0
                                                            ).toLocaleString()}{' '}
                                                            đ each
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                                            <span className="text-lg font-bold text-black">
                                                Total Amount:
                                            </span>
                                            <span className="text-2xl font-bold text-primary-darken">
                                                {calculateTotal().toLocaleString()}{' '}
                                                đ
                                            </span>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="rounded-lg bg-blue/10 p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <CreditCard className="text-blue-darken size-5" />
                                            <h4 className="font-semibold text-black">
                                                Payment Method
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray">
                                            VNPAY - Secure online payment
                                        </p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-green" />
                                            <span className="text-xs text-gray">
                                                SSL Encrypted & Secure
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full rounded-xl bg-gradient-to-r from-green to-green-darken py-6 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="mr-2 inline-block size-5 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 inline-block size-5" />
                                                Complete Payment
                                            </>
                                        )}
                                    </Button>

                                    {/* Security Notice */}
                                    <p className="text-center text-xs text-gray">
                                        By completing this purchase, you agree
                                        to the{' '}
                                        <span className="font-semibold text-primary-darken">
                                            Terms & Conditions
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

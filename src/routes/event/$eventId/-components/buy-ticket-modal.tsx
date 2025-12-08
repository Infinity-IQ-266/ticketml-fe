import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTicketStore } from '@/stores';
import type { TicketType } from '@/types';
import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { useMemo } from 'react';
import * as z from 'zod';

const formSchema = z.object({
    tickets: z.record(z.number().min(0)).refine(
        (tickets) => {
            const total = Object.values(tickets).reduce(
                (sum, qty) => sum + qty,
                0,
            );
            return total <= 10;
        },
        { message: 'Total tickets cannot exceed 10' },
    ),
});

export type BuyTicketModalProps = {
    ticketTypes: TicketType[];
    eventId: string;
};

export const BuyTicketModal = ({
    ticketTypes,
    eventId,
}: BuyTicketModalProps) => {
    const navigate = useNavigate();
    const ticketStore = useTicketStore();
    const initialTickets = ticketTypes.reduce(
        (acc, ticket) => {
            acc[ticket.id] = 0;
            return acc;
        },
        {} as Record<string, number>,
    );

    const form = useForm({
        defaultValues: {
            tickets: initialTickets,
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            const selectedTickets = Object.entries(value.tickets)
                .filter(([, qty]) => qty > 0)
                .map(([id, qty]) => {
                    const ticket = ticketTypes.find((t) => t.id === Number(id));
                    return {
                        ...ticket,
                        quantity: qty,
                    };
                });
            ticketStore.setSelectedTickets(selectedTickets);
            navigate({
                to: '/event/$eventId/payment',
                params: {
                    eventId: eventId,
                },
            });
        },
    });

    const tickets = useStore(form.store, (state) => state.values.tickets);

    const totalTickets = useMemo(() => {
        return Object.values(tickets).reduce((sum, qty) => sum + qty, 0);
    }, [tickets]);

    const totalPrice = useMemo(() => {
        return Object.entries(tickets).reduce((sum, [id, qty]) => {
            const ticket = ticketTypes.find((t) => t.id === Number(id));
            return sum + (ticket ? ticket.price * qty : 0);
        }, 0);
    }, [tickets, ticketTypes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.handleSubmit();
    };

    return (
        <div className="p-6 md:p-8">
            <div className="mb-6 border-b border-gray-light pb-4">
                <h2 className="text-2xl font-bold text-black md:text-3xl">
                    Buy Tickets
                </h2>
                <p className="mt-1 text-sm text-gray">
                    Select the number of tickets you want to purchase (max 10)
                </p>
            </div>
            <div className="space-y-6">
                <FieldGroup className="space-y-4">
                    {ticketTypes.map((ticket) => (
                        <form.Field
                            key={ticket.id}
                            name={`tickets.${ticket.id}`}
                            children={(field) => {
                                const currentQty = field.state.value;
                                const isSoldOut = ticket.status === 'sold_out';

                                const canIncrease =
                                    !isSoldOut &&
                                    currentQty < ticket.remainingQuantity &&
                                    totalTickets < 10;

                                const canDecrease = currentQty > 0;

                                return (
                                    <Field>
                                        <div className="flex items-center justify-between rounded-xl border border-gray-light bg-gradient-to-br from-white to-gray-light/20 p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md">
                                            <div className="flex-1">
                                                <FieldLabel className="text-lg font-bold text-black">
                                                    {ticket.type}
                                                </FieldLabel>
                                                <p className="text-base font-semibold text-primary">
                                                    {ticket.price.toLocaleString(
                                                        'vi-VN',
                                                    )}{' '}
                                                    đ
                                                </p>
                                                <p className="mt-1 text-sm text-gray">
                                                    {isSoldOut
                                                        ? '🔴 Sold Out'
                                                        : `✓ ${ticket.remainingQuantity} tickets available`}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="size-10 rounded-lg border-2 p-0 transition-all hover:scale-105 hover:border-primary active:scale-95"
                                                    onClick={() => {
                                                        if (canDecrease) {
                                                            field.handleChange(
                                                                currentQty - 1,
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        !canDecrease ||
                                                        isSoldOut
                                                    }
                                                >
                                                    <Minus className="size-5" />
                                                </Button>

                                                <Input
                                                    type="number"
                                                    value={currentQty}
                                                    onChange={(e) => {
                                                        const val =
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0;
                                                        const newTotal =
                                                            totalTickets -
                                                            currentQty +
                                                            val;
                                                        if (
                                                            val >= 0 &&
                                                            val <=
                                                                ticket.remainingQuantity &&
                                                            newTotal <= 10
                                                        ) {
                                                            field.handleChange(
                                                                val,
                                                            );
                                                        }
                                                    }}
                                                    disabled={isSoldOut}
                                                    className="w-20 border-2 text-center text-lg font-bold"
                                                    min="0"
                                                    max={Math.min(
                                                        ticket.remainingQuantity,
                                                        10,
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="size-10 rounded-lg border-2 p-0 transition-all hover:scale-105 hover:border-primary active:scale-95"
                                                    onClick={() => {
                                                        if (canIncrease) {
                                                            field.handleChange(
                                                                currentQty + 1,
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        !canIncrease ||
                                                        isSoldOut
                                                    }
                                                >
                                                    <Plus className="size-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Field>
                                );
                            }}
                        />
                    ))}
                </FieldGroup>

                <div className="rounded-xl border-2 border-gray-light bg-gradient-to-br from-primary/5 to-secondary/5 p-5">
                    <div className="mb-3 flex items-center justify-between text-base">
                        <span className="font-medium text-gray">
                            Total Tickets:
                        </span>
                        <span className="text-lg font-bold text-black">
                            {totalTickets} / 10
                        </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-light pt-3">
                        <span className="text-lg font-semibold text-black">
                            Total Price:
                        </span>
                        <span className="text-2xl font-bold text-primary">
                            {totalPrice.toLocaleString('vi-VN')} đ
                        </span>
                    </div>
                    {totalTickets > 10 && (
                        <FieldError
                            errors={[
                                { message: 'Total tickets cannot exceed 10' },
                            ]}
                        />
                    )}
                </div>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        className="border-2 px-6 transition-all hover:scale-105 active:scale-95"
                    >
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={totalTickets === 0 || totalTickets > 10}
                        className="flex-1 bg-primary px-6 text-lg font-bold text-black transition-all hover:scale-105 hover:bg-primary-darken active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Buy {totalTickets} Ticket
                        {totalTickets !== 1 ? 's' : ''} -{' '}
                        {totalPrice.toLocaleString('vi-VN')} đ
                    </Button>
                </div>
            </div>
        </div>
    );
};

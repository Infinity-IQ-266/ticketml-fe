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
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Buy Tickets</h2>
            <div className="space-y-6">
                <FieldGroup>
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
                                        <div className="flex items-center justify-between rounded-lg p-2">
                                            <div className="flex-1">
                                                <FieldLabel className="text-base font-semibold">
                                                    {ticket.type}
                                                </FieldLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    ${ticket.price.toFixed(2)}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {isSoldOut
                                                        ? 'Sold Out'
                                                        : `${ticket.remainingQuantity} remaining`}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
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
                                                    <Minus className="h-4 w-4" />
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
                                                    className="w-16 text-center"
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
                                                    className="h-8 w-8 p-0"
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
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Field>
                                );
                            }}
                        />
                    ))}
                </FieldGroup>

                <div className="border-t pt-4">
                    <div className="mb-2 flex justify-between text-sm">
                        <span>Total Tickets:</span>
                        <span className="font-semibold">
                            {totalTickets} / 10
                        </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total Price:</span>
                        <span>{totalPrice.toLocaleString('de-DE')} VND</span>
                    </div>
                    {totalTickets > 10 && (
                        <FieldError
                            errors={[
                                { message: 'Total tickets cannot exceed 10' },
                            ]}
                        />
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                    >
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={totalTickets === 0 || totalTickets > 10}
                        className="flex-1"
                    >
                        Buy {totalTickets} Ticket
                        {totalTickets !== 1 ? 's' : ''} -{' '}
                        {totalPrice.toLocaleString('de-DE')} VND
                    </Button>
                </div>
            </div>
        </div>
    );
};

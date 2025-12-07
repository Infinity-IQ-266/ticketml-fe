import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Ticket } from '@/types';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface TicketQRModalProps {
    ticket: Ticket | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TicketQRModal({ ticket, isOpen, onClose }: TicketQRModalProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (ticket?.qrCode && isOpen) {
            setIsGenerating(true);
            QRCode.toDataURL(ticket.qrCode, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#3c4247',
                    light: '#ffffff',
                },
            })
                .then((url) => {
                    setQrCodeUrl(url);
                    setIsGenerating(false);
                })
                .catch((error) => {
                    console.error('Error generating QR code:', error);
                    setIsGenerating(false);
                });
        }
    }, [ticket?.qrCode, isOpen]);

    if (!ticket) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex max-h-[90vh] max-w-md flex-col p-0">
                <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
                    <DialogTitle className="text-2xl font-bold text-black">
                        Ticket QR Code
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-6 overflow-y-auto px-6 pb-6">
                    {/* Event Info */}
                    <div className="w-full space-y-3 rounded-xl bg-primary/10 p-4">
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-primary/30 p-2">
                                <TicketIcon className="size-5 text-primary-darken" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-bold text-black">
                                    {ticket.eventName}
                                </h3>
                                <p className="text-sm text-gray">
                                    {ticket.ticketTypeName}
                                </p>
                            </div>
                        </div>

                        {ticket.eventStartDate && (
                            <div className="flex items-center gap-2 text-sm text-gray">
                                <Calendar className="size-4 flex-shrink-0" />
                                <span>{ticket.eventStartDate}</span>
                            </div>
                        )}

                        {ticket.eventLocation && (
                            <div className="flex items-center gap-2 text-sm text-gray">
                                <MapPin className="size-4 flex-shrink-0" />
                                <span className="truncate">
                                    {ticket.eventLocation}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* QR Code */}
                    <div className="flex w-full flex-col items-center">
                        <div className="rounded-xl border-4 border-primary bg-white p-6 shadow-lg">
                            {isGenerating ? (
                                <div className="flex size-[300px] items-center justify-center">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                </div>
                            ) : qrCodeUrl ? (
                                <img
                                    src={qrCodeUrl}
                                    alt="Ticket QR Code"
                                    className="size-[300px]"
                                />
                            ) : (
                                <div className="flex size-[300px] items-center justify-center text-gray">
                                    <p>Failed to generate QR code</p>
                                </div>
                            )}
                        </div>
                        <p className="mt-4 text-center text-sm text-gray">
                            Show this QR code at the event entrance
                        </p>
                    </div>

                    {/* Ticket ID */}
                    {ticket.id && (
                        <div className="w-full rounded-lg bg-gray-light/20 p-3">
                            <p className="text-center text-xs font-medium text-gray">
                                Ticket ID
                            </p>
                            <p className="text-center font-mono text-sm font-semibold break-all text-black">
                                {ticket.id}
                            </p>
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary-darken hover:shadow-md"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

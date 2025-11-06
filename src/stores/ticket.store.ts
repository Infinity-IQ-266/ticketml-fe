import { create } from 'zustand';

type SelectedTicket = {
    id?: number;
    type?: string;
    price?: number;
    totalQuantity?: number;
    remainingQuantity?: number;
    status?: string | null;
    quantity?: number;
};

type TicketStore = {
    selectedTickets: SelectedTicket[];
    setSelectedTickets: (tickets: SelectedTicket[]) => void;
    clear: () => void;
};

export const useTicketStore = create<TicketStore>((set) => ({
    selectedTickets: [],
    setSelectedTickets: (tickets) => set({ selectedTickets: tickets }),
    clear: () => set({ selectedTickets: [] }),
}));

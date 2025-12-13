import { Calendar, DollarSign, Ticket, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
    stats: {
        totalRevenue: number;
        totalOrders: number;
        totalTicketsSold: number;
        totalEvents: number;
    };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    return (
        <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-gradient-to-br from-green/10 to-green/5 p-4 shadow-sm">
                <div className="rounded-lg bg-green/20 p-2">
                    <DollarSign className="size-5 text-green-darken" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray">
                        Total Revenue
                    </p>
                    <p className="truncate text-lg font-bold text-black">
                        {stats.totalRevenue.toLocaleString()} VND
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-gradient-to-br from-primary/10 to-primary/5 p-4 shadow-sm">
                <div className="rounded-lg bg-primary/20 p-2">
                    <TrendingUp className="size-5 text-primary-darken" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray">
                        Total Orders
                    </p>
                    <p className="truncate text-lg font-bold text-black">
                        {stats.totalOrders}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-gradient-to-br from-secondary/10 to-secondary/5 p-4 shadow-sm">
                <div className="rounded-lg bg-secondary/20 p-2">
                    <Ticket className="size-5 text-secondary-darken" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray">
                        Tickets Sold
                    </p>
                    <p className="truncate text-lg font-bold text-black">
                        {stats.totalTicketsSold}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-gradient-to-br from-blue/10 to-blue/5 p-4 shadow-sm">
                <div className="rounded-lg bg-blue/20 p-2">
                    <Calendar className="size-5 text-blue" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray">
                        Total Events
                    </p>
                    <p className="truncate text-lg font-bold text-black">
                        {stats.totalEvents}
                    </p>
                </div>
            </div>
        </div>
    );
};

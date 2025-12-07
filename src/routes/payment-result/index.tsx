import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/payment-result/')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate({ to: '/my-tickets' });
        }, 3000);

        return () => clearTimeout(timeout);
    }, [navigate]);
    return (
        <div className="absolute top-0 -z-50 flex h-dvh w-full items-center justify-center">
            <LoaderCircle size={64} className="animate-spin" />
        </div>
    );
}

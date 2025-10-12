import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/payment-result/')({
    component: RouteComponent,
});

function RouteComponent() {
    useEffect(() => {});
    return (
        <div className="absolute top-0 -z-50 flex h-dvh w-full items-center justify-center">
            <LoaderCircle size={64} className="animate-spin" />
        </div>
    );
}

import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/oauth2/redirect/')({
    component: RouteComponent,
});

function RouteComponent() {
    const { token }: { token: string } = Route.useSearch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        const timeout = setTimeout(() => {
            if (token) navigate({ to: '/' });
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('access_token', token);
        }

        redirect({ to: '/' });
    }, [token]);

    return (
        <div className="absolute top-0 flex h-dvh w-full items-center justify-center">
            <LoaderCircle size={64} className="animate-spin" />
        </div>
    );
}

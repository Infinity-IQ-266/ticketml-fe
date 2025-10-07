import { createFileRoute } from '@tanstack/react-router';

import { Header } from './-components';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Header />
        </>
    );
}

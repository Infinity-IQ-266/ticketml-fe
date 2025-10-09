import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-wallet/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/my-calendar/"!</div>;
}

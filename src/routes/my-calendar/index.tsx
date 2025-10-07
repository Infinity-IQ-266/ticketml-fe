import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-calendar/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/my-calendar/"!</div>;
}

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/organizer/check-in/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/organizer/check-in/"!</div>;
}

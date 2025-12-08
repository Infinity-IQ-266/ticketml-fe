import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/organizer/$orgId/check-in/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/organizer/$orgId/check-in/"!</div>;
}

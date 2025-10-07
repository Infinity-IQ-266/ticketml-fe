import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
    <>
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
    </>
);

export const Route = createRootRoute({ component: RootLayout });

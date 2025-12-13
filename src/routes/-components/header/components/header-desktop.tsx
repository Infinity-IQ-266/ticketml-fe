import { LogoIcon } from '@/assets/icons';
import { useMe } from '@/hooks';
import { cn } from '@/lib/utils';
import type { MeData } from '@/types';
import { Link, useMatchRoute } from '@tanstack/react-router';

import { LoginButton, UserAvatar } from '.';

export const HeaderDesktop = () => {
    const matchRoute = useMatchRoute();
    const { data: rawMeData } = useMe();
    const meResponse = rawMeData?.data as MeData;

    return (
        <div className="relative z-40 inline-flex w-full items-center border-b border-gray-light bg-white px-10 py-6 shadow-sm 2xl:px-20">
            <Link
                className="group inline-flex items-center transition-all duration-200 hover:cursor-pointer"
                to="/"
            >
                <LogoIcon className="w-20 transition-transform duration-200 group-hover:scale-105" />
                <p className="ms-3 text-4xl font-bold text-nowrap text-black">
                    Ticket ML
                </p>
            </Link>

            <div className="inline-flex w-full grow items-center justify-end">
                <div className="inline-flex w-full max-w-[500px] justify-around px-8">
                    <Link
                        to="/"
                        className={cn(
                            'relative text-xl font-medium text-nowrap transition-all duration-200 hover:text-primary-darken',
                            matchRoute({ to: '/', fuzzy: true })
                                ? 'font-bold text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]'
                                : 'text-gray',
                        )}
                    >
                        Events
                    </Link>

                    <Link
                        to="/my-tickets"
                        className={cn(
                            'relative text-xl font-medium text-nowrap transition-all duration-200 hover:text-primary-darken',
                            matchRoute({ to: '/my-tickets', fuzzy: false })
                                ? 'font-bold text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]'
                                : 'text-gray',
                        )}
                    >
                        My Tickets
                    </Link>

                    <Link
                        to="/host"
                        className={cn(
                            'relative text-xl font-medium text-nowrap transition-all duration-200 hover:text-primary-darken',
                            matchRoute({ to: '/host', fuzzy: false })
                                ? 'font-bold text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]'
                                : 'text-gray',
                        )}
                    >
                        Host your events
                    </Link>
                </div>
                <div className="inline-flex items-center gap-8">
                    {meResponse ? <UserAvatar /> : <LoginButton />}
                </div>
            </div>
        </div>
    );
};

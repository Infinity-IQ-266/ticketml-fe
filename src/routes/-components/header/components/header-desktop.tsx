import { LogoIcon } from '@/assets/icons';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';
import { useMe } from '@/hooks';
import { cn } from '@/lib/utils';
import type { MeData } from '@/types';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { SearchIcon, SlidersHorizontal } from 'lucide-react';

import { Cart, LoginButton, UserAvatar } from '.';

export const HeaderDesktop = () => {
    const matchRoute = useMatchRoute();
    const { data: rawMeData } = useMe();
    const meResponse = rawMeData?.data as MeData;

    return (
        <div className="inline-flex w-screen items-center border-b border-gray-light bg-white px-10 py-6 shadow-sm 2xl:px-20">
            <Link
                className="group inline-flex items-center transition-all duration-200 hover:cursor-pointer"
                to="/"
            >
                <LogoIcon className="w-20 transition-transform duration-200 group-hover:scale-105" />
                <p className="ms-3 text-4xl font-bold text-nowrap text-black">
                    Ticket ML
                </p>
            </Link>
            <InputGroup className="ms-8 h-12 max-w-72 min-w-52 rounded-lg border border-gray-light shadow-sm transition-all duration-200 focus-within:border-primary focus-within:shadow-md 2xl:ms-16">
                <InputGroupInput
                    className="flex text-base text-black placeholder:text-base placeholder:font-normal placeholder:text-gray"
                    placeholder="Search events..."
                />
                <InputGroupAddon>
                    <SearchIcon className="size-6 text-gray transition-colors duration-200 group-focus-within:text-primary" />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                    <InputGroupButton className="h-full rounded-lg transition-all duration-200 hover:cursor-pointer hover:bg-primary/20! active:scale-95">
                        <SlidersHorizontal className="size-6 text-black" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>

            <div className="inline-flex w-full grow items-center justify-end">
                <div className="inline-flex w-full max-w-96 justify-around px-8">
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
                        to="/resources"
                        className={cn(
                            'relative text-xl font-medium text-nowrap transition-all duration-200 hover:text-primary-darken',
                            matchRoute({ to: '/resources', fuzzy: true })
                                ? 'font-bold text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]'
                                : 'text-gray',
                        )}
                    >
                        Resources
                    </Link>
                </div>
                <div className="inline-flex items-center gap-8">
                    <Cart />
                    {meResponse ? <UserAvatar /> : <LoginButton />}
                </div>
            </div>
        </div>
    );
};

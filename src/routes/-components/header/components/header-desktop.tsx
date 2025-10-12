import { LogoIcon } from '@/assets/icons';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { SearchIcon, SlidersHorizontal } from 'lucide-react';

import { Cart, LoginButton, UserAvatar } from '.';

export const HeaderDesktop = () => {
    const matchRoute = useMatchRoute();

    return (
        <div className="inline-flex w-screen items-center border-b-2 border-black px-10 py-6 2xl:px-20">
            <Link
                className="inline-flex items-center hover:cursor-pointer"
                to="/"
            >
                <LogoIcon className="w-20" />
                <p className="ms-3 text-4xl font-bold text-nowrap text-black">
                    Ticket ML
                </p>
            </Link>
            <InputGroup className="ms-8 h-12 max-w-72 min-w-52 rounded-md border border-black 2xl:ms-16">
                <InputGroupInput
                    className="flex !text-2xl text-black placeholder-black/50! placeholder:text-2xl"
                    placeholder="Search"
                />
                <InputGroupAddon>
                    <SearchIcon className="size-6 text-black" />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                    <InputGroupButton className="h-full rounded-full hover:cursor-pointer hover:bg-black/10!">
                        <SlidersHorizontal className="size-6 text-black" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>

            <div className="inline-flex w-full grow items-center justify-end">
                <div className="inline-flex w-full max-w-96 justify-around px-8">
                    <Link
                        to="/"
                        className={cn(
                            'text-xl font-medium text-nowrap transition duration-200 hover:underline',
                            matchRoute({ to: '/', fuzzy: true }) &&
                                'font-semibold',
                        )}
                    >
                        Events
                    </Link>

                    <Link
                        to="/my-wallet"
                        className={cn(
                            'text-xl font-medium text-nowrap transition duration-200 hover:underline',
                            matchRoute({ to: '/my-wallet', fuzzy: false }) &&
                                'font-semibold',
                        )}
                    >
                        My Wallet
                    </Link>

                    <Link
                        to="/resources"
                        className={cn(
                            'text-xl font-medium text-nowrap transition duration-200 hover:underline',
                            matchRoute({ to: '/resources', fuzzy: true }) &&
                                'font-semibold',
                        )}
                    >
                        Resources
                    </Link>
                </div>
                <div className="inline-flex gap-8">
                    <Cart />
                    {<UserAvatar />}
                    <LoginButton />
                </div>
            </div>
        </div>
    );
};

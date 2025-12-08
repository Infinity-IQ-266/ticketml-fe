import { LogoIcon } from '@/assets/icons';
import { Link } from '@tanstack/react-router';
import { Menu as MenuIcon } from 'lucide-react';
import { useState } from 'react';

import { Cart, Menu } from '.';

export const HeaderMobile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className="relative z-40 inline-flex w-screen items-center border-b border-gray-light bg-white px-5 py-4 shadow-sm md:px-10 md:py-6">
                <Link
                    to="/"
                    className="inline-flex items-center transition-transform duration-200 hover:scale-105"
                >
                    <LogoIcon className="h-auto w-16 md:w-20" />
                    <p className="ms-3 hidden text-2xl font-bold text-nowrap text-black md:block md:text-4xl">
                        Ticket ML
                    </p>
                </Link>

                <div className="inline-flex w-full grow items-center justify-end">
                    <div className="inline-flex items-center gap-4 md:gap-6">
                        <Cart />
                        <button
                            className="rounded-lg p-2 transition-all duration-200 hover:bg-primary/20 hover:text-black active:scale-95"
                            aria-label="Menu"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <MenuIcon size={32} className="md:size-9" />
                        </button>
                    </div>
                </div>
            </div>

            <Menu open={isMenuOpen} onOpenChange={setIsMenuOpen} />
        </>
    );
};

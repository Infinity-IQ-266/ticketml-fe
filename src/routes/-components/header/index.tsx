import { LogoIcon } from '@/assets/icons';
import { ScreenSize } from '@/types';
import { Menu } from 'lucide-react';
import { useWindowSize } from 'usehooks-ts';

import { Cart, HeaderDesktop } from './components';

export const Header = () => {
    const { width } = useWindowSize();

    if (width > ScreenSize.XL) return <HeaderDesktop />;

    return (
        <div className="z-50 inline-flex w-screen items-center border-b-2 border-black px-5 py-4 md:px-10 md:py-6 2xl:px-20">
            <LogoIcon className="h-auto w-20 md:w-40" />
            <p className="ms-3 hidden text-4xl font-bold text-nowrap text-black md:block">
                Ticket ML
            </p>

            <div className="inline-flex w-full grow items-center justify-end">
                <div className="inline-flex items-center gap-4 md:gap-8">
                    <Cart />
                    <Menu size={36} className="hover:text-gray" />
                </div>
            </div>
        </div>
    );
};

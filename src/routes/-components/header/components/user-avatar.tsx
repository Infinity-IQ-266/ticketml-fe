import { UserIcon } from '@/assets/icons';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type RefObject, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export const UserAvatar = () => {
    const [isShowingDropdown, setIsShowingDropdown] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useOnClickOutside(ref as RefObject<HTMLDivElement>, () =>
        setIsShowingDropdown(false),
    );
    return (
        <div
            className="relative w-fit rounded-4xl border-2 border-black drop-shadow-xl"
            ref={ref}
        >
            <button
                className="inline-flex items-center justify-center rounded-4xl transition duration-200 hover:cursor-pointer hover:bg-black/10"
                type="button"
                title="User Avatar"
                onClick={() => setIsShowingDropdown((prev) => !prev)}
            >
                <div className="-ml-[2px] inline-flex size-14 items-center justify-center rounded-full border-2 border-black">
                    <UserIcon className="aspect-[34/38] h-auto w-8" />
                </div>
                <div className="inline-flex items-center justify-center px-2">
                    <p className="max-w-28 truncate text-xl font-semibold text-nowrap">
                        Khanh Tran
                    </p>
                    <ChevronDown
                        className={cn(
                            'ms-3 mt-1 text-black transition duration-200',
                            isShowingDropdown && 'rotate-180',
                        )}
                    />
                </div>
            </button>
            {isShowingDropdown && (
                <div className="animate-dropdown absolute top-full left-0 mt-3 flex w-full origin-top transform flex-col items-center overflow-hidden rounded-4xl border-2 border-black bg-white text-xl font-medium text-nowrap transition-all duration-300 ease-out">
                    <button
                        className="rounded-4x z-10 inline-flex w-full items-center justify-center px-3 py-2 text-xl font-medium text-nowrap transition duration-200 hover:cursor-pointer hover:bg-black/10"
                        type="button"
                        onClick={() =>
                            console.log('Switch to Organizer account')
                        }
                    >
                        <p className="truncate text-xl font-bold text-black/70">
                            NTPMM Orgz
                        </p>
                    </button>
                    <hr className="w-full border-t border-black" />

                    <button
                        className="rounded-4x z-10 inline-flex w-full items-center justify-center px-3 py-2 text-xl font-medium text-nowrap transition duration-200 hover:cursor-pointer hover:bg-black/10"
                        onClick={() => console.log('Login with Google OAuth')}
                    >
                        <p className="truncate text-xl font-bold text-black/70">
                            GENFEST Orgz
                        </p>
                    </button>

                    <hr className="w-full border-t border-black" />

                    <button
                        className="rounded-4x z-10 inline-flex w-full items-center justify-center px-3 py-2 text-xl font-medium text-nowrap transition duration-200 hover:cursor-pointer hover:bg-red/10"
                        type="button"
                        onClick={() => console.log('Login with Google OAuth')}
                    >
                        <p className="text-xl font-bold text-red">Log out</p>
                    </button>
                </div>
            )}
        </div>
    );
};

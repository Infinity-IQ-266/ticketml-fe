import { ShoppingCart } from 'lucide-react';

export const Cart = () => {
    return (
        <button className="group relative inline-flex size-11 items-center justify-center rounded-full border border-gray-light bg-white shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:shadow-md active:scale-95 md:size-14">
            <div className="absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary shadow-sm ring-2 ring-white md:-top-2 md:-right-2 md:size-6">
                <span className="absolute z-10 size-full animate-ping rounded-full bg-primary/50" />
                <p className="relative z-20 text-[10px] leading-none font-bold text-black md:text-xs">
                    6
                </p>
            </div>
            <ShoppingCart className="size-5 text-black transition-transform duration-200 group-hover:scale-110 md:size-6" />
        </button>
    );
};

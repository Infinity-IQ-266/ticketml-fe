import { ShoppingCart } from 'lucide-react';

export const Cart = () => {
    return (
        <button className="relative inline-flex size-10 items-center justify-center rounded-full border-2 border-black transition duration-200 hover:cursor-pointer hover:bg-black/10 md:size-14">
            <div className="absolute -top-2.5 -right-2.5 inline-flex size-5 items-center justify-center rounded-full bg-primary md:size-7">
                <span className="absolute z-10 size-full animate-ping rounded-full bg-primary/50" />
                <p className="z-0 font-medium">6</p>
            </div>
            <ShoppingCart className="text-black" />
        </button>
    );
};

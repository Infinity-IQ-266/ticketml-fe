import { LogoIcon } from '@/assets/icons';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';
import { SearchIcon, SlidersHorizontal } from 'lucide-react';

export const Header = () => {
    return (
        <div className="inline-flex flex-row px-20 py-6 items-center w-screen border-b-2 border-black">
            <LogoIcon className="w-20" />
            <p className="ms-3 text-4xl font-bold text-black">Ticket ML</p>
            <InputGroup className="border-black border rounded-md h-12 w-72 ms-16">
                <InputGroupInput
                    className="placeholder-black/50! !text-2xl flex text-black placeholder:text-2xl"
                    placeholder="Search"
                />
                <InputGroupAddon>
                    <SearchIcon className="text-black size-6" />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                    <InputGroupButton className="hover:bg-black/10! hover:cursor-pointer rounded-full h-full">
                        <SlidersHorizontal className="text-black size-6" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};

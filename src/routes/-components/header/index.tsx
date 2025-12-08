import { ScreenSize } from '@/types';
import { useWindowSize } from 'usehooks-ts';

import { HeaderDesktop, HeaderMobile } from './components';

export const Header = () => {
    const { width } = useWindowSize();

    if (width > ScreenSize.XL) return <HeaderDesktop />;

    return <HeaderMobile />;
};

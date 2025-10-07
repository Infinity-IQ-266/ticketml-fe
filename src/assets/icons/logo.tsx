type LogoIconProps = {
    className?: string;
};

export const LogoIcon = ({ className }: LogoIconProps) => {
    return (
        <svg
            viewBox="0 0 83 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M71.875 29.6875C71.875 25.03 76.411 21.25 82 21.25V17.875C82 4.375 77.95 1 61.75 1H21.25C5.05 1 1 4.375 1 17.875V19.5625C6.589 19.5625 11.125 23.3425 11.125 28C11.125 32.6575 6.589 36.4375 1 36.4375V38.125C1 51.625 5.05 55 21.25 55H61.75C77.95 55 82 51.625 82 38.125C76.411 38.125 71.875 34.345 71.875 29.6875Z"
                fill="#E2C6FF"
                stroke="#3C4247"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M29.6167 38.1852L33.517 34.8266L37.4173 31.468L53.4518 17.6003"
                fill="#E2C6FF"
            />
            <path
                d="M29.6167 38.1852L33.517 34.8266L37.4173 31.468L53.4518 17.6003"
                stroke="#3C4247"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path d="M53.6272 37.2812H53.6636H53.6272Z" fill="#E2C6FF" />
            <path
                d="M53.6272 37.2812H53.6636"
                stroke="#3C4247"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path d="M29.3281 18.7188H29.3638H29.3281Z" fill="#E2C6FF" />
            <path
                d="M29.3281 18.7188H29.3638"
                stroke="#3C4247"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
};

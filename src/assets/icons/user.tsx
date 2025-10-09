type UserIconProps = {
    className?: string;
};

export const UserIcon = ({ className }: UserIconProps) => {
    return (
        <svg
            viewBox="0 0 34 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M33 37V33C33 30.8783 32.1571 28.8434 30.6569 27.3431C29.1566 25.8429 27.1217 25 25 25H9C6.87827 25 4.84344 25.8429 3.34315 27.3431C1.84285 28.8434 1 30.8783 1 33V37"
                stroke="#3C4247"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.9998 17C21.418 17 24.9998 13.4183 24.9998 9C24.9998 4.58172 21.418 1 16.9998 1C12.5815 1 8.99976 4.58172 8.99976 9C8.99976 13.4183 12.5815 17 16.9998 17Z"
                fill="#E2C6FF"
                stroke="#3C4247"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export type MeData = {
    fullName: string;
    email: string;
    imageUrl: string | null;
    phoneNumber: string | null;
    address: string | null;
    role?: 'USER' | 'ADMIN';
};

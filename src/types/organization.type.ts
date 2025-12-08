export type Organization = {
    organizationId: string;
    name: string;
    description?: string;
    address?: string;
    logoUrl?: string;
    email?: string;
    phoneNumber?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
};

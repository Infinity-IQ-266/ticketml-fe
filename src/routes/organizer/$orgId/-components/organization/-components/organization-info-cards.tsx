import { Mail, MapPin, Phone } from 'lucide-react';

interface OrganizationInfoCardsProps {
    organization: {
        email: string;
        phoneNumber: string;
        address: string;
    };
}

export const OrganizationInfoCards = ({
    organization,
}: OrganizationInfoCardsProps) => {
    return (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {organization.email && (
                <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-white p-4 shadow-sm">
                    <div className="flex-shrink-0 rounded-lg bg-secondary/20 p-2">
                        <Mail className="size-5 text-secondary-darken" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray">Email</p>
                        <p className="text-sm font-semibold break-words text-black">
                            {organization.email}
                        </p>
                    </div>
                </div>
            )}
            {organization.phoneNumber && (
                <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-white p-4 shadow-sm">
                    <div className="flex-shrink-0 rounded-lg bg-primary/20 p-2">
                        <Phone className="size-5 text-primary-darken" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray">Phone</p>
                        <p className="text-sm font-semibold break-words text-black">
                            {organization.phoneNumber}
                        </p>
                    </div>
                </div>
            )}
            {organization.address && (
                <div className="flex items-center gap-3 rounded-lg border border-gray-light bg-white p-4 shadow-sm">
                    <div className="flex-shrink-0 rounded-lg bg-green/20 p-2">
                        <MapPin className="size-5 text-green-darken" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray">Address</p>
                        <p className="text-sm font-semibold break-words text-black">
                            {organization.address}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

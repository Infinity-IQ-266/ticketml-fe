import { Building2 } from 'lucide-react';

interface OrganizationHeaderProps {
    organization: {
        logoUrl: string;
        name: string;
        description: string;
    };
}

export const OrganizationHeader = ({
    organization,
}: OrganizationHeaderProps) => {
    return (
        <div className="flex items-start gap-4">
            {organization.logoUrl ? (
                <img
                    src={organization.logoUrl}
                    alt={organization.name}
                    className="size-16 rounded-xl border-2 border-black object-cover md:size-20"
                />
            ) : (
                <div className="flex size-16 items-center justify-center rounded-xl border-2 border-black bg-primary/20 md:size-20">
                    <Building2 className="size-8 text-primary-darken md:size-10" />
                </div>
            )}
            <div>
                <h1 className="text-2xl font-bold text-black md:text-4xl">
                    {organization.name}
                </h1>
                <p className="mt-1 text-sm text-gray md:text-base">
                    {organization.description}
                </p>
            </div>
        </div>
    );
};

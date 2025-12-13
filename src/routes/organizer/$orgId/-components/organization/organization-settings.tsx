import {
    getMyOrganizationsQueryKey,
    updateOrganizationMutation,
} from '@/services/client/@tanstack/react-query.gen';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface Organization {
    id: number;
    name: string;
    description: string;
    email: string;
    phoneNumber: string;
    address: string;
    logoUrl: string;
}

interface OrganizationSettingsProps {
    organization: Organization;
    orgId: string;
}

export const OrganizationSettings = ({
    organization,
    orgId,
}: OrganizationSettingsProps) => {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: organization.name,
        description: organization.description,
        email: organization.email,
        phoneNumber: organization.phoneNumber,
        address: organization.address,
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>(
        organization.logoUrl,
    );

    const updateOrganization = useMutation({
        ...updateOrganizationMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getMyOrganizationsQueryKey(),
            });
            toast.success('Organization settings saved successfully!');
            setLogoFile(null);
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update organization');
        },
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setLogoFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Create FormData for multipart/form-data request
        const body: {
            name?: string;
            description?: string;
            email?: string;
            phoneNumber?: string;
            address?: string;
            logo?: File;
        } = {
            name: formData.name,
            description: formData.description,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
        };

        // Only include logo if a new file was selected
        if (logoFile) {
            body.logo = logoFile;
        }

        updateOrganization.mutate({
            path: { orgId: Number(orgId) },
            body,
        });
    };

    return (
        <div className="rounded-xl border border-gray-light bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-black">
                Organization Settings
            </h2>
            <div className="space-y-4">
                {/* Logo, Organization Name, and Description Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    {/* Logo Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-black">
                            Organization Logo
                        </label>
                        {/* Logo Preview with Overlay Button */}
                        <div className="relative size-40 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gray-light">
                            {/* Background Image or Placeholder */}
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Organization logo"
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center bg-gray-light/20">
                                    <Image className="size-16 text-gray" />
                                </div>
                            )}

                            {/* Overlay Button */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 hover:bg-black/60 hover:opacity-100"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="size-6 text-white" />
                                    <span className="text-sm font-semibold text-white">
                                        {logoPreview
                                            ? 'Change Logo'
                                            : 'Upload Logo'}
                                    </span>
                                </div>
                            </button>
                        </div>
                        <p className="text-xs text-gray">
                            Max 5MB (JPG, PNG, GIF)
                        </p>
                    </div>

                    {/* Organization Name and Description */}
                    <div className="flex flex-1 flex-col gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Organization Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-black">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-black">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phoneNumber: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-black">
                        Address
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                address: e.target.value,
                            })
                        }
                        className="w-full rounded-lg border-2 border-gray-light px-4 py-3 text-black transition-colors focus:border-primary focus:outline-none"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={updateOrganization.isPending}
                    className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary-darken hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                >
                    {updateOrganization.isPending
                        ? 'Saving...'
                        : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

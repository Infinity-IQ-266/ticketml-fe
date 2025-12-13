import { useState } from 'react';
import { toast } from 'sonner';

interface Organization {
    name: string;
    description: string;
    email: string;
    phoneNumber: string;
    address: string;
}

interface OrganizationSettingsProps {
    organization: Organization;
}

export const OrganizationSettings = ({
    organization,
}: OrganizationSettingsProps) => {
    const [formData, setFormData] = useState({
        name: organization.name,
        description: organization.description,
        email: organization.email,
        phoneNumber: organization.phoneNumber,
        address: organization.address,
    });

    const handleSave = () => {
        // TODO: Implement save functionality when API is ready
        toast.success('Settings saved successfully');
        console.log('Saving organization settings:', formData);
    };

    return (
        <div className="rounded-xl border border-gray-light bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-black">
                Organization Settings
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-black">
                        Organization Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
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
                    className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary-darken hover:shadow-md md:w-auto"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

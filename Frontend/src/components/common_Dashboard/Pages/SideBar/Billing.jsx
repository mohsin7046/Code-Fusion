import { User, Bell, Shield, Globe } from 'lucide-react';

const settings = [
    {
        name: 'Profile Settings',
        description: 'Update your personal information and preferences',
        icon: User,
    },
    {
        name: 'Notifications',
        description: 'Configure how you receive alerts and updates',
        icon: Bell,
    },
    {
        name: 'Security',
        description: 'Manage your password and security settings',
        icon: Shield,
    },
    {
        name: 'Language & Region',
        description: 'Set your preferred language and timezone',
        icon: Globe,
    },
];

function Billing() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.map((setting) => {
                    const Icon = setting.icon;
                    return (
                        <div key={setting.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <Icon className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {setting.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">{setting.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Billing;

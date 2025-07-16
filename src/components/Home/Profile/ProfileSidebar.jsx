import React from "react";

const ProfileSidebar = ({ tabs, activeTab, setActiveTab }) => (
    <div className="sticky top-8 rounded-md bg-white">
        <nav className="space-y-2">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                            activeTab === tab.id
                                ? "border border-black bg-black text-white"
                                : "border border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    </div>
);

export default ProfileSidebar;

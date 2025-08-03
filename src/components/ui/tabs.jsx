import React, { useState } from "react";

export const Tabs = ({ defaultValue, children, className = "" }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <div className={`w-full ${className}`}>{React.Children.map(children, (child) => React.cloneElement(child, { activeTab, setActiveTab }))}</div>
    );
};

export const TabsList = ({ children, activeTab, setActiveTab, className = "" }) => {
    return (
        <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
            {React.Children.map(children, (child) => React.cloneElement(child, { activeTab, setActiveTab }))}
        </div>
    );
};

export const TabsTrigger = ({ value, children, activeTab, setActiveTab, className = "" }) => {
    const isActive = activeTab === value;

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            } ${className}`}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ value, children, activeTab, className = "" }) => {
    if (activeTab !== value) return null;

    return <div className={`mt-4 ${className}`}>{children}</div>;
};

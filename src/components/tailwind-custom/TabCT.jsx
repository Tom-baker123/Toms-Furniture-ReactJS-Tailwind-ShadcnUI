import React from "react";

const TabCT = ({ tabs, activeTab, setActiveTab, contentComponents }) => {
    return (
        <div>
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <ul
                    className="-mb-px flex flex-wrap text-center text-sm font-medium"
                    role="tablist"
                >
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            className="me-2"
                            role="presentation"
                        >
                            <button
                                className={`inline-flex items-center rounded-t-lg border-b-2 px-1.5 py-2 font-bold transition-colors ${
                                    activeTab === tab.id
                                        ? "cursor-pointer border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                                        : "cursor-pointer border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tab Content */}
            <div>{contentComponents[activeTab] || <div>Content not found</div>}</div>
        </div>
    );
};

export default TabCT;

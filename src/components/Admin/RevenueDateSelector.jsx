import React, { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";

const RevenueDateSelector = ({ onDateRangeChange, loading }) => {
    const [selectedPeriod, setSelectedPeriod] = useState("30days");

    const periods = [
        { value: "7days", label: "7 Ngày", days: 7 },
        { value: "30days", label: "30 Ngày", days: 30 },
        { value: "currentMonth", label: "Tháng Này", isCurrentMonth: true },
        { value: "currentYear", label: "Năm Này", isCurrentYear: true },
    ];

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period.value);
        onDateRangeChange(period);
    };

    return (
        <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Calendar
                    size={20}
                    className="text-gray-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Khoảng Thời Gian:</span>
            </div>

            <div className="flex gap-2">
                {periods.map((period) => (
                    <button
                        key={period.value}
                        onClick={() => handlePeriodChange(period)}
                        disabled={loading}
                        className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                            selectedPeriod === period.value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                        {loading && selectedPeriod === period.value && (
                            <RefreshCw
                                size={14}
                                className="mr-1 inline animate-spin"
                            />
                        )}
                        {period.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RevenueDateSelector;

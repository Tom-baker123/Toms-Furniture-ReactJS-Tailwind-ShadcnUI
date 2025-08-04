import React, { useState } from "react";
import {
    getRevenue,
    getDailyRevenue,
    getWeeklyRevenue,
    getMonthlyRevenue,
    getYearlyRevenue,
    getCurrentMonthRevenue,
    getCurrentYearRevenue,
    getLastSevenDaysRevenue,
    getLastThirtyDaysRevenue,
} from "@/api/service/RevenueService";

const RevenueAPITest = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testAPI = async (apiFunction, description) => {
        setLoading(true);
        setError(null);
        try {
            console.log(`Testing: ${description}`);
            const response = await apiFunction();
            setResult({ description, response });
            console.log(`Success:`, response);
        } catch (err) {
            setError({ description, error: err.message });
            console.error(`Error:`, err);
        } finally {
            setLoading(false);
        }
    };

    const testCustomRange = async () => {
        setLoading(true);
        setError(null);
        try {
            const startDate = "2025-01-01";
            const endDate = "2025-08-05";
            const response = await getDailyRevenue(startDate, endDate);
            setResult({ description: `Custom Range: ${startDate} to ${endDate}`, response });
        } catch (err) {
            setError({ description: "Custom Range", error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl p-6">
            <h2 className="mb-6 text-2xl font-bold">Kiểm Tra API Doanh Thu</h2>

            <div className="mb-6 grid grid-cols-2 gap-4">
                <button
                    onClick={() => testAPI(getLastSevenDaysRevenue, "7 Ngày Qua")}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    disabled={loading}
                >
                    Kiểm Tra 7 Ngày Qua
                </button>

                <button
                    onClick={() => testAPI(getLastThirtyDaysRevenue, "30 Ngày Qua")}
                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    disabled={loading}
                >
                    Kiểm Tra 30 Ngày Qua
                </button>

                <button
                    onClick={() => testAPI(getCurrentMonthRevenue, "Tháng Hiện Tại")}
                    className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                    disabled={loading}
                >
                    Kiểm Tra Tháng Hiện Tại
                </button>

                <button
                    onClick={() => testAPI(getCurrentYearRevenue, "Năm Hiện Tại")}
                    className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                    disabled={loading}
                >
                    Kiểm Tra Năm Hiện Tại
                </button>

                <button
                    onClick={testCustomRange}
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    disabled={loading}
                >
                    Kiểm Tra Khoảng Tùy Chỉnh
                </button>
            </div>

            {loading && (
                <div className="py-4 text-center">
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            )}

            {error && (
                <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    <h3 className="font-bold">{error.description} - Lỗi:</h3>
                    <p>{error.error}</p>
                </div>
            )}

            {result && (
                <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                    <h3 className="font-bold">{result.description} - Thành Công:</h3>
                    <div className="mt-2">
                        <p>
                            <strong>Tổng Doanh Thu Ròng:</strong> ${result.response.totalNetRevenue}
                        </p>
                        <p>
                            <strong>Tổng Đơn Hàng Đã Thanh Toán:</strong> {result.response.totalPaidOrderCount}
                        </p>
                        <p>
                            <strong>Tổng Giảm Giá:</strong> ${result.response.totalDiscountAmount}
                        </p>
                        <p>
                            <strong>Điểm Dữ Liệu:</strong> {result.response.dataPoints.length}
                        </p>
                    </div>
                    <details className="mt-4">
                        <summary className="cursor-pointer font-semibold">Xem Phản Hồi Raw</summary>
                        <pre className="mt-2 overflow-auto rounded bg-gray-800 p-4 text-sm text-white">
                            {JSON.stringify(result.response, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
};

export default RevenueAPITest;

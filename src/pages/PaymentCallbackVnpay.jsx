import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePayment } from "../context/PaymentContext";
import toast from "react-hot-toast";

const PaymentCallbackVnpay = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleVnpayCallback } = usePayment();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const processCallback = async () => {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
                // Lấy query params từ URL (bỏ dấu ? đầu tiên)
                const queryParams = location.search.startsWith("?") ? location.search.substring(1) : location.search;
                // Gọi API xử lý callback qua context
                const response = await handleVnpayCallback(queryParams);
                // Xử lý response mới từ backend (backend trả về { Message: ... } nếu thành công, lỗi trả về 400)
                if (response && (response.Message || response.message)) {
                    setResult(response);
                    toast.success("Payment processed successfully!");
                } else {
                    setError(response?.message || response?.error || "Payment failed!");
                    toast.error("Payment processing failed!");
                }
            } catch (err) {
                // Nếu gọi API bị lỗi (ví dụ backend trả về 400)
                setError(err?.message || err?.error || "Payment processing failed");
                toast.error("Payment processing failed!");
            } finally {
                setLoading(false);
            }
        };
        processCallback();
    }, [location.search, handleVnpayCallback]);

    // Đếm ngược và tự động chuyển trang sau 3s khi đã xử lý xong (không loading)
    useEffect(() => {
        if (!loading) {
            setCountdown(3);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate("/", { replace: true });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [loading, navigate]);

    if (loading) {
        return (
            <div className="container-custom flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <h2 className="mb-2 text-xl font-semibold">Processing Payment...</h2>
                    <p className="text-gray-600">Please wait while we confirm your payment</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
                {error ? (
                    <>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <svg
                                className="h-8 w-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Failed</h2>
                        <p className="mb-6 text-gray-600">{error}</p>
                    </>
                ) : (
                    <>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <svg
                                className="h-8 w-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Successful!</h2>
                        <p className="mb-6 text-gray-600">Your payment has been processed successfully.</p>
                        {result && (
                            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
                                <h3 className="mb-2 font-semibold">Transaction Details:</h3>
                                <pre className="text-sm whitespace-pre-wrap text-gray-600">{JSON.stringify(result, null, 2)}</pre>
                            </div>
                        )}
                    </>
                )}

                <p className="mb-4 text-sm text-gray-500">
                    You will be redirected to homepage in {countdown} second{countdown !== 1 ? "s" : ""}...
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                    Return to Homepage
                </button>
            </div>
        </div>
    );
};

export default PaymentCallbackVnpay;

import React, { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePayment } from "@/context/PaymentContext";
import FormatDatetime from "@/hooks/FormatDatetime";

const ProfileOrdersTab = () => {
    const { authStatus } = useAuth();
    const { fetchOrdersByUser } = usePayment();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    // Lấy danh sách đơn hàng khi component mount
    useEffect(() => {
        const loadOrders = async () => {
            if (authStatus?.userId) {
                try {
                    setLoading(true);
                    const orderData = await fetchOrdersByUser(authStatus.userId);
                    setOrders(Array.isArray(orderData) ? orderData : []);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    setOrders([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadOrders();
    }, [authStatus?.userId, fetchOrdersByUser]);

    // Toggle mở/đóng dropdown chi tiết đơn hàng
    const toggleOrderDetails = (orderId) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Lấy status badge color
    const getStatusBadge = (paymentStatus, isPaid) => {
        if (paymentStatus === "Paid" || isPaid) {
            return "bg-green-100 text-green-800";
        } else {
            return "bg-yellow-100 text-yellow-800";
        }
    };

    // Lấy text status
    const getStatusText = (paymentStatus, isPaid) => {
        if (paymentStatus === "Paid" || isPaid) {
            return "Đã thanh toán";
        } else {
            return "Chưa thanh toán";
        }
    };

    if (loading) {
        return (
            <div>
                <h2 className="mb-3 text-2xl font-bold text-black">Order History</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="animate-pulse rounded-xl border border-gray-200 p-6"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
                                <div className="flex-1">
                                    <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
                                    <div className="h-3 w-24 rounded bg-gray-200"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-3 text-2xl font-bold text-black">Order History</h2>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="py-8 text-center">
                        <Package className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-xl border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                        <Package className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Order #{order.id.toString().padStart(3, "0")}</h3>
                                        <p className="text-sm text-gray-500">Đặt hàng vào {FormatDatetime(order.createdDate)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-xs ${getStatusBadge(order.paymentStatus, order.isPaid)}`}
                                    >
                                        {getStatusText(order.paymentStatus, order.isPaid)}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-600">
                                        {order.orderDetails?.length || 0} sản phẩm
                                        {order.note && ` • Ghi chú: ${order.note}`}
                                    </p>
                                    <button
                                        onClick={() => toggleOrderDetails(order.id)}
                                        className="flex items-center space-x-1 text-blue-600 transition-colors hover:text-blue-800"
                                    >
                                        <span className="text-sm">Chi tiết</span>
                                        {expandedOrders.has(order.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Dropdown chi tiết sản phẩm */}
                                {expandedOrders.has(order.id) && (
                                    <div className="mt-4 space-y-3 border-t pt-4">
                                        {order.orderDetails?.map((detail, index) => (
                                            <div
                                                key={detail.id || index}
                                                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">Sản phẩm #{detail.proVarId}</p>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <p>Số lượng: {detail.quantity}</p>
                                                        <p>Giá: {formatPrice(detail.price)}</p>
                                                        {detail.productVariant && (
                                                            <div className="text-xs text-gray-500">
                                                                <p>Giá gốc: {formatPrice(detail.productVariant.originalPrice)}</p>
                                                                <p>Còn lại: {detail.productVariant.stockQty} sản phẩm</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">{formatPrice(detail.price * detail.quantity)}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.shippingPrice > 0 && (
                                            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                                <p className="text-gray-700">Phí vận chuyển</p>
                                                <p className="font-medium text-gray-900">{formatPrice(order.shippingPrice)}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfileOrdersTab;

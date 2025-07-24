import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import { MoveLeft, Printer } from "lucide-react";
import { useAPIOrder } from "@/context/APIOrderContext";

const OrderDetailsForm = () => {
    const orderData = useLoaderData();
    const navigate = useNavigate();
    const { handleUpdateOrderStatus, orderStatuses, loading, error } = useAPIOrder();

    const order = orderData || {};
    const { fetchAllOrderStatuses } = useAPIOrder();

    // Lấy id trạng thái hiện tại dựa vào orderStatusName
    const getCurrentStatusId = () => {
        if (!order || !order.orderStatusName || !orderStatuses) return "";
        const found = orderStatuses.find((status) => status.orderStatusName === order.orderStatusName);
        return found ? found.id : "";
    };
    const [selectedStatusId, setSelectedStatusId] = useState(getCurrentStatusId());

    // Luôn fetch danh sách trạng thái khi mount
    useEffect(() => {
        fetchAllOrderStatuses();
        // eslint-disable-next-line
    }, []);

    // Khi order hoặc orderStatuses thay đổi, cập nhật selectedStatusId
    useEffect(() => {
        setSelectedStatusId(getCurrentStatusId());
        // eslint-disable-next-line
    }, [order.orderStatusName, orderStatuses]);

    // Xử lý cập nhật trạng thái đơn hàng
    const handleStatusUpdate = async () => {
        if (!selectedStatusId) {
            alert("Vui lòng chọn trạng thái mới!");
            return;
        }
        try {
            const result = await handleUpdateOrderStatus(order.id, selectedStatusId);
            alert("Cập nhật trạng thái thành công!");
            navigate(0); // Tải lại trang để cập nhật dữ liệu
        } catch (err) {
            alert("Lỗi khi cập nhật trạng thái: " + (err.message || "Vui lòng thử lại"));
        }
    };

    return (
        <div className="">
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/order")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Quay lại
                </button>
            </div>

            <div className="flex flex-col gap-y-6">
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">Đơn Hàng #{order.id || "--"}</div>
                    <button
                        className="flex cursor-pointer gap-x-2 rounded-md bg-gray-300 px-3 py-2.5 font-semibold transition-all hover:text-blue-700"
                        onClick={() => {}}
                    >
                        <Printer />
                        <span>In hóa đơn</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Cột trái - Thông tin đơn hàng */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Sản phẩm trong đơn hàng */}
                        <div className="rounded-lg border bg-white">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-900">Sản phẩm trong đơn hàng</h3>
                            </div>
                            <div className="overflow-hidden">
                                {order.orderDetails && Array.isArray(order.orderDetails) && order.orderDetails.length > 0 ? (
                                    <>
                                        <div className="hidden md:block">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                            Số lượng
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                            Thành tiền
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {order.orderDetails.map((item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="flex-shrink-0">
                                                                        <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-gray-100">
                                                                            {item.productVariant?.images?.length > 0 ? (
                                                                                <img
                                                                                    className="h-10 w-10 rounded object-cover"
                                                                                    src={item.productVariant.images[0]}
                                                                                    alt={item.productVariant.colorName || "Sản phẩm"}
                                                                                    loading="lazy"
                                                                                    onError={(e) => {
                                                                                        e.target.style.display = "none";
                                                                                        e.target.nextSibling.style.display = "flex";
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-400">
                                                                                    IMG
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="truncate text-sm font-medium text-gray-900">
                                                                            {item.productVariant?.colorName || "Tên sản phẩm không có"}
                                                                            {item.productVariant?.sizeName
                                                                                ? ` - ${item.productVariant.sizeName}`
                                                                                : ""}
                                                                            {item.productVariant?.materialName
                                                                                ? ` - ${item.productVariant.materialName}`
                                                                                : ""}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">SKU: {item.proVarId || "--"}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center text-sm text-gray-900">
                                                                {item.price ? `${item.price.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                                                                    {item.quantity || 0}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                                                {item.price && item.quantity
                                                                    ? `${(item.price * item.quantity).toLocaleString("vi-VN")} ₫`
                                                                    : "0 ₫"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                    <tr>
                                                        <td
                                                            colSpan="3"
                                                            className="px-4 py-3 text-right text-sm font-medium text-gray-900"
                                                        >
                                                            Tổng cộng:
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                                                            {order.total ? `${order.total.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        {/* Mobile view */}
                                        <div className="divide-y divide-gray-200 md:hidden">
                                            {order.orderDetails.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="flex h-16 w-16 items-center justify-center rounded-md border bg-gray-100">
                                                                {item.productVariant?.images?.length > 0 ? (
                                                                    <img
                                                                        className="h-14 w-14 rounded object-cover"
                                                                        src={item.productVariant.images[0]}
                                                                        alt={item.productVariant.colorName || "Sản phẩm"}
                                                                        loading="lazy"
                                                                        onError={(e) => {
                                                                            e.target.style.display = "none";
                                                                            e.target.nextSibling.style.display = "flex";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-14 w-14 items-center justify-center rounded bg-gray-200 text-xs text-gray-400">
                                                                        IMG
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item.productVariant?.colorName || "Tên sản phẩm không có"}
                                                                {item.productVariant?.sizeName ? ` - ${item.productVariant.sizeName}` : ""}
                                                                {item.productVariant?.materialName ? ` - ${item.productVariant.materialName}` : ""}
                                                            </p>
                                                            <p className="mb-2 text-xs text-gray-500">SKU: {item.proVarId || "--"}</p>
                                                            <div className="flex justify-between text-sm">
                                                                <span>Đơn giá: {item.price ? `${item.price.toLocaleString("vi-VN")} ₫` : "0 ₫"}</span>
                                                                <span>SL: {item.quantity || 0}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {item.price && item.quantity
                                                                        ? `${(item.price * item.quantity).toLocaleString("vi-VN")} ₫`
                                                                        : "0 ₫"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="bg-gray-50 p-4">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-900">Tổng cộng:</span>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {order.total ? `${order.total.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <p>Không có sản phẩm trong đơn hàng</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Thông tin đơn hàng */}
                        <div className="rounded-lg border bg-white">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h3>
                            </div>
                            <div className="space-y-4 p-4">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                                    <div className="flex flex-col justify-between">
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">ID đơn hàng</span>
                                            <span className="text-sm font-medium text-gray-900">#{order.id || "--"}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            {order.isUserGuest == false ? (
                                                <>
                                                    <span className="text-sm text-gray-600">Tên khách hàng</span>
                                                    <span className="text-sm font-medium text-gray-900">{order.userName || "--"}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-sm text-gray-600">Tên khách vãng lai</span>
                                                    <span className="text-sm font-medium text-gray-900">{order.userGuestFullName || "--"}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">Khách vãng lai</span>
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-medium ${order.isUserGuest ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                                            >
                                                {order.isUserGuest ? "Có" : "Không"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">Trạng thái</span>
                                            <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                                {order.orderStatusName || "--"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">Trạng thái thanh toán</span>
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-medium ${order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                            >
                                                {order.paymentStatus || (order.isPaid ? "Đã thanh toán" : "Chưa thanh toán")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col ">
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">Ngày cập nhật</span>
                                            <span className="text-sm text-gray-900">
                                                {order.updatedDate ? new Date(order.updatedDate).toLocaleString("vi-VN") : "--"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">Phương thức thanh toán</span>
                                            <span className="text-sm text-gray-900">
                                                {order.paymentMethodId === 1
                                                    ? "Tiền mặt"
                                                    : order.paymentMethodId === 2
                                                      ? "Chuyển khoản"
                                                      : order.paymentMethodId || "--"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">Phí vận chuyển</span>
                                            <span className="text-sm text-gray-900">
                                                {order.shippingPrice ? `${order.shippingPrice.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">Tổng tiền</span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {order.total ? `${order.total.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                            </span>
                                        </div>
                                    </div>

                                    {order.note && (
                                        <div className="mt-4 border-t pt-4 md:col-span-2">
                                            <div className="flex justify-between py-1">
                                                <span className="text-sm text-gray-600">Ghi chú</span>
                                                <span className="text-sm text-gray-900">{order.note}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Cột phải - Sidebar */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Hành động */}
                        <div className="rounded-lg border bg-white">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-900">Cập nhật trạng thái đơn hàng</h3>
                            </div>
                            <div className="space-y-3 p-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chọn trạng thái mới</label>
                                    <select
                                        value={selectedStatusId}
                                        onChange={(e) => setSelectedStatusId(Number(e.target.value))}
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        {orderStatuses && orderStatuses.length > 0 ? (
                                            orderStatuses.map((status) => (
                                                <option
                                                    key={status.id}
                                                    value={status.id}
                                                >
                                                    {status.orderStatusName}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">Không có trạng thái</option>
                                        )}
                                    </select>
                                </div>
                                {loading && <p className="text-sm text-gray-500">Đang cập nhật...</p>}
                                {error && <p className="text-sm text-red-500">Lỗi: {error}</p>}
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={loading || !selectedStatusId}
                                    className={`w-full rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors ${
                                        loading || !selectedStatusId ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    Cập nhật trạng thái
                                </button>
                            </div>
                        </div>
                        {/* Thông tin bổ sung */}
                        <div className="rounded-lg border bg-white">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-900">Thông tin bổ sung</h3>
                            </div>
                            <div className="space-y-3 p-4">
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Order Status ID</span>
                                    <span className="text-sm text-gray-900">{order.orderStaId || "--"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Order Address ID</span>
                                    <span className="text-sm text-gray-900">{order.orderAddId || "--"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Promotion ID</span>
                                    <span className="text-sm text-gray-900">{order.promotionId || "--"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Người tạo</span>
                                    <span className="text-sm text-gray-900">{order.createdBy || "--"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Người cập nhật</span>
                                    <span className="text-sm text-gray-900">{order.updatedBy || "--"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Ngày tạo</span>
                                    <span className="text-sm text-gray-900">
                                        {order.createdDate ? new Date(order.createdDate).toLocaleString("vi-VN") : "--"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsForm;

import React from "react";
// import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { MoveLeft, Printer } from "lucide-react";

const OrderDetailsForm = () => {
    const OrderDetailResponse = useLoaderData();
    const navigate = useNavigate();
    const orderData = useLoaderData();
    // Chỉ hiển thị dữ liệu, không cho sửa, không submit
    const order = orderData || {};

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
                    <div className="title text-2xl font-bold text-slate-800">Chi Tiết Đơn Hàng</div>
                    <button
                        className="flex gap-x-2 hover:text-blue-700 cursor-pointer transition-all rounded-md bg-gray-300 px-3 py-2.5 font-semibold"
                        onClick={() => {}}
                    >
                        <Printer />
                        <span>In hóa đơn</span>
                    </button>
                </div>

                {/* Layout chính theo kiểu Haravan */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Cột trái - Thông tin đơn hàng */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Thông tin đơn hàng */}
                        <div className="rounded-lg border bg-white">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h3>
                            </div>
                            <div className="space-y-4 p-4">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">ID đơn hàng</span>
                                        <span className="text-sm font-medium text-gray-900">#{order.id || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">User ID</span>
                                        <span className="text-sm text-gray-900">{order.userId || "N/A"}</span>
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
                                        <span className="text-sm text-gray-600">ID khách vãng lai</span>
                                        <span className="text-sm text-gray-900">{order.userGuestId || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">Trạng thái</span>
                                        <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                            {order.orderStatusName || "N/A"}
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
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">Tên khách hàng</span>
                                        <span className="text-sm text-gray-900">{order.customerName || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">Số điện thoại</span>
                                        <span className="text-sm text-gray-900">{order.phone || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between py-1 md:col-span-2">
                                        <span className="text-sm text-gray-600">Địa chỉ</span>
                                        <span className="text-right text-sm text-gray-900">{order.address || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">Tổng tiền</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {order.total ? `${order.total.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">Phí vận chuyển</span>
                                        <span className="text-sm text-gray-900">
                                            {order.shippingPrice ? `${order.shippingPrice.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">Phương thức thanh toán</span>
                                        <span className="text-sm text-gray-900">
                                            {order.paymentMethodId === 1
                                                ? "Tiền mặt"
                                                : order.paymentMethodId === 2
                                                  ? "Chuyển khoản"
                                                  : order.paymentMethodId || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">Ngày cập nhật</span>
                                        <span className="text-sm text-gray-900">
                                            {order.updatedDate ? new Date(order.updatedDate).toLocaleString("vi-VN") : "N/A"}
                                        </span>
                                    </div>
                                </div>
                                {order.note && (
                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-gray-600">Ghi chú</span>
                                            <span className="text-sm text-gray-900">{order.note}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

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
                                                                            {item.productImage || item.image ? (
                                                                                <img
                                                                                    className="h-10 w-10 rounded object-cover"
                                                                                    src={item.productImage || item.image}
                                                                                    alt={item.productName || item.name || "Sản phẩm"}
                                                                                    loading="lazy"
                                                                                    onError={(e) => {
                                                                                        e.target.style.display = "none";
                                                                                        e.target.nextSibling.style.display = "flex";
                                                                                    }}
                                                                                />
                                                                            ) : null}
                                                                            <div
                                                                                className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-400"
                                                                                style={{ display: item.productImage || item.image ? "none" : "flex" }}
                                                                            >
                                                                                IMG
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="truncate text-sm font-medium text-gray-900">
                                                                            {item.productName || item.name || "Tên sản phẩm không có"}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            SKU: {item.productId || item.id || "N/A"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center text-sm text-gray-900">
                                                                {item.price ? `${item.price.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
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
                                                                {item.productImage || item.image ? (
                                                                    <img
                                                                        className="h-14 w-14 rounded object-cover"
                                                                        src={item.productImage || item.image}
                                                                        alt={item.productName || item.name || "Sản phẩm"}
                                                                        loading="lazy"
                                                                        onError={(e) => {
                                                                            e.target.style.display = "none";
                                                                            e.target.nextSibling.style.display = "flex";
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <div
                                                                    className="flex h-14 w-14 items-center justify-center rounded bg-gray-200 text-xs text-gray-400"
                                                                    style={{ display: item.productImage || item.image ? "none" : "flex" }}
                                                                >
                                                                    IMG
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item.productName || item.name || "Tên sản phẩm không có"}
                                                            </p>
                                                            <p className="mb-2 text-xs text-gray-500">SKU: {item.productId || item.id || "N/A"}</p>
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
                    </div>

                    {/* Cột phải - Sidebar */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Hành động */}
                        <div className="rounded-lg border bg-white">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-900">Cập nhật trạng thái đơn hàng</h3>
                            </div>
                            <div className=""></div>
                            <div className="space-y-3 p-4">
                                <button className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                                    Cập nhật đơn hàng
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
                                    <span className="text-sm text-gray-900">{order.orderStaId || "N/A"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Order Address ID</span>
                                    <span className="text-sm text-gray-900">{order.orderAddId || "N/A"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Promotion ID</span>
                                    <span className="text-sm text-gray-900">{order.promotionId || "N/A"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Người tạo</span>
                                    <span className="text-sm text-gray-900">{order.createdBy || "N/A"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Người cập nhật</span>
                                    <span className="text-sm text-gray-900">{order.updatedBy || "N/A"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Ngày tạo</span>
                                    <span className="text-sm text-gray-900">
                                        {order.createdDate ? new Date(order.createdDate).toLocaleString("vi-VN") : "N/A"}
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

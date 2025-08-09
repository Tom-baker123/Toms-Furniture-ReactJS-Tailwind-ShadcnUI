import React, { useState, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import FormatDatetime from "@/hooks/FormatDatetime";
import { Pen, Pencil, Trash, Filter } from "lucide-react";
import { useAPIOrder } from "@/context/APIOrderContext";

const OrderManagement = () => {
    const navigate = useNavigate();
    const orders = useLoaderData() || [];
    const { handleCancelOrder, loading } = useAPIOrder();
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [filterType, setFilterType] = useState("all"); // "all", "cancellable", "non-cancellable"

    // Lọc orders dựa vào filterType
    const filteredOrders = useMemo(() => {
        switch (filterType) {
            case "cancellable":
                return orders.filter((order) => order.orderStaId === 1);
            case "non-cancellable":
                return orders.filter((order) => order.orderStaId !== 1);
            default:
                return orders;
        }
    }, [orders, filterType]);

    // Xử lý hủy đơn hàng
    const handleCancelClick = async (orderId) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            try {
                setCancellingOrderId(orderId);
                await handleCancelOrder(orderId);
                alert("Hủy đơn hàng thành công!");
                // Reload lại trang để cập nhật dữ liệu
                window.location.reload();
            } catch (error) {
                alert("Lỗi khi hủy đơn hàng: " + (error.message || "Vui lòng thử lại"));
            } finally {
                setCancellingOrderId(null);
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Order Management</div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 rounded-sm bg-white p-4 shadow-xs">
                <div className="flex items-center gap-2">
                    <Filter
                        size={20}
                        className="text-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType("all")}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            filterType === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Tất cả ({orders.length})
                    </button>
                    <button
                        onClick={() => setFilterType("cancellable")}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            filterType === "cancellable" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Chưa duyệt ({orders.filter((order) => order.orderStaId === 1).length})
                    </button>
                    <button
                        onClick={() => setFilterType("non-cancellable")}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            filterType === "non-cancellable" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Đã duyệt ({orders.filter((order) => order.orderStaId !== 1).length})
                    </button>   
                </div>
            </div>

            <div className="card overflow-hidden rounded-sm bg-white shadow-xs">
                <div className="card-header">
                    <div className="card-title text-lg font-bold text-slate-800">
                        {filterType === "all" && "Tất cả đơn hàng"}
                        {filterType === "cancellable" && "Đơn hàng có thể hủy"}
                        {filterType === "non-cancellable" && "Đơn hàng không thể hủy"}
                        <span className="ml-2 text-sm font-normal text-gray-500">({filteredOrders.length} đơn hàng)</span>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full text-sm">
                            <thead className="table-header bg-gray-50">
                                <tr className="table-row">
                                    <th className="table-head px-4 py-2 whitespace-nowrap">#</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">User Name</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Total</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Status</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Payment Status</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Order Status</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Created Date</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-8 text-center text-gray-500"
                                        >
                                            {filterType === "all" && "Không có đơn hàng nào"}
                                            {filterType === "cancellable" && "Không có đơn hàng nào có thể hủy"}
                                            {filterType === "non-cancellable" && "Không có đơn hàng nào không thể hủy"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order, index) => (
                                        <tr
                                            key={order.id}
                                            className="table-row hover:bg-gray-50"
                                        >
                                            <td className="table-cell px-4 py-2">{order.id}</td>
                                            <td className="table-cell px-4 py-2">{order.userName}</td>
                                            <td className="table-cell px-4 py-2">{order.total?.toLocaleString() || 0}</td>
                                            <td className="table-cell px-4 py-2">
                                                {order.isActive ? (
                                                    <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Active</div>
                                                ) : (
                                                    <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Inactive</div>
                                                )}
                                            </td>
                                            <td className="table-cell px-4 py-2">
                                                {order.paymentStatus === "Paid" ? (
                                                    <div className="w-fit rounded-full bg-green-100 px-5 py-1 text-sm text-green-700">Paid</div>
                                                ) : order.paymentStatus === "Processing" ? (
                                                    <div className="w-fit rounded-full bg-yellow-100 px-5 py-1 text-sm text-yellow-700">
                                                        Processing
                                                    </div>
                                                ) : (
                                                    <div className="w-fit rounded-full bg-gray-100 px-5 py-1 text-sm text-gray-700">
                                                        {order.paymentStatus}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="table-cell px-4 py-2">
                                                {order?.orderStatusName ? (
                                                    <div className="w-fit rounded-full bg-blue-100 px-5 py-1 text-sm text-blue-700">
                                                        {order?.orderStatusName}
                                                    </div>
                                                ) : (
                                                    <div className="w-fit rounded-full bg-gray-100 px-5 py-1 text-sm text-gray-700">N/A</div>
                                                )}
                                            </td>
                                            <td className="table-cell px-4 py-2">{FormatDatetime(order.createdDate) || "N/A"}</td>
                                            <td className="table-cell px-4 py-2">
                                                <div className="flex items-center gap-x-2">
                                                    {/* Thêm các nút actions nếu cần */}
                                                    <button
                                                        className="flex cursor-pointer items-center gap-x-1 border-r pr-2 whitespace-nowrap text-blue-500 hover:text-blue-700"
                                                        onClick={() => navigate("/admin/order/edit_order/" + order.id)}
                                                    >
                                                        <Pencil size={16} />
                                                        Xem
                                                    </button>
                                                    {/* Thêm các nút actions nếu cần */}
                                                    {order.orderStaId === 1 && (
                                                        <button
                                                            className="flex cursor-pointer items-center gap-x-1 pr-1 whitespace-nowrap text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                            onClick={() => handleCancelClick(order.id)}
                                                            disabled={cancellingOrderId === order.id}
                                                        >
                                                            <Trash size={16} />
                                                            {cancellingOrderId === order.id ? "Đang hủy..." : "Hủy đơn"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;

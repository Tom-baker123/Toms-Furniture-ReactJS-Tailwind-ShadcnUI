import React, { useState, useMemo } from "react";
import { PencilLine, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteOrderStatus } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

const OrderStatusManagement = () => {
    const orderStatuses = useLoaderData();
    const navigate = useNavigate();

    // State để quản lý sắp xếp
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this order status?")) {
            try {
                await deleteOrderStatus(id);
                toast.success("Order status deleted successfully!");
                navigate(0); // Reload trang
            } catch (error) {
                toast.error(`Error deleting order status: ${error.message}`);
            }
        }
    };

    // Hàm xử lý sắp xếp
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Hàm sắp xếp dữ liệu
    const sortedOrderStatuses = useMemo(() => {
        if (!sortConfig.key) return orderStatuses;

        return [...orderStatuses].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Xử lý đặc biệt cho từng loại dữ liệu
            switch (sortConfig.key) {
                case "id":
                    aVal = Number(aVal);
                    bVal = Number(bVal);
                    break;
                case "orderStatusName":
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();
                    break;
                case "isActive":
                    aVal = aVal ? 1 : 0;
                    bVal = bVal ? 1 : 0;
                    break;
                case "createdDate":
                case "updatedDate":
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                    break;
                default:
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();
            }

            if (aVal < bVal) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aVal > bVal) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [orderStatuses, sortConfig]);

    // Component cho header có thể sắp xếp
    const SortableHeader = ({ children, sortKey, className = "" }) => {
        const isActive = sortConfig.key === sortKey;
        const direction = sortConfig.direction;

        return (
            <th
                className={`table-head cursor-pointer whitespace-nowrap transition-all select-none hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
                onClick={() => handleSort(sortKey)}
            >
                <div className="flex items-center justify-between">
                    <span>{children}</span>
                    <div className="ml-1 flex flex-col">
                        <ChevronUp
                            size={15}
                            className={`stroke-3 ${isActive && direction === "asc" ? "text-blue-600" : "text-gray-400"}`}
                        />
                        <ChevronDown
                            size={15}
                            className={`stroke-3 ${isActive && direction === "desc" ? "text-blue-600" : "text-gray-400"} -mt-1`}
                        />
                    </div>
                </div>
            </th>
        );
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
                <div className="title">Order Status Management</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    onClick={() => navigate("/admin/order_status/new_order_status")}
                >
                    Add Order Status
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Order Statuses</div>
                    {sortConfig.key && (
                        <div className="text-sm text-gray-500">
                            Sorted by {sortConfig.key} ({sortConfig.direction === "asc" ? "ascending" : "descending"})
                        </div>
                    )}
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <SortableHeader sortKey="id">#</SortableHeader>
                                    <SortableHeader sortKey="orderStatusName">Order Status Name</SortableHeader>
                                    <SortableHeader sortKey="isActive">Status</SortableHeader>
                                    <SortableHeader sortKey="createdDate">Created Date</SortableHeader>
                                    <SortableHeader sortKey="updatedDate">Updated Date</SortableHeader>
                                    <SortableHeader sortKey="createdBy">Created By</SortableHeader>
                                    <SortableHeader sortKey="updatedBy">Updated By</SortableHeader>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {sortedOrderStatuses.map((orderStatus) => (
                                    <tr
                                        key={orderStatus.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{orderStatus.id}</td>
                                        <td className="table-cell">{orderStatus.orderStatusName}</td>
                                        <td className="table-cell">
                                            {orderStatus.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Active</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Inactive</div>
                                            )}
                                        </td>
                                        <td className="table-cell">{FormatDatetime(orderStatus.createdDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            {FormatDatetime(orderStatus.updatedDate) ? FormatDatetime(new Date(orderStatus.updatedDate)) : "N/A"}
                                        </td>
                                        <td className="table-cell">{orderStatus.createdBy || "N/A"}</td>
                                        <td className="table-cell">{orderStatus.updatedBy || "N/A"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/order_status/edit_order_status/${orderStatus.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(orderStatus.id)}
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatusManagement;

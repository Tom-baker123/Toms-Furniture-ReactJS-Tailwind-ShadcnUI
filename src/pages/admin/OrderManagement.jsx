import React from "react";
import { useLoaderData } from "react-router-dom";
import FormatDatetime from "@/hooks/FormatDatetime";

const OrderManagement = () => {
    const orders = useLoaderData() || [];

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Order Management</div>
            </div>
            <div className="card overflow-hidden rounded-sm bg-white shadow-xs">
                <div className="card-header">
                    <div className="card-title text-lg font-bold text-slate-800">All Orders</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full text-sm">
                            <thead className="table-header bg-gray-50">
                                <tr className="table-row">
                                    <th className="table-head px-4 py-2 whitespace-nowrap">#</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">User ID</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Total</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Status</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Payment Status</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Order Status</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Created Date</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {orders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className="table-row hover:bg-gray-50"
                                    >
                                        <td className="table-cell px-4 py-2">{order.id}</td>
                                        <td className="table-cell px-4 py-2">{order.userId}</td>
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
                                                <div className="w-fit rounded-full bg-yellow-100 px-5 py-1 text-sm text-yellow-700">Processing</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-gray-100 px-5 py-1 text-sm text-gray-700">
                                                    {order.paymentStatus}
                                                </div>
                                            )}
                                        </td>
                                        <td className="table-cell px-4 py-2">
                                            {order.orderStatusName ? (
                                                <div className="w-fit rounded-full bg-blue-100 px-5 py-1 text-sm text-blue-700">
                                                    {order.orderStatusName}
                                                </div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-gray-100 px-5 py-1 text-sm text-gray-700">N/A</div>
                                            )}
                                        </td>
                                        <td className="table-cell px-4 py-2">{FormatDatetime(order.createdDate) || "N/A"}</td>
                                        <td className="table-cell px-4 py-2">
                                            <div className="flex items-center gap-x-4">
                                                {/* Thêm các nút actions nếu cần */}
                                                <button
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                    title="View Details"
                                                >
                                                    View
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

export default OrderManagement;

import React, { useState, useMemo } from "react";
import { PencilLine, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deletePromotion } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

const PromotionManagement = () => {
    const promotions = useLoaderData();
    const navigate = useNavigate();

    // State để quản lý sắp xếp
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
            try {
                await deletePromotion(id);
                toast.success("Xóa khuyến mãi thành công!");
                navigate(0); // Reload trang
            } catch (error) {
                toast.error(`Lỗi khi xóa khuyến mãi: ${error.message}`);
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
    const sortedPromotions = useMemo(() => {
        if (!sortConfig.key) return promotions;

        return [...promotions].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            switch (sortConfig.key) {
                case "id":
                case "discountValue":
                case "orderMinimum":
                case "maximumDiscountAmount":
                case "couponUsage":
                    aVal = Number(aVal);
                    bVal = Number(bVal);
                    break;
                case "promotionCode":
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();
                    break;
                case "isActive":
                    aVal = aVal ? 1 : 0;
                    bVal = bVal ? 1 : 0;
                    break;
                case "startDate":
                case "endDate":
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
    }, [promotions, sortConfig]);

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
                <div className="title">Promotion Management</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    onClick={() => navigate("/admin/promotions/new_promotion")}
                >
                    Add Promotion
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Promotions</div>
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
                                    <SortableHeader sortKey="promotionCode">Promotion Code</SortableHeader>
                                    <SortableHeader sortKey="discountValue">Discount Value</SortableHeader>
                                    <SortableHeader sortKey="orderMinimum">Order Minimum</SortableHeader>
                                    <SortableHeader sortKey="maximumDiscountAmount">Max Discount</SortableHeader>
                                    <SortableHeader sortKey="startDate">Start Date</SortableHeader>
                                    <SortableHeader sortKey="endDate">End Date</SortableHeader>
                                    <SortableHeader sortKey="couponUsage">Usage Count</SortableHeader>
                                    <SortableHeader sortKey="isActive">Status</SortableHeader>
                                    <SortableHeader sortKey="createdDate">Created At</SortableHeader>
                                    <SortableHeader sortKey="updatedDate">Updated At</SortableHeader>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {sortedPromotions.map((promotion) => (
                                    <tr
                                        key={promotion.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{promotion.id}</td>
                                        <td className="table-cell">{promotion.promotionCode}</td>
                                        <td className="table-cell">{promotion.discountValue}</td>
                                        <td className="table-cell">{promotion.orderMinimum}</td>
                                        <td className="table-cell">{promotion.maximumDiscountAmount}</td>
                                        <td className="table-cell">{FormatDatetime(promotion.startDate)}</td>
                                        <td className="table-cell">{FormatDatetime(promotion.endDate)}</td>
                                        <td className="table-cell">{promotion.couponUsage}</td>
                                        <td className="table-cell">
                                            {promotion.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Hoạt động</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Không hoạt động</div>
                                            )}
                                        </td>
                                        <td className="table-cell">{FormatDatetime(promotion.createdDate) || "N/A"}</td>
                                        <td className="table-cell">{FormatDatetime(promotion.updatedDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/promotions/edit_promotion/${promotion.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(promotion.id)}
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

export default PromotionManagement;

import React, { useState, useMemo } from "react";
import { PencilLine, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deletePromotionType } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

const PromotionTypeManagement = () => {
    const promotionTypes = useLoaderData();
    const navigate = useNavigate();

    // State để quản lý sắp xếp
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa loại khuyến mãi này?")) {
            try {
                await deletePromotionType(id);
                toast.success("Xóa loại khuyến mãi thành công!");
                navigate(0); // Reload trang
            } catch (error) {
                toast.error(`Lỗi khi xóa loại khuyến mãi: ${error.message}`);
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
    const sortedPromotionTypes = useMemo(() => {
        if (!sortConfig.key) return promotionTypes;

        return [...promotionTypes].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            switch (sortConfig.key) {
                case "id":
                case "promotionUnit":
                    aVal = Number(aVal);
                    bVal = Number(bVal);
                    break;
                case "promotionTypeName":
                case "description":
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
    }, [promotionTypes, sortConfig]);

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
                <div className="title">Promotion Type Management</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    onClick={() => navigate("/admin/promotiontypes/new_promotiontype")}
                >
                    Add Promotion Type
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Promotion Types</div>
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
                                    <SortableHeader sortKey="id">ID</SortableHeader>
                                    <SortableHeader sortKey="promotionTypeName">Type Name</SortableHeader>
                                    <SortableHeader sortKey="description">Description</SortableHeader>
                                    <SortableHeader sortKey="promotionUnit">Unit</SortableHeader>
                                    <SortableHeader sortKey="isActive">Status</SortableHeader>
                                    <SortableHeader sortKey="createdDate">Created At</SortableHeader>
                                    <SortableHeader sortKey="updatedDate">Updated At</SortableHeader>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {sortedPromotionTypes.map((type) => (
                                    <tr
                                        key={type.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{type.id}</td>
                                        <td className="table-cell">{type.promotionTypeName}</td>
                                        <td className="table-cell">{type.description || "N/A"}</td>
                                        <td className="table-cell">{type.promotionUnit === 0 ? "Phần trăm" : "Số tiền cố định"}</td>
                                        <td className="table-cell">
                                            {type.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Hoạt động</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Không hoạt động</div>
                                            )}
                                        </td>
                                        <td className="table-cell">{FormatDatetime(type.createdDate) || "N/A"}</td>
                                        <td className="table-cell">{FormatDatetime(type.updatedDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/promotiontypes/edit_promotiontype/${type.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(type.id)}
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

export default PromotionTypeManagement;

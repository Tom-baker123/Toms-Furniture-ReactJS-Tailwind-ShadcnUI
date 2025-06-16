// src/pages/UnitManagement.jsx

import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteUnit } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

// Component hiển thị danh sách đơn vị
const UnitManagement = () => {
    const units = useLoaderData(); // Lấy dữ liệu đơn vị từ loader
    const navigate = useNavigate();

    // Hàm xử lý xóa đơn vị
    const handleDelete = async (id) => {
        // Hiển thị xác nhận xóa
        if (window.confirm("Are you sure you want to delete this unit?")) {
            try {
                await deleteUnit(id);
                toast.success("Unit deleted successfully!"); // Thông báo thành công
                navigate(0); // Reload trang để cập nhật danh sách
            } catch (error) {
                toast.error(`Error deleting unit: ${error.message}`); // Thông báo lỗi
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm mới */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Unit Management</div> {/* Tiêu đề bằng tiếng Anh */}
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/units/new_unit")}
                >
                    Add Unit {/* Nút thêm bằng tiếng Anh */}
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Units</div> {/* Tiêu đề bảng bằng tiếng Anh */}
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Unit Name</th>
                                    <th className="table-head whitespace-nowrap">Description</th>
                                    <th className="table-head whitespace-nowrap">Status</th>
                                    <th className="table-head whitespace-nowrap">Created Date</th>
                                    <th className="table-head whitespace-nowrap">Updated Date</th>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {units.map((unit) => (
                                    <tr
                                        key={unit.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{unit.id}</td>
                                        <td className="table-cell">{unit.unitName}</td>
                                        <td className="table-cell">{unit.description || "N/A"}</td>
                                        {/* <td className="table-cell">{unit.isActive ? "Active" : "Inactive"}</td>
                                        <td className="table-cell">{new Date(unit.createdDate).toLocaleDateString()}</td>
                                        <td className="table-cell">{unit.updatedDate ? new Date(unit.updatedDate).toLocaleDateString() : "N/A"}</td> */}
                                        <td className="table-cell">
                                            {unit.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Active</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Inactive</div>
                                            )}
                                        </td>
                                        <td className="table-cell">{FormatDatetime(unit.createdDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            {FormatDatetime(unit.updatedDate) ? FormatDatetime(new Date(unit.updatedDate)) : "N/A"}
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/units/edit_unit/${unit.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(unit.id)}
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

export default UnitManagement;

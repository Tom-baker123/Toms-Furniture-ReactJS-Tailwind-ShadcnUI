// src/components/Admin/ColorManagement.jsx
import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteColor } from "@/api/api";
import toast from "react-hot-toast";

// Component hiển thị danh sách màu sắc
const ColorManagement = () => {
    const colors = useLoaderData(); // Lấy dữ liệu màu sắc từ loader
    const navigate = useNavigate();

    // Hàm xử lý xóa màu sắc
    const handleDelete = async (id) => {
        // Hiển thị xác nhận xóa
        if (window.confirm("Are you sure you want to delete this color?")) {
            try {
                await deleteColor(id);
                toast.success("Color deleted successfully!"); // Thông báo thành công
                navigate(0); // Reload trang để cập nhật danh sách
            } catch (error) {
                toast.error(`Error deleting color: ${error.message}`); // Thông báo lỗi
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm mới */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Color Management</div> {/* Tiêu đề bằng tiếng Anh */}
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/colors/new_color")}
                >
                    Add Color {/* Nút thêm bằng tiếng Anh */}
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Colors</div> {/* Tiêu đề bảng bằng tiếng Anh */}
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Color Name</th>
                                    <th className="table-head whitespace-nowrap">Color Code</th>
                                    <th className="table-head whitespace-nowrap">Status</th>
                                    <th className="table-head whitespace-nowrap">Created Date</th>
                                    <th className="table-head whitespace-nowrap">Updated Date</th>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {colors.map((color) => (
                                    <tr key={color.id} className="table-row">
                                        <td className="table-cell">{color.id}</td>
                                        <td className="table-cell">{color.colorName}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="shadow inline-block h-5 w-5 rounded-full"
                                                    style={{ backgroundColor: color.colorCode || '#000000' }}
                                                ></span>
                                                {color.colorCode || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="table-cell">{color.isActive ? "Active" : "Inactive"}</td>
                                        <td className="table-cell">{new Date(color.createdDate).toLocaleDateString()}</td>
                                        <td className="table-cell">{color.updatedDate ? new Date(color.updatedDate).toLocaleDateString() : "N/A"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/colors/edit_color/${color.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(color.id)}
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

export default ColorManagement;
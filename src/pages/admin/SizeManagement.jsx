// src/pages/SizeManagement.jsx
import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteSize } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

// Component hiển thị danh sách kích thước
const SizeManagement = () => {
    const sizes = useLoaderData(); // Lấy dữ liệu kích thước từ loader
    const navigate = useNavigate();

    // Hàm xử lý xóa kích thước
    const handleDelete = async (id) => {
        // Hiển thị xác nhận xóa
        if (window.confirm("Are you sure you want to delete this size?")) {
            try {
                await deleteSize(id);
                toast.success("Size deleted successfully!"); // Thông báo thành công bằng tiếng Anh
                navigate(0); // Reload trang để cập nhật danh sách
            } catch (error) {
                toast.error(`Error deleting size: ${error.message}`); // Thông báo lỗi bằng tiếng Anh
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm mới */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Size Management</div> {/* Tiêu đề bằng tiếng Anh */}
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/sizes/new_size")}
                >
                    Add Size {/* Nút thêm bằng tiếng Anh */}
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Sizes</div> {/* Tiêu đề bảng bằng tiếng Anh */}
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Size Name</th>
                                    <th className="table-head whitespace-nowrap">Status</th>
                                    <th className="table-head whitespace-nowrap">Created Date</th>
                                    <th className="table-head whitespace-nowrap">Updated Date</th>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {sizes.map((size, index) => (
                                    <tr
                                        key={index}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{size.id}</td>
                                        <td className="table-cell">{size.sizeName}</td>
                                        <td className="table-cell">
                                            {size.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Active</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Inactive</div>
                                            )}
                                        </td>
                                        <td className="table-cell">{FormatDatetime(size.createdDate) || "N/A"}</td>
                                        <td className="table-cell">{size.updatedDate ? FormatDatetime(size.updatedDate) : "N/A"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/sizes/edit_size/${size.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(size.id)}
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

export default SizeManagement;

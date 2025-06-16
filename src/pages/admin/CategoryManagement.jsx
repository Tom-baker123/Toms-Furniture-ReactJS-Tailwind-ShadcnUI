// src/components/Admin/CategoryManagement.jsx
import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteCategory } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

// Component hiển thị danh sách danh mục và các hành động (thêm, sửa, xóa)
const CategoryManagement = () => {
    // Lấy dữ liệu danh mục từ loader
    const categories = useLoaderData();
    const navigate = useNavigate();

    // Hàm xử lý xóa danh mục
    const handleDelete = async (id) => {
        // Xác nhận trước khi xóa
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id);
                toast.success("Category deleted successfully!");
                navigate(0); // Reload trang để cập nhật danh sách
            } catch (error) {
                toast.error(`Error deleting category: ${error.message}`);
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm danh mục */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold">Category Management</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/categories/New_Collection")}
                >
                    Add Category
                </button>
            </div>
            {/* Bảng hiển thị danh sách danh mục */}
            <div className="card rounded-sm shadow-xs">
                <div className="card-header p-4">
                    <div className="card-title text-lg font-bold">All Categories</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Image</th>
                                    <th className="table-head whitespace-nowrap">Category Name</th>
                                    <th className="table-head whitespace-nowrap">Description</th>
                                    <th className="table-head whitespace-nowrap">Status</th>
                                    <th className="table-head whitespace-nowrap">Created Date</th>
                                    <th className="table-head whitespace-nowrap">Updated Date</th>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="table-row hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <td className="table-cell">{category.id}</td>
                                        <td className="table-cell">
                                            {category.imageUrl ? (
                                                <img
                                                    src={category.imageUrl}
                                                    alt={category.categoryName}
                                                    className="h-12 w-12 rounded object-cover shadow"
                                                />
                                            ) : (
                                                "No image"
                                            )}
                                        </td>
                                        <td className="table-cell">{category.categoryName}</td>
                                        <td className="table-cell">{category.descriptions || "N/A"}</td>
                                        <td className="table-cell">
                                            {category.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Active</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Inactive</div>
                                            )}
                                        </td>
                                        <td className="table-cell">{FormatDatetime(category.createdDate) || "N/A"}</td>
                                        <td className="table-cell">{FormatDatetime(category.updatedDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                    onClick={() => navigate(`/admin/categories/Edit_Collection/${category.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(category.id)}
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

export default CategoryManagement;

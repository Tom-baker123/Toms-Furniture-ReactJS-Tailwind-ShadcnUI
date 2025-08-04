// src/components/Admin/CategoryManagement.jsx
import React, { useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteCategory, updateCategory } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

// Component hiển thị danh sách danh mục và các hành động (thêm, sửa, xóa)
const CategoryManagement = () => {
    // Lấy dữ liệu danh mục từ loader
    const [categories, setCategories] = useState(useLoaderData());
    const navigate = useNavigate();

    // Hàm xử lý xóa danh mục
    const handleDelete = async (id) => {
        // Xác nhận trước khi xóa
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
            try {
                await deleteCategory(id);
                toast.success("Xóa danh mục thành công!");
                navigate(0); // Reload trang để cập nhật danh sách
            } catch (error) {
                toast.error(`Lỗi khi xóa danh mục: ${error.message}`);
            }
        }
    };

    // Cập nhật trạng thái trực tiếp
    const handleToggleActive = async (category) => {
        try {
            const updated = await updateCategory({
                Id: category.id,
                CategoryName: category.categoryName,
                Descriptions: category.descriptions || "",
                ParentId: category.parentId || null,
                RoomTypeId: category.roomTypeId || null,
                IsActive: !category.isActive,
            });
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === category.id ? { ...c, isActive: !c.isActive, updatedDate: updated.updatedDate || new Date().toISOString() } : c,
                ),
            );
            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại");
        }
    };

    // Hàm tìm tên danh mục cha
    const getParentCategoryName = (parentId) => {
        if (!parentId) return "Danh mục cha";
        const parentCategory = categories.find((cat) => cat.id === parentId);
        return parentCategory ? parentCategory.categoryName : "Không xác định";
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm danh mục */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold">Quản lý danh mục</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/categories/New_Collection")}
                >
                    Thêm danh mục
                </button>
            </div>
            {/* Bảng hiển thị danh sách danh mục */}
            <div className="card rounded-sm shadow-xs">
                <div className="card-header p-4">
                    <div className="card-title text-lg font-bold">Tất cả danh mục</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Hình ảnh</th>
                                    <th className="table-head whitespace-nowrap">Tên danh mục</th>
                                    <th className="table-head whitespace-nowrap">Danh mục cha</th>
                                    <th className="table-head whitespace-nowrap">Loại phòng</th>
                                    <th className="table-head whitespace-nowrap">Mô tả</th>
                                    <th className="table-head whitespace-nowrap">Trạng thái</th>
                                    <th className="table-head whitespace-nowrap">Ngày tạo</th>
                                    <th className="table-head whitespace-nowrap">Ngày cập nhật</th>
                                    <th className="table-head whitespace-nowrap">Thao tác</th>
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
                                                    className="h-12 w-12 rounded bg-gray-100 object-cover shadow"
                                                />
                                            ) : (
                                                "Không có ảnh"
                                            )}
                                        </td>
                                        <td className="table-cell">{category.categoryName}</td>
                                        <td className="table-cell">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${
                                                    category.parentId ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {getParentCategoryName(category.parentId)}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${
                                                    category.roomTypeName ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {category.roomTypeName || "Chưa phân loại"}
                                            </span>
                                        </td>
                                        <td className="table-cell">{category.descriptions || "Không có mô tả"}</td>
                                        <td className="table-cell">
                                            <button
                                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${category.isActive ? "bg-teal-500" : "bg-gray-300"}`}
                                                onClick={() => handleToggleActive(category)}
                                                title="Chuyển trạng thái"
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${category.isActive ? "translate-x-6" : "translate-x-1"}`}
                                                />
                                                <span className="absolute left-1 text-xs font-bold text-gray-400 select-none"></span>
                                                <span className="absolute right-1 text-xs font-bold text-teal-700 select-none"></span>
                                            </button>
                                        </td>
                                        <td className="table-cell">{FormatDatetime(category.createdDate) || "--"}</td>
                                        <td className="table-cell">{FormatDatetime(category.updatedDate) || "--"}</td>
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

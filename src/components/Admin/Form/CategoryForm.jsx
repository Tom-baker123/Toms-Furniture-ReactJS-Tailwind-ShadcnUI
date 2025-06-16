// src/components/Admin/Form/CategoryForm.jsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createCategory, updateCategory } from "@/api/api";
import { MoveLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

// Component form để thêm hoặc sửa danh mục
const CategoryForm = () => {
    const navigate = useNavigate();
    const categoryData = useLoaderData(); // Lấy dữ liệu danh mục nếu đang sửa
    const isEditing = !!categoryData; // Kiểm tra xem có đang sửa hay không
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi gửi form

    // Khởi tạo form với React Hook Form
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  CategoryName: categoryData.categoryName || "",
                  Descriptions: categoryData.descriptions || "",
                  IsActive: categoryData.isActive || true,
              }
            : {
                  CategoryName: "",
                  Descriptions: "",
                  IsActive: true,
              },
    });

    // State để quản lý preview hình ảnh
    const [imagePreview, setImagePreview] = useState(categoryData?.imageUrl || null);
    const [imageFile, setImageFile] = useState(null);

    // Cập nhật form khi dữ liệu danh mục thay đổi (trong trường hợp sửa)
    useEffect(() => {
        if (isEditing) {
            reset({
                CategoryName: categoryData.categoryName,
                Descriptions: categoryData.descriptions,
                IsActive: categoryData.isActive,
            });
            setImagePreview(categoryData.imageUrl);
        }
    }, [categoryData, reset]);

    // Xử lý khi chọn file ảnh
    const handleImageChange = (e, onChange) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    // Xử lý submit form
    const onSubmit = async (data) => {
        if (isLoading) return; // Ngăn gửi lại yêu cầu
        setIsLoading(true);
        try {
            if (isEditing) {
                // Gọi API cập nhật danh mục
                await updateCategory({ Id: categoryData.id, ...data }, imageFile);
                toast.success("Category updated successfully!");
            } else {
                // Gọi API tạo mới danh mục
                await createCategory(data, imageFile);
                toast.success("Category created successfully!");
            }
            navigate("/admin/categories"); // Điều hướng về trang danh sách danh mục
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            {/* Nút quay lại */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/categories")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Back
                </button>
            </div>
            {/* Form thêm/sửa danh mục */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    {/* Phần upload hình ảnh */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-4">
                        <div className="p-4 text-lg font-bold text-slate-800">
                            Category Image <span className="text-lg text-gray-500">(optional)</span>
                        </div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <Controller
                                name="imageFile"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border bg-gray-50 p-2 transition outline-dashed hover:bg-gray-100">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-32 w-32 rounded object-cover"
                                            />
                                        ) : (
                                            <>
                                                <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                                <span className="text-sm text-gray-500">Select image</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.gif,.webp"
                                            onChange={(e) => handleImageChange(e, onChange)}
                                        />
                                    </label>
                                )}
                            />
                        </div>
                    </div>
                    {/* Phần thông tin danh mục */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-8">
                        <div className="p-4 text-lg font-bold text-slate-800">Category Information</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            {/* Tên danh mục */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Category Name</p>
                                </span>
                                <Controller
                                    name="CategoryName"
                                    control={control}
                                    rules={{
                                        required: "Category name is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Category name must be less than 50 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.CategoryName ? "border-red-500" : ""}`}
                                            placeholder="Enter category name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.CategoryName && <p className="mt-1 text-sm text-red-500">{errors.CategoryName.message}</p>}
                            </label>
                            {/* Mô tả */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Description</p>
                                </span>
                                <Controller
                                    name="Descriptions"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 255,
                                            message: "Description must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Descriptions ? "border-red-500" : ""}`}
                                            placeholder="Enter description"
                                            rows="4"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.Descriptions && <p className="mt-1 text-sm text-red-500">{errors.Descriptions.message}</p>}
                            </label>
                            {/* Trạng thái (chỉ hiển thị khi sửa) */}
                            {isEditing && (
                                <label className="font-bold text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <p className="text-md">Status</p>
                                    </span>
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                                {...field}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        )}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
                {/* Tiêu đề và nút submit */}
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Category" : "Add New Category"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;

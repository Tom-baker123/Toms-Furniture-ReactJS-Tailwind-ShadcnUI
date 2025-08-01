// src/components/Admin/Form/BlogForm.jsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createNews, updateNews } from "@/api/service/BlogService";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/ui/RichTextEditor";
import ImageUpload from "@/components/ui/ImageUpload";
import FormField from "@/components/ui/FormField";

// Component form để thêm hoặc sửa tin tức
const BlogForm = () => {
    const navigate = useNavigate();
    const blogData = useLoaderData(); // Lấy dữ liệu tin tức nếu đang sửa
    const isEditing = !!blogData; // Kiểm tra xem có đang sửa hay không
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
                  Title: blogData.title || "",
                  Content: blogData.content || "",
                  IsActive: blogData.isActive || true,
              }
            : {
                  Title: "",
                  Content: "",
                  IsActive: true,
              },
    });

    // State để quản lý preview hình ảnh
    const [imagePreview, setImagePreview] = useState(blogData?.newsAvatar || null);
    const [imageFile, setImageFile] = useState(null);

    // Cập nhật form khi dữ liệu tin tức thay đổi (trong trường hợp sửa)
    useEffect(() => {
        if (isEditing && blogData) {
            reset({
                Title: blogData.title || "",
                Content: blogData.content || "",
                IsActive: blogData.isActive !== undefined ? blogData.isActive : true,
            });
            setImagePreview(blogData.newsAvatar || null);
        }
    }, [blogData, reset, isEditing]);

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

        // Kiểm tra imageFile khi tạo mới
        if (!isEditing && !imageFile) {
            toast.error("Please select an image for the blog post");
            return;
        }

        setIsLoading(true);
        try {
            // Chuẩn bị dữ liệu để gửi
            const submitData = {
                ...data,
            };

            if (isEditing) {
                // Gọi API cập nhật tin tức
                submitData.Id = blogData.id;
                const result = await updateNews(submitData, imageFile);
                if (result.success === false) {
                    throw new Error(result.message);
                }
                toast.success("Blog updated successfully!");
            } else {
                // Gọi API tạo mới tin tức
                const result = await createNews(submitData, imageFile);
                if (result.success === false) {
                    throw new Error(result.message);
                }
                toast.success("Blog created successfully!");
            }
            navigate("/admin/blog_management"); // Điều hướng về trang danh sách tin tức
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
                    onClick={() => navigate("/admin/blog_management")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Back
                </button>
            </div>

            {/* Form thêm/sửa tin tức */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    {/* Phần upload hình ảnh */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
                        <div className="p-4 text-lg font-bold text-slate-800">
                            Blog Image {!isEditing && <span className="text-lg text-red-500">*</span>}
                        </div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <Controller
                                name="imageFile"
                                control={control}
                                rules={
                                    !isEditing
                                        ? {
                                              required: "Blog image is required",
                                          }
                                        : {}
                                }
                                render={({ field: { onChange } }) => (
                                    <ImageUpload
                                        imagePreview={imagePreview}
                                        onImageChange={(e) => handleImageChange(e, onChange)}
                                        required={!isEditing}
                                        label="Select image"
                                        error={errors.imageFile?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Phần thông tin tin tức */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
                        <div className="p-4 text-lg font-bold text-slate-800">Blog Information</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            {/* Tiêu đề tin tức */}
                            <FormField
                                label="Title"
                                required={true}
                                error={errors.Title?.message}
                            >
                                <Controller
                                    name="Title"
                                    control={control}
                                    rules={{
                                        required: "Blog title is required",
                                        maxLength: {
                                            value: 200,
                                            message: "Blog title must be less than 200 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Title ? "border-red-500" : ""}`}
                                            placeholder="Enter blog title"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormField>

                            {/* Nội dung tin tức */}
                            <FormField
                                label="Content"
                                required={true}
                                error={errors.Content?.message}
                            >
                                <Controller
                                    name="Content"
                                    control={control}
                                    rules={{
                                        required: "Blog content is required",
                                        minLength: {
                                            value: 10,
                                            message: "Content must be at least 10 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <div className="mt-2">
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                placeholder="Start writing your blog content here... Use the toolbar above for formatting options."
                                                height={500}
                                                error={!!errors.Content}
                                            />
                                        </div>
                                    )}
                                />
                            </FormField>

                            {/* Trạng thái (chỉ hiển thị khi sửa) */}
                            {isEditing && (
                                <FormField label="Status">
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                                {...field}
                                                value={field.value ? "true" : "false"}
                                                onChange={(e) => field.onChange(e.target.value === "true")}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        )}
                                    />
                                </FormField>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tiêu đề và nút submit */}
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Blog Post" : "Add New Blog Post"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Blog"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;

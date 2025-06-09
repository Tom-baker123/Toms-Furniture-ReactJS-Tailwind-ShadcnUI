import { CircleHelp, ImageIcon, MoveLeft } from "lucide-react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createCategory } from "@/api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CategoryForm = () => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Khởi tạo React Hook Form
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            CategoryName: "",
            Descriptions: "",
            imageFile: null,
        },
    });

    // Xử lý khi chọn file ảnh
    const handleImageChange = (e, onChange) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra định dạng file
            const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
            const fileExtension = file.name.split(".").pop().toLowerCase();
            if (!allowedExtensions.includes(`.${fileExtension}`)) {
                toast.error("Chỉ hỗ trợ định dạng .jpg, .jpeg, .png, .gif, .webp");
                return;
            }

            // Tạo URL preview ảnh
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            onChange(file);
        } else {
            setImagePreview(null);
            onChange(null);
        }
    };

    // Xử lý submit form
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await createCategory(
                {
                    CategoryName: data.CategoryName,
                    Descriptions: data.Descriptions,
                },
                data.imageFile,
            );

            toast.success(response.message || "Thêm danh mục thành công!");
            reset(); // Reset form sau khi thành công
            setImagePreview(null); // Xóa preview ảnh
            navigate("/admin/product_collection"); // Chuyển hướng về danh sách danh mục
        } catch (error) {
            toast.error(error.message || "Có lỗi khi thêm danh mục!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/product_collection")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Quay lại
                </button>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    {/* Phần upload ảnh */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-4">
                        <div className="p-4 text-lg font-bold text-slate-800">
                            Ảnh Danh Mục <span className="text-lg text-gray-500">(tùy chọn)</span>
                        </div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Tag</p>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="flex cursor-pointer items-center justify-center">
                                                <CircleHelp
                                                    strokeWidth={3.5}
                                                    className="w-3.5 text-blue-600"
                                                />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p className="w-52 text-wrap">
                                                Chỉ sử dụng 1 ảnh. Định dạng ảnh jpg, jpeg, png, gif, webp với tỷ lệ 1:1 (ảnh vuông) và độ phân giải
                                                2048px x 2048px để có chất lượng tốt nhất.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </span>
                                <Controller
                                    name="tag"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                            placeholder="Nhập tag ảnh"
                                            {...field}
                                        />
                                    )}
                                />
                            </label>

                            <div>
                                <Controller
                                    name="imageFile"
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border bg-gray-50 p-2 transition outline-dashed hover:bg-gray-100">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <>
                                                    <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                                    <span className="text-sm text-gray-500">Chọn ảnh</span>
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
                    </div>

                    {/* Phần thông tin danh mục */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-8">
                        <div className="p-4 text-lg font-bold text-slate-800">Thông Tin Danh Mục</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            {/* Tên danh mục */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Tên Danh Mục</p>
                                </span>
                                <Controller
                                    name="CategoryName"
                                    control={control}
                                    rules={{
                                        required: "Tên danh mục là bắt buộc",
                                        maxLength: {
                                            value: 50,
                                            message: "Tên danh mục tối đa 50 ký tự",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.CategoryName ? "border-red-500" : ""}`}
                                            placeholder="Nhập tên danh mục"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.CategoryName && <p className="mt-1 text-sm text-red-500">{errors.CategoryName.message}</p>}
                            </label>

                            {/* Mô tả danh mục */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Mô Tả Danh Mục</p>
                                </span>
                                <Controller
                                    name="Descriptions"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 255,
                                            message: "Mô tả tối đa 255 ký tự",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            rows={5}
                                            className={`w-full rounded-sm border p-2 ${errors.Descriptions ? "border-red-500" : ""}`}
                                            placeholder="Nhập mô tả danh mục"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.Descriptions && <p className="mt-1 text-sm text-red-500">{errors.Descriptions.message}</p>}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">Thêm Danh Mục Mới</div>
                    {/* Nút Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`rounded-lg bg-blue-600 transition-all font-bold px-5 py-2 text-white shadow-sm hover:bg-blue-700 ${isLoading ? "opacity-50" : ""}`}
                    >
                        {isLoading ? "Đang xử lý..." : "Create Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;

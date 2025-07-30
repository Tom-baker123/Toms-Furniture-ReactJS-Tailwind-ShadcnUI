// src/components/Admin/Form/ColorForm.jsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createColor, updateColor } from "@/api/api";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";

// Component form để thêm mới hoặc chỉnh sửa màu sắc
const ColorForm = () => {
    const navigate = useNavigate();
    const colorData = useLoaderData(); // Lấy dữ liệu màu sắc từ loader (nếu chỉnh sửa)
    const isEditing = !!colorData; // Kiểm tra xem có đang chỉnh sửa không
    const [isLoading, setIsLoading] = useState(false);

    // Khởi tạo react-hook-form
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  ColorName: colorData.colorName || "",
                  ColorCode: colorData.colorCode || "#000000",
                  IsActive: colorData.isActive === null ? true : !!colorData.isActive, // Xử lý null/undefined
              }
            : {
                  ColorName: "",
                  ColorCode: "#000000",
                  IsActive: true,
              },
    });

    // Cập nhật giá trị form khi chỉnh sửa
    useEffect(() => {
        if (isEditing && colorData) {
            reset({
                ColorName: colorData.colorName || "",
                ColorCode: colorData.colorCode || "#000000",
                IsActive: colorData.isActive === null ? true : !!colorData.isActive, // Xử lý null/undefined
            });
        }
    }, [colorData, reset, isEditing]);

    // Hàm xử lý submit form
    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            if (isEditing) {
                // Payload cho cập nhật (ColorUpdateVModel)
                const payload = {
                    Id: colorData.id,
                    ColorName: data.ColorName,
                    ColorCode: data.ColorCode || "",
                    IsActive: data.IsActive,
                };
                await updateColor(payload);
                toast.success("Color updated successfully!");
            } else {
                // Payload cho tạo mới (ColorCreateVModel)
                await createColor({
                    ColorName: data.ColorName,
                    ColorCode: data.ColorCode || "",
                });
                toast.success("Color created successfully!");
            }
            navigate("/admin/colors");
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Kiểm tra nếu colorData không hợp lệ khi chỉnh sửa
    if (isEditing && !colorData) {
        return <div className="text-red-500">Error: Color data not found. Please try again.</div>;
    }

    return (
        <div className="">
            {/* Nút quay lại */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/colors")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Back
                </button>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-6"
            >
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Color" : "Add New Color"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Color"}
                    </button>
                </div>
                <div className="h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
                    <div className="p-4 text-lg font-bold text-slate-800">Color Information</div>
                    <hr />
                    <div className="flex flex-col gap-5 px-4 py-4">
                        {/* Trường nhập tên màu sắc */}
                        <label className="font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                                <p className="text-md">Color Name</p>
                            </span>
                            <Controller
                                name="ColorName"
                                control={control}
                                rules={{
                                    required: "Color name is required",
                                    maxLength: {
                                        value: 50,
                                        message: "Color name must be less than 50 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.ColorName ? "border-red-500" : ""}`}
                                        placeholder="Enter color name"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.ColorName && <p className="mt-1 text-sm text-red-500">{errors.ColorName.message}</p>}
                        </label>
                        {/* Trường chọn mã màu sắc bằng color picker */}
                        <label className="font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                                <p className="text-md">Color Code</p>
                            </span>
                            <div className="mt-2 flex items-center gap-2">
                                <Controller
                                    name="ColorCode"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="color"
                                            className="h-10 w-10 cursor-pointer rounded-sm border p-1"
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name="ColorCode"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`w-full rounded-sm border px-1.5 py-2 ${errors.ColorCode ? "border-red-500" : ""}`}
                                            placeholder="Selected color code (e.g., #FFFFFF)"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {errors.ColorCode && <p className="mt-1 text-sm text-red-500">{errors.ColorCode.message}</p>}
                        </label>
                        {/* Trường trạng thái (chỉ hiển thị khi chỉnh sửa) */}
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
                                            value={field.value ? "true" : "false"} // Đảm bảo giá trị là chuỗi
                                            onChange={(e) => field.onChange(e.target.value === "true")}
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    )}
                                />
                            </label>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ColorForm;

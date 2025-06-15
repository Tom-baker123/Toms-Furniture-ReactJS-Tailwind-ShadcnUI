// src/components/Admin/Form/UnitForm.jsx

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createUnit, updateUnit } from "@/api/api";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";

// Component form để thêm mới hoặc chỉnh sửa đơn vị
const UnitForm = () => {
    const navigate = useNavigate();
    const unitData = useLoaderData(); // Lấy dữ liệu đơn vị từ loader (nếu chỉnh sửa)
    const isEditing = !!unitData; // Kiểm tra xem có đang chỉnh sửa không
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
                  UnitName: unitData.unitName || "",
                  Description: unitData.description || "",
                  IsActive: unitData.isActive === null ? true : !!unitData.isActive,
              }
            : {
                  UnitName: "",
                  Description: "",
                  IsActive: true,
              },
    });

    // Cập nhật giá trị form khi chỉnh sửa
    useEffect(() => {
        if (isEditing && unitData) {
            reset({
                UnitName: unitData.unitName || "",
                Description: unitData.description || "",
                IsActive: unitData.isActive === null ? true : !!unitData.isActive,
            });
        }
    }, [unitData, reset, isEditing]);

    // Hàm xử lý submit form
    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            if (isEditing) {
                // Payload cho cập nhật (UnitUpdateVModel)
                const payload = {
                    Id: unitData.id,
                    UnitName: data.UnitName,
                    Description: data.Description,
                    IsActive: data.IsActive,
                };
                await updateUnit(payload);
                toast.success("Unit updated successfully!");
            } else {
                // Payload cho tạo mới (UnitCreateVModel)
                await createUnit({
                    UnitName: data.UnitName,
                    Description: data.Description,
                });
                toast.success("Unit created successfully!");
            }
            navigate("/admin/units");
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Kiểm tra nếu unitData không hợp lệ khi chỉnh sửa
    if (isEditing && !unitData) {
        return <div className="text-red-500">Error: Unit data not found. Please try again.</div>;
    }

    return (
        <div className="">
            {/* Nút quay lại */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/units")}
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
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Unit" : "Add New Unit"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Unit"}
                    </button>
                </div>
                <div className="h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
                    <div className="p-4 text-lg font-bold text-slate-800">Unit Information</div>
                    <hr />
                    <div className="flex flex-col gap-5 px-4 py-4">
                        {/* Trường nhập tên đơn vị */}
                        <label className="font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                                <p className="text-md">Unit Name</p>
                            </span>
                            <Controller
                                name="UnitName"
                                control={control}
                                rules={{
                                    required: "Unit name is required",
                                    maxLength: {
                                        value: 50,
                                        message: "Unit name must be less than 50 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.UnitName ? "border-red-500" : ""}`}
                                        placeholder="Enter unit name"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.UnitName && <p className="mt-1 text-sm text-red-500">{errors.UnitName.message}</p>}
                        </label>
                        {/* Trường nhập mô tả */}
                        <label className="font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                                <p className="text-md">Description</p>
                            </span>
                            <Controller
                                name="Description"
                                control={control}
                                rules={{
                                    maxLength: {
                                        value: 200,
                                        message: "Description must be less than 200 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <textarea
                                        className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Description ? "border-red-500" : ""}`}
                                        placeholder="Enter description"
                                        rows={4}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.Description && <p className="mt-1 text-sm text-red-500">{errors.Description.message}</p>}
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
                                            value={field.value ? "true" : "false"}
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

export default UnitForm;

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createMaterial, updateMaterial } from "@/api/api";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";

// Component form để thêm mới hoặc chỉnh sửa vật liệu
const MaterialForm = () => {
    const navigate = useNavigate();
    const materialData = useLoaderData(); // Lấy dữ liệu vật liệu từ loader (nếu chỉnh sửa)
    const isEditing = !!materialData; // Kiểm tra xem có đang chỉnh sửa không
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
                  MaterialName: materialData.materialName || "",
                  IsActive: materialData.isActive === null ? true : !!materialData.isActive, // Xử lý null/undefined
              }
            : {
                  MaterialName: "",
                  IsActive: true,
              },
    });

    // Cập nhật giá trị form khi chỉnh sửa
    useEffect(() => {
        if (isEditing && materialData) {
            reset({
                MaterialName: materialData.materialName || "",
                IsActive: materialData.isActive === null ? true : !!materialData.isActive, // Xử lý null/undefined
            });
        }
    }, [materialData, reset, isEditing]);

    // Hàm xử lý submit form
    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            if (isEditing) {
                // Payload cho cập nhật (MaterialUpdateVModel)
                const payload = {
                    Id: materialData.id,
                    MaterialName: data.MaterialName,
                    IsActive: data.IsActive,
                };
                await updateMaterial(payload);
                toast.success("Material updated successfully!");
            } else {
                // Payload cho tạo mới (MaterialCreateVModel)
                await createMaterial({
                    MaterialName: data.MaterialName,
                });
                toast.success("Material created successfully!");
            }
            navigate("/admin/materials");
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Kiểm tra nếu materialData không hợp lệ khi chỉnh sửa
    if (isEditing && !materialData) {
        return <div className="text-red-500">Error: Material data not found. Please try again.</div>;
    }

    return (
        <div className="">
            {/* Nút quay lại */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/materials")}
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
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Material" : "Add New Material"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Material"}
                    </button>
                </div>
                <div className="h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
                    <div className="p-4 text-lg font-bold text-slate-800">Material Information</div>
                    <hr />
                    <div className="flex flex-col gap-5 px-4 py-4">
                        {/* Trường nhập tên vật liệu */}
                        <label className="font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                                <p className="text-md">Material Name</p>
                            </span>
                            <Controller
                                name="MaterialName"
                                control={control}
                                rules={{
                                    required: "Material name is required",
                                    maxLength: {
                                        value: 100,
                                        message: "Material name must be less than 100 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.MaterialName ? "border-red-500" : ""}`}
                                        placeholder="Enter material name"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.MaterialName && <p className="mt-1 text-sm text-red-500">{errors.MaterialName.message}</p>}
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

export default MaterialForm;

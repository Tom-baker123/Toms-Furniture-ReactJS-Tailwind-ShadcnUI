import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createPromotionType, updatePromotionType } from "@/api/api";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";

const PromotionTypeForm = () => {
    const navigate = useNavigate();
    const promotionTypeData = useLoaderData();
    const isEditing = !!promotionTypeData;
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  PromotionTypeName: promotionTypeData.promotionTypeName || "",
                  Description: promotionTypeData.description || "",
                  PromotionUnit: promotionTypeData.promotionUnit || 0,
                  IsActive: promotionTypeData.isActive || true,
              }
            : {
                  PromotionTypeName: "",
                  Description: "",
                  PromotionUnit: 0,
                  IsActive: true,
              },
    });

    useEffect(() => {
        if (isEditing) {
            reset({
                PromotionTypeName: promotionTypeData.promotionTypeName,
                Description: promotionTypeData.description || "",
                PromotionUnit: promotionTypeData.promotionUnit,
                IsActive: promotionTypeData.isActive,
            });
        }
    }, [promotionTypeData, reset]);

    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            if (isEditing) {
                await updatePromotionType({ Id: promotionTypeData.id, ...data });
                toast.success("Cập nhật loại khuyến mãi thành công!");
            } else {
                await createPromotionType(data);
                toast.success("Tạo loại khuyến mãi thành công!");
            }
            navigate("/admin/promotiontypes");
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/promotiontypes")}
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
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
                        <div className="p-4 text-lg font-bold text-slate-800">Thông tin loại khuyến mãi</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Tên loại khuyến mãi</span>
                                <Controller
                                    name="PromotionTypeName"
                                    control={control}
                                    rules={{
                                        required: "Tên loại khuyến mãi là bắt buộc",
                                        maxLength: {
                                            value: 100,
                                            message: "Tên loại khuyến mãi không được dài quá 100 ký tự",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.PromotionTypeName ? "border-red-500" : ""}`}
                                            placeholder="Nhập tên loại khuyến mãi"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.PromotionTypeName && <p className="mt-1 text-sm text-red-500">{errors.PromotionTypeName.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Mô tả</span>
                                <Controller
                                    name="Description"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                            placeholder="Nhập mô tả"
                                            {...field}
                                        />
                                    )}
                                />
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Đơn vị khuyến mãi</span>
                                <Controller
                                    name="PromotionUnit"
                                    control={control}
                                    rules={{ required: "Đơn vị khuyến mãi là bắt buộc" }}
                                    render={({ field }) => (
                                        <select
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.PromotionUnit ? "border-red-500" : ""}`}
                                            {...field}
                                        >
                                            <option value={0}>Phần trăm</option>
                                            <option value={1}>Số tiền cố định</option>
                                        </select>
                                    )}
                                />
                                {errors.PromotionUnit && <p className="mt-1 text-sm text-red-500">{errors.PromotionUnit.message}</p>}
                            </label>
                            {isEditing && (
                                <label className="font-bold text-slate-500">
                                    <span className="text-md">Trạng thái</span>
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                                {...field}
                                            >
                                                <option value={true}>Hoạt động</option>
                                                <option value={false}>Không hoạt động</option>
                                            </select>
                                        )}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">
                        {isEditing ? "Cập nhật loại khuyến mãi" : "Thêm loại khuyến mãi mới"}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Tạo loại khuyến mãi"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromotionTypeForm;

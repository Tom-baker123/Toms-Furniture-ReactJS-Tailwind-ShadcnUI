import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createPromotion, updatePromotion, getAllPromotionTypes } from "@/api/api";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";

const PromotionForm = () => {
    const navigate = useNavigate();
    const promotionData = useLoaderData();
    const isEditing = !!promotionData;
    const [isLoading, setIsLoading] = useState(false);
    const [promotionTypes, setPromotionTypes] = useState([]);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  PromotionCode: promotionData.promotionCode || "",
                  DiscountValue: promotionData.discountValue || 0,
                  OrderMinimum: promotionData.orderMinimum || 0,
                  MaximumDiscountAmount: promotionData.maximumDiscountAmount || 0,
                  StartDate: promotionData.startDate ? new Date(promotionData.startDate).toISOString().split("T")[0] : "",
                  EndDate: promotionData.endDate ? new Date(promotionData.endDate).toISOString().split("T")[0] : "",
                  CouponUsage: promotionData.couponUsage || 0,
                  PromotionTypeId: promotionData.promotionTypeId || "",
                  IsActive: promotionData.isActive || true,
              }
            : {
                  PromotionCode: "",
                  DiscountValue: 0,
                  OrderMinimum: 0,
                  MaximumDiscountAmount: 0,
                  StartDate: "",
                  EndDate: "",
                  CouponUsage: 0,
                  PromotionTypeId: "",
                  IsActive: true,
              },
    });

    useEffect(() => {
        // Lấy danh sách loại khuyến mãi
        const fetchPromotionTypes = async () => {
            try {
                const types = await getAllPromotionTypes();
                setPromotionTypes(types);
            } catch (error) {
                toast.error(`Lỗi khi lấy danh sách loại khuyến mãi: ${error.message}`);
            }
        };
        fetchPromotionTypes();

        if (isEditing) {
            reset({
                PromotionCode: promotionData.promotionCode,
                DiscountValue: promotionData.discountValue,
                OrderMinimum: promotionData.orderMinimum,
                MaximumDiscountAmount: promotionData.maximumDiscountAmount,
                StartDate: new Date(promotionData.startDate).toISOString().split("T")[0],
                EndDate: new Date(promotionData.endDate).toISOString().split("T")[0],
                CouponUsage: promotionData.couponUsage,
                PromotionTypeId: promotionData.promotionTypeId || "",
                IsActive: promotionData.isActive,
            });
        }
    }, [promotionData, reset]);

    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                PromotionTypeId: data.PromotionTypeId ? Number(data.PromotionTypeId) : undefined,
            };
            if (isEditing) {
                await updatePromotion({ Id: promotionData.id, ...formattedData });
                toast.success("Cập nhật khuyến mãi thành công!");
            } else {
                await createPromotion(formattedData);
                toast.success("Tạo khuyến mãi thành công!");
            }
            navigate("/admin/promotions");
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
                    onClick={() => navigate("/admin/promotions")}
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
                        <div className="p-4 text-lg font-bold text-slate-800">Thông tin khuyến mãi</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Mã khuyến mãi</span>
                                <Controller
                                    name="PromotionCode"
                                    control={control}
                                    rules={{
                                        required: "Mã khuyến mãi là bắt buộc",
                                        maxLength: {
                                            value: 50,
                                            message: "Mã khuyến mãi không được dài quá 50 ký tự",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.PromotionCode ? "border-red-500" : ""}`}
                                            placeholder="Nhập mã khuyến mãi"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.PromotionCode && <p className="mt-1 text-sm text-red-500">{errors.PromotionCode.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Giá trị giảm giá</span>
                                <Controller
                                    name="DiscountValue"
                                    control={control}
                                    rules={{
                                        required: "Giá trị giảm giá là bắt buộc",
                                        min: { value: 0, message: "Giá trị giảm giá phải lớn hơn 0" },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.DiscountValue ? "border-red-500" : ""}`}
                                            placeholder="Nhập giá trị giảm giá"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.DiscountValue && <p className="mt-1 text-sm text-red-500">{errors.DiscountValue.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Đơn hàng tối thiểu</span>
                                <Controller
                                    name="OrderMinimum"
                                    control={control}
                                    rules={{
                                        required: "Đơn hàng tối thiểu là bắt buộc",
                                        min: { value: 0, message: "Đơn hàng tối thiểu không được âm" },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.OrderMinimum ? "border-red-500" : ""}`}
                                            placeholder="Nhập giá trị đơn hàng tối thiểu"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.OrderMinimum && <p className="mt-1 text-sm text-red-500">{errors.OrderMinimum.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Số tiền giảm tối đa</span>
                                <Controller
                                    name="MaximumDiscountAmount"
                                    control={control}
                                    rules={{
                                        required: "Số tiền giảm tối đa là bắt buộc",
                                        min: { value: 0, message: "Số tiền giảm tối đa không được âm" },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.MaximumDiscountAmount ? "border-red-500" : ""}`}
                                            placeholder="Nhập số tiền giảm tối đa"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.MaximumDiscountAmount && <p className="mt-1 text-sm text-red-500">{errors.MaximumDiscountAmount.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Ngày bắt đầu</span>
                                <Controller
                                    name="StartDate"
                                    control={control}
                                    rules={{ required: "Ngày bắt đầu là bắt buộc" }}
                                    render={({ field }) => (
                                        <input
                                            type="date"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.StartDate ? "border-red-500" : ""}`}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.StartDate && <p className="mt-1 text-sm text-red-500">{errors.StartDate.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Ngày kết thúc</span>
                                <Controller
                                    name="EndDate"
                                    control={control}
                                    rules={{
                                        required: "Ngày kết thúc là bắt buộc",
                                        validate: (value, formValues) =>
                                            new Date(value) >= new Date(formValues.StartDate) || "Ngày kết thúc phải sau ngày bắt đầu",
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="date"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.EndDate ? "border-red-500" : ""}`}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.EndDate && <p className="mt-1 text-sm text-red-500">{errors.EndDate.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Số lần sử dụng tối đa</span>
                                <Controller
                                    name="CouponUsage"
                                    control={control}
                                    rules={{
                                        required: "Số lần sử dụng là bắt buộc",
                                        min: { value: 0, message: "Số lần sử dụng không được âm" },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.CouponUsage ? "border-red-500" : ""}`}
                                            placeholder="Nhập số lần sử dụng tối đa"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.CouponUsage && <p className="mt-1 text-sm text-red-500">{errors.CouponUsage.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Loại khuyến mãi</span>
                                <Controller
                                    name="PromotionTypeId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.PromotionTypeId ? "border-red-500" : ""}`}
                                            {...field}
                                        >
                                            <option value="">Chọn loại khuyến mãi</option>
                                            {promotionTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.promotionTypeName}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.PromotionTypeId && <p className="mt-1 text-sm text-red-500">{errors.PromotionTypeId.message}</p>}
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
                        {isEditing ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi mới"}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Tạo khuyến mãi"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromotionForm;
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import toast from "react-hot-toast";
import { MoveLeft } from "lucide-react";

const OrderDetailsForm = () => {
    const navigate = useNavigate();
    const orderData = useLoaderData();
    const isEditing = !!orderData?.order;
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  CustomerName: orderData.order.customerName || "",
                  Phone: orderData.order.phone || "",
                  Address: orderData.order.address || "",
                  TotalAmount: orderData.order.totalAmount || "",
                  Status: orderData.order.status || "Đang xử lý",
                  CreatedDate: orderData.order.createdDate || "",
                  UpdatedDate: orderData.order.updatedDate || "",
              }
            : {
                  CustomerName: "",
                  Phone: "",
                  Address: "",
                  TotalAmount: "",
                  Status: "Đang xử lý",
                  CreatedDate: "",
                  UpdatedDate: "",
              },
    });

    React.useEffect(() => {
        if (isEditing && orderData.order) {
            reset({
                CustomerName: orderData.order.customerName,
                Phone: orderData.order.phone,
                Address: orderData.order.address,
                TotalAmount: orderData.order.totalAmount,
                Status: orderData.order.status,
                CreatedDate: orderData.order.createdDate,
                UpdatedDate: orderData.order.updatedDate,
            });
        }
    }, [orderData, reset]);

    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            // TODO: Gửi dữ liệu lên API
            // Nếu là edit thì gọi update, không thì gọi create
            // Ví dụ:
            // if (isEditing) await updateOrder(orderData.order.id, data)
            // else await createOrder(data)
            toast.success(isEditing ? "Cập nhật đơn hàng thành công!" : "Thêm đơn hàng thành công!");
            navigate("/admin/orders");
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
                    onClick={() => navigate("/admin/order")}
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
                        <div className="p-4 text-lg font-bold text-slate-800">Thông tin đơn hàng</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Tên khách hàng</span>
                                <Controller
                                    name="CustomerName"
                                    control={control}
                                    rules={{ required: "Tên khách hàng là bắt buộc" }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.CustomerName ? "border-red-500" : ""}`}
                                            placeholder="Nhập tên khách hàng"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.CustomerName && <p className="mt-1 text-sm text-red-500">{errors.CustomerName.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Số điện thoại</span>
                                <Controller
                                    name="Phone"
                                    control={control}
                                    rules={{
                                        required: "Số điện thoại là bắt buộc",
                                        pattern: {
                                            value: /^\d{10,15}$/,
                                            message: "Số điện thoại phải có 10 đến 15 chữ số",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Phone ? "border-red-500" : ""}`}
                                            placeholder="Nhập số điện thoại"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.Phone && <p className="mt-1 text-sm text-red-500">{errors.Phone.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Địa chỉ</span>
                                <Controller
                                    name="Address"
                                    control={control}
                                    rules={{ required: "Địa chỉ là bắt buộc" }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Address ? "border-red-500" : ""}`}
                                            placeholder="Nhập địa chỉ"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.Address && <p className="mt-1 text-sm text-red-500">{errors.Address.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Tổng tiền (₫)</span>
                                <Controller
                                    name="TotalAmount"
                                    control={control}
                                    rules={{
                                        required: "Tổng tiền là bắt buộc",
                                        min: { value: 0, message: "Tổng tiền không hợp lệ" },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.TotalAmount ? "border-red-500" : ""}`}
                                            placeholder="Nhập tổng tiền"
                                            min={0}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.TotalAmount && <p className="mt-1 text-sm text-red-500">{errors.TotalAmount.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Trạng thái</span>
                                <Controller
                                    name="Status"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                            {...field}
                                        >
                                            <option value="Đang xử lý">Đang xử lý</option>
                                            <option value="Đã giao">Đã giao</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    )}
                                />
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="font-bold text-slate-500">
                                    <span className="text-md">Ngày tạo</span>
                                    <Controller
                                        name="CreatedDate"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="datetime-local"
                                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                                {...field}
                                            />
                                        )}
                                    />
                                </label>
                                <label className="font-bold text-slate-500">
                                    <span className="text-md">Ngày cập nhật</span>
                                    <Controller
                                        name="UpdatedDate"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="datetime-local"
                                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                                {...field}
                                            />
                                        )}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Cập nhật đơn hàng" : "Thêm đơn hàng mới"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm đơn hàng"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderDetailsForm;

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createOrderStatus, updateOrderStatus } from "@/api/api";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";

const OrderStatusForm = () => {
    const navigate = useNavigate();
    const orderStatusData = useLoaderData();
    const isEditing = !!orderStatusData;
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  OrderStatusName: orderStatusData.orderStatusName || "",
                  IsActive: orderStatusData.isActive || true,
              }
            : {
                  OrderStatusName: "",
                  IsActive: true,
              },
    });

    useEffect(() => {
        if (isEditing) {
            reset({
                OrderStatusName: orderStatusData.orderStatusName,
                IsActive: orderStatusData.isActive,
            });
        }
    }, [orderStatusData, reset]);

    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            if (isEditing) {
                await updateOrderStatus({ Id: orderStatusData.id, ...data });
                toast.success("Order status updated successfully!");
            } else {
                await createOrderStatus(data);
                toast.success("Order status created successfully!");
            }
            navigate("/admin/order_status");
        } catch (error) {
            console.log("Toast error triggered:", error.message);
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/order_status")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Back
                </button>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
                        <div className="p-4 text-lg font-bold text-slate-800">Order Status Information</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Order Status Name</p>
                                </span>
                                <Controller
                                    name="OrderStatusName"
                                    control={control}
                                    rules={{
                                        required: "Order status name is required",
                                        maxLength: {
                                            value: 100,
                                            message: "Order status name must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.OrderStatusName ? "border-red-500" : ""}`}
                                            placeholder="Enter order status name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.OrderStatusName && <p className="mt-1 text-sm text-red-500">{errors.OrderStatusName.message}</p>}
                            </label>
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
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Order Status" : "Add New Order Status"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Order Status"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderStatusForm;

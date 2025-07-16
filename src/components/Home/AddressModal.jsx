import React, { useState, useEffect, useRef } from "react";
import { X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddressModal = ({ open, onClose, onSave, editingAddress = null }) => {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            label: "",
            fullName: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            isDefault: false,
        },
    });

    // Quản lý hiển thị modal giống CartModal
    useEffect(() => {
        if (open) {
            setShow(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        } else if (!open && show) {
            timeoutRef.current = setTimeout(() => setShow(false), 300);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [open, show]);

    // Điền dữ liệu form khi edit
    useEffect(() => {
        if (open && editingAddress) {
            setValue("label", editingAddress.label || "");
            setValue("fullName", editingAddress.fullName || "");
            setValue("phone", editingAddress.phone || "");
            setValue("address", editingAddress.address || "");
            setValue("city", editingAddress.city || "");
            setValue("state", editingAddress.state || "");
            setValue("zipCode", editingAddress.zipCode || "");
            setValue("isDefault", editingAddress.isDefault || false);
        } else if (open && !editingAddress) {
            // Reset form khi thêm mới
            reset();
        }
    }, [open, editingAddress, setValue, reset]);

    // Đóng modal bằng phím ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    // Xử lý ngăn không cho scroll khi modal bật lên
    useEffect(() => {
        if (open) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");

        return () => document.body.classList.remove("overflow-hidden");
    }, [open]);

    const onSubmit = (data) => {
        console.log("Address data:", data);
        if (onSave) {
            onSave(data);
        }
        toast.success(editingAddress ? "Address updated successfully!" : "Address saved successfully!");
        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <>
            {/* Nền mờ */}
            <div
                className={cn(
                    "fixed inset-0 z-[9998] bg-black transition-opacity duration-300",
                    open ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0",
                )}
                onClick={handleClose}
            />

            {/* Panel trượt từ bên phải */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 z-[9999] flex h-screen w-full flex-col justify-between bg-white transition-transform duration-300 sm:w-3/4 md:w-[32rem]",
                    open ? "translate-x-0" : "translate-x-full",
                )}
            >
                {/* Topbar của modal */}
                <div className="bg-[#1D349A] px-[15px] py-3 text-center text-[15px] font-semibold text-white">
                    📍 {editingAddress ? "Edit Address" : "Add New Address"}
                </div>

                {/* Header */}
                <div className="flex justify-between border-b px-4 py-3 text-[20px] font-bold md:px-7 md:py-4 md:text-[16px] lg:text-2xl">
                    <h2 className="flex items-center gap-2">
                        <MapPin className="h-6 w-6" />
                        <span>{editingAddress ? "Edit Address" : "New Address"}</span>
                    </h2>
                    {/* Nút đóng */}
                    <button
                        className="hover-rotate cursor-pointer"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X className="h-7 w-7 stroke-3" />
                    </button>
                </div>

                {/* Form nhập địa chỉ */}
                <div className="flex-1 overflow-auto px-4 py-6 md:px-7">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Label địa chỉ */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Address Label *</label>
                            <input
                                {...register("label", { required: "Address label is required" })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="e.g. Home, Office, Parent's House"
                            />
                            {errors.label && <p className="mt-1 text-sm text-red-500">{errors.label.message}</p>}
                        </div>

                        {/* Họ và tên */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
                            <input
                                {...register("fullName", { required: "Full name is required" })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter full name"
                            />
                            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input
                                {...register("phone", { required: "Phone number is required" })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter phone number"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Address *</label>
                            <textarea
                                {...register("address", { required: "Address is required" })}
                                rows={3}
                                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter full address"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                        </div>

                        {/* Thành phố và Bang */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">City *</label>
                                <input
                                    {...register("city", { required: "City is required" })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter city"
                                />
                                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">State *</label>
                                <input
                                    {...register("state", { required: "State is required" })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter state"
                                />
                                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
                            </div>
                        </div>

                        {/* Mã ZIP */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">ZIP Code *</label>
                            <input
                                {...register("zipCode", { required: "ZIP code is required" })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter ZIP code"
                            />
                            {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode.message}</p>}
                        </div>

                        {/* Checkbox địa chỉ mặc định */}
                        <div className="flex items-center">
                            <input
                                {...register("isDefault")}
                                type="checkbox"
                                id="isDefault"
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="isDefault"
                                className="text-sm font-medium text-gray-700"
                            >
                                Set as default address
                            </label>
                        </div>
                    </form>
                </div>

                {/* Footer với nút hành động */}
                <div className="w-full border-t border-gray-200 bg-white p-4 md:p-6">
                    <div className="flex gap-3">
                        <ButtonHovCT
                            type="button"
                            onClick={handleClose}
                            className="flex-1 !border-gray-300"
                            bgColor="bg-gray-100"
                            hoverBgColor="bg-gray-200"
                            textColor="text-gray-700"
                            hoverTextColor="text-gray-900"
                        >
                            Cancel
                        </ButtonHovCT>
                        <ButtonHovCT
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            className="flex-1 !border-black"
                            bgColor="bg-black"
                            hoverBgColor="bg-gray-800"
                            textColor="text-white"
                            hoverTextColor="text-white"
                        >
                            {editingAddress ? "Update Address" : "Save Address"}
                        </ButtonHovCT>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddressModal;

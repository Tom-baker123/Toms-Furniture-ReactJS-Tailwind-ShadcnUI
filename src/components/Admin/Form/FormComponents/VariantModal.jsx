import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonHovCT from "../../../tailwind-custom/ButtonHovCT";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

const VariantModal = ({ open, onClose, onSave, editingVariant = null, colors, sizes, materials, units, control, setValue }) => {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef();

    // Chuẩn hóa dữ liệu khi edit
    const getDefaultValues = useCallback(() => {
        if (editingVariant) {
            return {
                OriginalPrice: editingVariant.OriginalPrice || 0,
                DiscountedPrice: editingVariant.DiscountedPrice || "",
                StockQty: editingVariant.StockQty || 0,
                ColorId: editingVariant.ColorId || "",
                SizeId: editingVariant.SizeId || "",
                MaterialId: editingVariant.MaterialId || "",
                UnitId: editingVariant.UnitId || "",
            };
        }
        return {
            OriginalPrice: 0,
            DiscountedPrice: "",
            StockQty: 0,
            ColorId: "",
            SizeId: "",
            MaterialId: "",
            UnitId: "",
        };
    }, [editingVariant]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue: setModalValue,
        control: modalControl,
    } = useForm({
        defaultValues: getDefaultValues(),
    });

    // Quản lý hiển thị modal
    useEffect(() => {
        if (open) {
            const values = getDefaultValues();
            Object.keys(values).forEach((key) => setModalValue(key, values[key]));
        } else {
            reset();
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [open, editingVariant, getDefaultValues, setModalValue, reset]);

    // Đóng modal bằng phím ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && open) {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    // Xử lý ngăn không cho scroll khi modal bật lên
    useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [open]);

    // Submit form
    const onSubmit = useCallback(
        (data) => {
            try {
                const variantData = {
                    ...data,
                    OriginalPrice: Number(data.OriginalPrice),
                    DiscountedPrice: data.DiscountedPrice ? Number(data.DiscountedPrice) : null,
                    StockQty: Number(data.StockQty),
                };

                // If editing, update the main form's values
                if (editingVariant && editingVariant.index !== undefined) {
                    const index = editingVariant.index;
                    setValue(`ProductVariants[${index}].OriginalPrice`, variantData.OriginalPrice);
                    setValue(`ProductVariants[${index}].DiscountedPrice`, variantData.DiscountedPrice || "");
                    setValue(`ProductVariants[${index}].StockQty`, variantData.StockQty);
                    setValue(`ProductVariants[${index}].ColorId`, variantData.ColorId || "");
                    setValue(`ProductVariants[${index}].SizeId`, variantData.SizeId || "");
                    setValue(`ProductVariants[${index}].MaterialId`, variantData.MaterialId || "");
                    setValue(`ProductVariants[${index}].UnitId`, variantData.UnitId || "");
                    toast.success("Variant updated successfully");
                } else {
                    // For new variants, call the onSave callback
                    onSave(variantData);
                    toast.success("Variant added successfully");
                }

                reset();
                onClose();
            } catch (error) {
                console.error("Error saving variant:", error);
                toast.error("Failed to save variant");
            }
        },
        [editingVariant, onSave, reset, onClose, setValue],
    );

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);

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
                {/* Header */}
                <div className="flex justify-between border-b px-4 py-3 text-[20px] font-bold md:px-7 md:py-4 md:text-[16px] lg:text-2xl">
                    <h2 className="flex items-center gap-2">
                        <Package className="h-6 w-6" />
                        <span>{editingVariant ? "Edit Variant" : "New Variant"}</span>
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
                {/* Form nhập biến thể */}
                <div className="flex-1 overflow-auto px-4 py-6 md:px-7">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Original Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Original Price *</label>
                            <input
                                {...register("OriginalPrice", {
                                    required: "Original price is required",
                                    min: { value: 0, message: "Price must be non-negative" },
                                })}
                                type="number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter original price"
                            />
                            {errors.OriginalPrice && <p className="mt-1 text-sm text-red-500">{errors.OriginalPrice.message}</p>}
                        </div>

                        {/* Discounted Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Discounted Price</label>
                            <input
                                {...register("DiscountedPrice")}
                                type="number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter discounted price"
                            />
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Stock Quantity *</label>
                            <input
                                {...register("StockQty", {
                                    required: "Stock quantity is required",
                                    min: { value: 0, message: "Stock quantity must be non-negative" },
                                })}
                                type="number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter stock quantity"
                            />
                            {errors.StockQty && <p className="mt-1 text-sm text-red-500">{errors.StockQty.message}</p>}
                        </div>

                        {/* Color */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Color</label>
                            <Controller
                                name="ColorId"
                                control={modalControl}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Select color</option>
                                        {colors.map((color) => (
                                            <option
                                                key={color.id}
                                                value={color.id}
                                            >
                                                {color.colorName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>

                        {/* Size */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Size</label>
                            <Controller
                                name="SizeId"
                                control={modalControl}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Select size</option>
                                        {sizes.map((size) => (
                                            <option
                                                key={size.id}
                                                value={size.id}
                                            >
                                                {size.sizeName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>

                        {/* Material */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Material</label>
                            <Controller
                                name="MaterialId"
                                control={modalControl}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Select material</option>
                                        {materials.map((material) => (
                                            <option
                                                key={material.id}
                                                value={material.id}
                                            >
                                                {material.materialName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>

                        {/* Unit */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Unit</label>
                            <Controller
                                name="UnitId"
                                control={modalControl}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Select unit</option>
                                        {units.map((unit) => (
                                            <option
                                                key={unit.id}
                                                value={unit.id}
                                            >
                                                {unit.unitName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                    </form>
                </div>
                {/* Footer với nút hành động */}
                <div className="w-full border-t border-gray-200 bg-white p-4 md:p-6">
                    <div className="flex gap-3">
                        <ButtonHovCT
                            type="button"
                            onClick={handleClose}
                            className="flex-1 !font-bold"
                            bgColor="bg-gray-100"
                            hoverBgColor="bg-black"
                            textColor="text-black"
                            hoverTextColor="text-white"
                            border={false}
                        >
                            Cancel
                        </ButtonHovCT>
                        <ButtonHovCT
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            className="flex-1 !border-black"
                            bgColor="bg-black"
                            hoverBgColor="bg-white"
                            textColor="text-white"
                            hoverTextColor="text-black"
                        >
                            {editingVariant ? "Update Variant" : "Save Variant"}
                        </ButtonHovCT>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VariantModal;

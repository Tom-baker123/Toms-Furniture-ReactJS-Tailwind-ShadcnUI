import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminModal } from "@/context/AdminModalContext";

const VariantModalContent = ({ colors, sizes, materials, units, onAddVariant, onClose }) => {
    // State cho form biến thể mới
    const [newVariant, setNewVariant] = useState({
        OriginalPrice: "",
        DiscountedPrice: "",
        StockQty: "",
        ColorId: "",
        SizeId: "",
        MaterialId: "",
        UnitId: "",
    });

    // Validation errors
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form khi component mount
    useEffect(() => {
        setNewVariant({
            OriginalPrice: "",
            DiscountedPrice: "",
            StockQty: "",
            ColorId: "",
            SizeId: "",
            MaterialId: "",
            UnitId: "",
        });
        setValidationErrors({});
    }, []);

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!newVariant.OriginalPrice || newVariant.OriginalPrice <= 0) {
            errors.OriginalPrice = "Original price is required and must be greater than 0";
        }

        if (!newVariant.StockQty || newVariant.StockQty < 0) {
            errors.StockQty = "Stock quantity is required and must be non-negative";
        }

        if (newVariant.DiscountedPrice && parseFloat(newVariant.DiscountedPrice) >= parseFloat(newVariant.OriginalPrice)) {
            errors.DiscountedPrice = "Discounted price must be less than original price";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input change
    const handleInputChange = (field, value) => {
        setNewVariant((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                const variantData = {
                    OriginalPrice: parseFloat(newVariant.OriginalPrice) || 0,
                    DiscountedPrice: parseFloat(newVariant.DiscountedPrice) || null,
                    StockQty: parseInt(newVariant.StockQty) || 0,
                    ColorId: newVariant.ColorId || "",
                    SizeId: newVariant.SizeId || "",
                    MaterialId: newVariant.MaterialId || "",
                    UnitId: newVariant.UnitId || "",
                };

                await onAddVariant(variantData);
                onClose();
            } catch (error) {
                console.error("Error adding variant:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            {/* Header */}
            <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Add Product Variant</h2>
                <p className="text-gray-600">Fill in the details to add a new product variant</p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* Price Information */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Price Information</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Original Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Original Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={newVariant.OriginalPrice}
                                onChange={(e) => handleInputChange("OriginalPrice", e.target.value)}
                                className={cn(
                                    "w-full rounded-md border px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500",
                                    validationErrors.OriginalPrice ? "border-red-500" : "border-gray-300",
                                )}
                                placeholder="Enter original price"
                            />
                            {validationErrors.OriginalPrice && <p className="mt-1 text-sm text-red-600">{validationErrors.OriginalPrice}</p>}
                        </div>

                        {/* Discounted Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Discounted Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={newVariant.DiscountedPrice}
                                onChange={(e) => handleInputChange("DiscountedPrice", e.target.value)}
                                className={cn(
                                    "w-full rounded-md border px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500",
                                    validationErrors.DiscountedPrice ? "border-red-500" : "border-gray-300",
                                )}
                                placeholder="Enter discounted price (optional)"
                            />
                            {validationErrors.DiscountedPrice && <p className="mt-1 text-sm text-red-600">{validationErrors.DiscountedPrice}</p>}
                        </div>
                    </div>
                </div>

                {/* Inventory Information */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Inventory Information</h3>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={newVariant.StockQty}
                            onChange={(e) => handleInputChange("StockQty", e.target.value)}
                            className={cn(
                                "w-full max-w-xs rounded-md border px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500",
                                validationErrors.StockQty ? "border-red-500" : "border-gray-300",
                            )}
                            placeholder="Enter stock quantity"
                        />
                        {validationErrors.StockQty && <p className="mt-1 text-sm text-red-600">{validationErrors.StockQty}</p>}
                    </div>
                </div>

                {/* Attributes */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Product Attributes</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Color */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Color</label>
                            <select
                                value={newVariant.ColorId}
                                onChange={(e) => handleInputChange("ColorId", e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select color</option>
                                {colors?.map((color) => (
                                    <option
                                        key={color.id}
                                        value={color.id}
                                    >
                                        {color.colorName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Size */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Size</label>
                            <select
                                value={newVariant.SizeId}
                                onChange={(e) => handleInputChange("SizeId", e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select size</option>
                                {sizes?.map((size) => (
                                    <option
                                        key={size.id}
                                        value={size.id}
                                    >
                                        {size.sizeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Material */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Material</label>
                            <select
                                value={newVariant.MaterialId}
                                onChange={(e) => handleInputChange("MaterialId", e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select material</option>
                                {materials?.map((material) => (
                                    <option
                                        key={material.id}
                                        value={material.id}
                                    >
                                        {material.materialName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Unit */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Unit</label>
                            <select
                                value={newVariant.UnitId}
                                onChange={(e) => handleInputChange("UnitId", e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select unit</option>
                                {units?.map((unit) => (
                                    <option
                                        key={unit.id}
                                        value={unit.id}
                                    >
                                        {unit.unitName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        {isSubmitting ? "Adding..." : "Add Variant"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Hook để sử dụng Variant Modal
export const useVariantModal = () => {
    const { openModal, closeModal } = useAdminModal();

    const openVariantModal = ({ colors, sizes, materials, units, onAddVariant }) => {
        openModal(
            <VariantModalContent
                colors={colors}
                sizes={sizes}
                materials={materials}
                units={units}
                onAddVariant={onAddVariant}
                onClose={closeModal}
            />,
            {
                className: "max-w-4xl",
            },
        );
    };

    return { openVariantModal, closeModal };
};

export default VariantModalContent;

import React from "react";
import { Plus, Trash, Edit } from "lucide-react";

const VariantForm = ({
    fields,
    control,
    errors,
    colors,
    sizes,
    materials,
    units,
    deletingVariant,
    handleDeleteVariant,
    append,
    remove,
    watch,
    setValue,
    isModalOpen,
    editingVariant,
    handleAddVariant,
    handleEditVariant,
    handleModalClose,
    handleSaveVariant,
}) => {
    // Get variant display names helper functions
    const getColorName = (colorId) => {
        const color = colors.find((c) => c.id == colorId);
        return color ? color.colorName : "N/A";
    };

    const getSizeName = (sizeId) => {
        const size = sizes.find((s) => s.id == sizeId);
        return size ? size.sizeName : "N/A";
    };

    const getMaterialName = (materialId) => {
        const material = materials.find((m) => m.id == materialId);
        return material ? material.materialName : "N/A";
    };

    const getUnitName = (unitId) => {
        const unit = units.find((u) => u.id == unitId);
        return unit ? unit.unitName : "N/A";
    };

    return (
        <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-3">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Product Variants</h2>
            <div className="space-y-4">
                {/* Variants List */}
                {fields.length > 0 ? (
                    <div className="space-y-3">
                        {fields.map((field, index) => {
                            const variant = watch(`ProductVariants[${index}]`) || {};
                            return (
                                <div
                                    key={field.id}
                                    className="relative cursor-pointer rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                                    onClick={() => handleEditVariant(index)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                                                <div>
                                                    <span className="text-xs font-medium text-gray-500">Original Price</span>
                                                    <p className="text-sm font-semibold text-gray-900">${variant.OriginalPrice || 0}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-gray-500">Discounted Price</span>
                                                    <p className="text-sm text-gray-700">
                                                        {variant.DiscountedPrice ? `$${variant.DiscountedPrice}` : "No discount"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-gray-500">Stock Quantity</span>
                                                    <p className="text-sm text-gray-700">{variant.StockQty || 0}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-gray-500">Attributes</span>
                                                    <p className="text-sm text-gray-700">
                                                        {[
                                                            variant.ColorId ? getColorName(variant.ColorId) : null,
                                                            variant.SizeId ? getSizeName(variant.SizeId) : null,
                                                            variant.MaterialId ? getMaterialName(variant.MaterialId) : null,
                                                            variant.UnitId ? getUnitName(variant.UnitId) : null,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ") || "No attributes"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditVariant(index);
                                                }}
                                                className="text-blue-500 transition-colors duration-200 hover:text-blue-600"
                                                title="Edit variant"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteVariant(index);
                                                }}
                                                disabled={deletingVariant === index}
                                                className="text-red-500 transition-colors duration-200 hover:text-red-600"
                                                title="Delete variant"
                                            >
                                                {deletingVariant === index ? <span className="animate-spin">⌛</span> : <Trash size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    {/* Error display for this variant */}
                                    {(errors.ProductVariants?.[index]?.OriginalPrice || errors.ProductVariants?.[index]?.StockQty) && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.ProductVariants[index]?.OriginalPrice?.message ||
                                                errors.ProductVariants[index]?.StockQty?.message}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-2 text-center">
                        <p className="mb-2 text-gray-500">No variants added yet</p>
                        <p className="text-sm text-gray-400">Click "Add Variant" to create your first product variant</p>
                    </div>
                )}

                {/* Add Variant Button */}
                <button
                    type="button"
                    className="flex items-center gap-2 text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
                    onClick={handleAddVariant}
                >
                    <Plus className="h-5 w-5" />
                    <span className="cursor-pointer text-sm font-medium">Add Variant</span>
                </button>
            </div>
        </div>
    );
};

export default VariantForm;

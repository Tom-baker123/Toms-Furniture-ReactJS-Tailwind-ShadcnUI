import React from "react";
import { Plus, Trash, Edit, Image, Copy } from "lucide-react";
import { formatVNDForDisplay } from "@/utils/currencyUtils";

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
    // Variant Images Props
    variantImages = {},
    variantImageErrors = {},
    // Thêm prop handleDuplicateVariant
    handleDuplicateVariant,
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
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Biến Thể Sản Phẩm</h2>
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
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Variant Images Column */}
                                        <div className="flex-shrink-0">
                                            <div className="flex flex-col items-center">
                                                <span className="mb-2 text-xs font-medium text-gray-500">
                                                    Hình Ảnh ({variantImages[index]?.length || 0})
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {variantImages[index] && variantImages[index].length > 0 ? (
                                                        <>
                                                            {/* Show first 3 images */}
                                                            {variantImages[index].slice(0, 3).map((image, imgIndex) => (
                                                                <div
                                                                    key={imgIndex}
                                                                    className="group relative h-12 w-12 rounded border border-gray-200 transition-transform hover:scale-110"
                                                                    title={`${image.attribute || "No description"} ${image.id ? "(Saved)" : "(New)"}`}
                                                                >
                                                                    <img
                                                                        src={image.preview}
                                                                        alt={`Variant ${index + 1} image ${imgIndex + 1}`}
                                                                        className="h-full w-full rounded object-cover transition-opacity group-hover:opacity-90"
                                                                    />
                                                                    {/* Status badge - fixed positioning */}
                                                                    <div className="absolute top-0 right-0 translate-x-1 -translate-y-2.5">
                                                                        <span
                                                                            className={`inline-block h-3 w-3 rounded-full border border-white ${
                                                                                image.id && image.id > 0 ? "bg-green-400" : "bg-yellow-400"
                                                                            }`}
                                                                            title={image.id && image.id > 0 ? "Saved to server" : "Not saved yet"}
                                                                        ></span>
                                                                    </div>
                                                                    {/* Hover overlay */}
                                                                    <div className="absolute inset-0 rounded bg-black opacity-0 transition-opacity group-hover:opacity-20"></div>
                                                                </div>
                                                            ))}
                                                            {/* Show count if more than 3 images */}
                                                            {variantImages[index].length > 3 && (
                                                                <div className="flex h-12 w-12 items-center justify-center rounded border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100">
                                                                    +{variantImages[index].length - 3}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100">
                                                            <Image className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Image error indicator */}
                                                {variantImageErrors[index] && (
                                                    <div className="mt-1 rounded bg-red-50 px-2 py-1 text-xs text-red-600">⚠️ Thiếu hình ảnh</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Variant Details Column */}
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                                                <div>
                                                    <span className="text-xs font-medium text-gray-500">Giá Gốc</span>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatVNDForDisplay(variant.OriginalPrice || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-gray-500">Giá Khuyến Mãi</span>
                                                    <p className="text-sm text-gray-700">
                                                        {variant.DiscountedPrice ? formatVNDForDisplay(variant.DiscountedPrice) : "Không giảm giá"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-gray-500">Số Lượng Tồn Kho</span>
                                                    <p className="text-sm text-gray-700">{variant.StockQty || 0}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-gray-500">Thuộc Tính</span>
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {[
                                                            variant.ColorId ? { type: "Màu sắc", value: getColorName(variant.ColorId) } : null,
                                                            variant.SizeId ? { type: "Kích cỡ", value: getSizeName(variant.SizeId) } : null,
                                                            variant.MaterialId
                                                                ? { type: "Chất liệu", value: getMaterialName(variant.MaterialId) }
                                                                : null,
                                                            variant.UnitId ? { type: "Đơn vị", value: getUnitName(variant.UnitId) } : null,
                                                        ]
                                                            .filter(Boolean)
                                                            .map((attr, attrIndex) => (
                                                                <span
                                                                    key={attrIndex}
                                                                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                                                                    title={`${attr.type}: ${attr.value}`}
                                                                >
                                                                    {attr.value}
                                                                </span>
                                                            ))}
                                                        {![variant.ColorId, variant.SizeId, variant.MaterialId, variant.UnitId].some(Boolean) && (
                                                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                                                                No attributes
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons Column */}
                                        <div className="flex flex-shrink-0 items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditVariant(index);
                                                }}
                                                className="text-blue-500 transition-colors duration-200 hover:text-blue-600"
                                                title="Chỉnh sửa biến thể"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            {handleDuplicateVariant && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDuplicateVariant(index);
                                                    }}
                                                    className="text-green-500 transition-colors duration-200 hover:text-green-600"
                                                    title="Nhân đôi biến thể"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteVariant(index);
                                                }}
                                                disabled={deletingVariant === index}
                                                className="text-red-500 transition-colors duration-200 hover:text-red-600"
                                                title="Xóa biến thể"
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
                        <p className="mb-2 text-gray-500">Chưa có biến thể nào được thêm</p>
                        <p className="text-sm text-gray-400">Nhấp "Thêm Biến Thể" để tạo biến thể sản phẩm đầu tiên</p>
                    </div>
                )}

                {/* Add Variant Button */}
                <button
                    type="button"
                    className="flex items-center gap-2 text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
                    onClick={handleAddVariant}
                >
                    <Plus className="h-5 w-5" />
                    <span className="cursor-pointer text-sm font-medium">Thêm Biến Thể</span>
                </button>
            </div>
        </div>
    );
};

export default VariantForm;

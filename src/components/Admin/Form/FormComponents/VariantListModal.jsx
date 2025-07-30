import React, { useState, useEffect, useRef } from "react";
import { X, Edit, Trash, ShoppingCart, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const VariantListModal = ({
    open,
    onClose,
    variants = [],
    colors = [],
    sizes = [],
    materials = [],
    units = [],
    onEditVariant,
    onDeleteVariant,
    isDeleting = false,
}) => {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef();

    // Quản lý hiển thị modal
    useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setShow(true), 10);
        } else {
            setShow(false);
            timeoutRef.current = setTimeout(() => {
                document.body.classList.remove("overflow-hidden");
            }, 300);
        }

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [open, show]);

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

    // Helper functions to get names
    const getColorName = (colorId) => colors.find((c) => c.id == colorId)?.colorName || "N/A";
    const getSizeName = (sizeId) => sizes.find((s) => s.id == sizeId)?.sizeName || "N/A";
    const getMaterialName = (materialId) => materials.find((m) => m.id == materialId)?.materialName || "N/A";
    const getUnitName = (unitId) => units.find((u) => u.id == unitId)?.unitName || "N/A";

    if (!open && !show) return null;

    return (
        <>
            {/* Nền mờ */}
            <div
                className={cn(
                    "fixed inset-0 z-[9998] bg-black transition-opacity duration-300",
                    open ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0",
                )}
                onClick={onClose}
            />

            {/* Panel trượt từ bên phải */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 z-[9999] flex h-screen w-full flex-col justify-between bg-white transition-transform duration-300 sm:w-3/4 md:w-[48rem] lg:w-[56rem]",
                    open ? "translate-x-0" : "translate-x-full",
                )}
            >
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 text-center text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Product Variants</h2>
                            <p className="text-sm text-indigo-100">Manage your product variations</p>
                        </div>
                        <button
                            className="hover-rotate cursor-pointer rounded-full p-2 transition-colors hover:bg-indigo-700"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Counter */}
                <div className="flex justify-between border-b bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        <span>Total Variants: {variants?.length || 0}</span>
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="h-4 w-4" />
                        <span>Stock: {variants?.reduce((sum, v) => sum + (parseInt(v.StockQty) || 0), 0)}</span>
                    </div>
                </div>

                {/* Nội dung modal - Danh sách variants */}
                <div className="flex-1 overflow-auto px-6 py-4">
                    {variants && variants.length > 0 ? (
                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                                >
                                    {/* Variant Icon */}
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                                        <Package className="h-8 w-8 text-indigo-600" />
                                    </div>

                                    {/* Variant Details */}
                                    <div className="min-w-0 flex-1">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {/* Left Column */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-semibold text-gray-900">Variant #{index + 1}</h4>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => onEditVariant && onEditVariant(index)}
                                                            className="p-1 text-indigo-600 transition-colors hover:text-indigo-800"
                                                            title="Edit variant"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onDeleteVariant && onDeleteVariant(index)}
                                                            disabled={isDeleting}
                                                            className="p-1 text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
                                                            title="Delete variant"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Original Price:</span>
                                                        <span className="font-semibold text-green-600">
                                                            ${variant.OriginalPrice?.toLocaleString() || 0}
                                                        </span>
                                                    </div>

                                                    {variant.DiscountedPrice && (
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-600">Discounted Price:</span>
                                                            <span className="font-semibold text-orange-600">
                                                                ${variant.DiscountedPrice?.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Stock:</span>
                                                        <span
                                                            className={cn(
                                                                "font-semibold",
                                                                (variant.StockQty || 0) > 10
                                                                    ? "text-green-600"
                                                                    : (variant.StockQty || 0) > 5
                                                                      ? "text-yellow-600"
                                                                      : "text-red-600",
                                                            )}
                                                        >
                                                            {variant.StockQty || 0} units
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="space-y-2">
                                                <h5 className="mb-2 text-sm font-medium text-gray-900">Attributes</h5>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Color:</span>
                                                        <div className="font-medium">{getColorName(variant.ColorId)}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Size:</span>
                                                        <div className="font-medium">{getSizeName(variant.SizeId)}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Material:</span>
                                                        <div className="font-medium">{getMaterialName(variant.MaterialId)}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Unit:</span>
                                                        <div className="font-medium">{getUnitName(variant.UnitId)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                                <ShoppingCart
                                    size={48}
                                    className="text-gray-400"
                                />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">No variants yet</h3>
                            <p className="mb-4 text-gray-500">Start by adding your first product variant</p>
                            <button
                                onClick={onClose}
                                className="rounded-md bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
                            >
                                Add Variant
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Total Value:{" "}
                            <span className="font-semibold text-gray-900">
                                $
                                {variants
                                    ?.reduce((sum, v) => sum + (v.DiscountedPrice || v.OriginalPrice || 0) * (v.StockQty || 0), 0)
                                    .toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VariantListModal;

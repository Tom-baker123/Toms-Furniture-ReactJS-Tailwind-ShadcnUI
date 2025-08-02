import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Package, ImagePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonHovCT from "../../../tailwind-custom/ButtonHovCT";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { formatVNDForInput, parseVND, isValidVNDFormat } from "@/utils/currencyUtils";

const VariantModal = ({
    open,
    onClose,
    onSave,
    editingVariant = null,
    colors,
    sizes,
    materials,
    units,
    control,
    setValue,
    // Variant Images Props
    variantImages = {},
    variantImageErrors = {},
    handleAddVariantImage,
    handleRemoveVariantImage,
    handleUpdateVariantImageInfo,
}) => {
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
                console.log("🔵 [VariantModal] onSubmit called:", {
                    data,
                    editingVariant,
                    isNew: editingVariant?.isNew
                });

                const variantData = {
                    ...data,
                    OriginalPrice: Number(data.OriginalPrice),
                    DiscountedPrice: data.DiscountedPrice ? Number(data.DiscountedPrice) : null,
                    StockQty: Number(data.StockQty),
                };

                // If editing existing variant (not new), update the main form's values
                if (editingVariant && editingVariant.index !== undefined && !editingVariant.isNew) {
                    console.log("✏️ [VariantModal] Updating existing variant");
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
                    console.log("➕ [VariantModal] Adding new variant, calling onSave");
                    onSave(variantData);
                    toast.success("Variant added successfully");
                }

                reset();
                onClose();
            } catch (error) {
                console.error("Error saving variant:", error);
                toast.error("Không thể lưu biến thể");
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
                        <span>{editingVariant && !editingVariant.isNew ? "Chỉnh Sửa Biến Thể" : "Biến Thể Mới"}</span>
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Giá Gốc *</label>
                            <input
                                {...register("OriginalPrice", {
                                    required: "Giá gốc là bắt buộc",
                                    min: { value: 0, message: "Giá phải là số không âm" },
                                })}
                                type="number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Nhập giá gốc (VND)"
                            />
                            {errors.OriginalPrice && <p className="mt-1 text-sm text-red-500">{errors.OriginalPrice.message}</p>}
                        </div>

                        {/* Discounted Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Giá Khuyến Mãi</label>
                            <input
                                {...register("DiscountedPrice")}
                                type="number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Nhập giá khuyến mãi (VND)"
                            />
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Số Lượng Tồn Kho *</label>
                            <input
                                {...register("StockQty", {
                                    required: "Số lượng tồn kho là bắt buộc",
                                    min: { value: 0, message: "Số lượng tồn kho phải là số không âm" },
                                })}
                                type="number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Nhập số lượng tồn kho"
                            />
                            {errors.StockQty && <p className="mt-1 text-sm text-red-500">{errors.StockQty.message}</p>}
                        </div>

                        {/* Color */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Màu Sắc</label>
                            <Controller
                                name="ColorId"
                                control={modalControl}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Chọn màu sắc</option>
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Kích Cỡ</label>
                            <Controller
                                name="SizeId"
                                control={modalControl}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Chọn kích cỡ</option>
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Chất Liệu</label>
                            <Controller
                                name="MaterialId"
                                control={modalControl}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Chọn chất liệu</option>
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Đơn Vị</label>
                            <Controller
                                name="UnitId"
                                control={modalControl}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Chọn đơn vị</option>
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

                        {/* Variant Images Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Variant Images
                                    {editingVariant?.index !== undefined && variantImages[editingVariant.index] && (
                                        <span className="ml-2 text-xs text-gray-500">({variantImages[editingVariant.index].length})</span>
                                    )}
                                </label>
                            </div>

                            {/* Images Grid */}
                            <div className="space-y-4">
                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id={`variant-image-upload-${editingVariant?.index || "new"}`}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        const variantIndex = editingVariant?.index;

                                        console.log("🔍 [DEBUG] File input change:", {
                                            file: file ? { name: file.name, size: file.size } : null,
                                            variantIndex,
                                            editingVariant,
                                            handleAddVariantImage: !!handleAddVariantImage,
                                        });

                                        if (file && variantIndex !== undefined && handleAddVariantImage) {
                                            console.log("✅ [DEBUG] Conditions met, proceeding with image addition");
                                            // Nếu đã có ảnh thì xóa ảnh cũ trước
                                            if (variantImages[variantIndex] && variantImages[variantIndex].length > 0) {
                                                console.log("🗑️ [DEBUG] Removing existing images");
                                                // Xóa tất cả ảnh cũ của variant này bằng cách xóa từ cuối lên đầu
                                                const totalImages = variantImages[variantIndex].length;
                                                for (let i = totalImages - 1; i >= 0; i--) {
                                                    if (handleRemoveVariantImage) {
                                                        handleRemoveVariantImage(variantIndex, i);
                                                    }
                                                }
                                            }
                                            // Thêm ảnh mới
                                            console.log("➕ [DEBUG] Adding new image");
                                            handleAddVariantImage(variantIndex, file);
                                        } else {
                                            console.warn("❌ [DEBUG] Conditions not met:", {
                                                hasFile: !!file,
                                                hasVariantIndex: variantIndex !== undefined,
                                                hasHandler: !!handleAddVariantImage,
                                            });
                                        }
                                        e.target.value = ""; // Reset input
                                    }}
                                />

                                {/* Combined Add/Display Image Area */}
                                <label
                                    htmlFor={`variant-image-upload-${editingVariant?.index || "new"}`}
                                    className="group relative flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100"
                                    style={{
                                        minHeight:
                                            editingVariant?.index !== undefined &&
                                            variantImages[editingVariant.index] &&
                                            variantImages[editingVariant.index].length > 0
                                                ? "auto"
                                                : "12rem",
                                    }}
                                >
                                    {/* Debug logging for image display conditions */}
                                    {console.log("🔍 [VariantModal] Image display check:", {
                                        editingVariant,
                                        editingVariantIndex: editingVariant?.index,
                                        indexNotUndefined: editingVariant?.index !== undefined,
                                        hasImagesForIndex: !!(editingVariant?.index !== undefined && variantImages[editingVariant.index]),
                                        imageCount: editingVariant?.index !== undefined ? variantImages[editingVariant.index]?.length || 0 : 0,
                                        variantImages
                                    })}
                                    
                                    {/* If image exists, show it */}
                                    {editingVariant?.index !== undefined &&
                                    variantImages[editingVariant.index] &&
                                    variantImages[editingVariant.index].length > 0 ? (
                                        <div className="relative w-full">
                                            {variantImages[editingVariant.index].map((image, imageIndex) => (
                                                <div
                                                    key={imageIndex}
                                                    className="relative"
                                                >
                                                    {/* Image Status Badge */}
                                                    <div className="absolute top-3 left-3 z-20">
                                                        <span
                                                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg ${
                                                                image.id && image.id > 0 ? "bg-green-500" : "bg-yellow-500"
                                                            }`}
                                                            title={image.id && image.id > 0 ? "Đã lưu trên server" : "Chưa được lưu"}
                                                        >
                                                            {image.id && image.id > 0 ? "✓" : "•"}
                                                        </span>
                                                    </div>

                                                    {/* Delete Button - Top Right Corner */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            if (handleRemoveVariantImage && editingVariant?.index !== undefined) {
                                                                handleRemoveVariantImage(editingVariant.index, imageIndex);
                                                            }
                                                        }}
                                                        className="absolute top-3 right-3 z-20 rounded-full bg-red-500 p-2 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-red-600"
                                                        title="Xóa hình ảnh"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>

                                                    <div className="aspect-video overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-md">
                                                        <img
                                                            src={image.preview}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* If no image, show add button */
                                        <div className="py-12 text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 transition-all duration-200 group-hover:bg-gray-300">
                                                <ImagePlus className="h-8 w-8 text-gray-500 transition-transform duration-200 group-hover:scale-110" />
                                            </div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-700">Thêm Hình Ảnh Biến Thể</h3>
                                            <p className="text-sm text-gray-500">Nhấp vào đây để tải lên hình ảnh cho biến thể này</p>
                                            <p className="mt-1 text-xs text-gray-400">Supports JPG, PNG files</p>
                                        </div>
                                    )}

                                    {/* Overlay for replacing image when image exists */}
                                    {editingVariant?.index !== undefined &&
                                        variantImages[editingVariant.index] &&
                                        variantImages[editingVariant.index].length > 0 && (
                                            <div className="bg-opacity-0 group-hover:bg-opacity-60 absolute inset-0 flex items-center justify-center rounded-xl bg-black opacity-0 transition-all duration-200 group-hover:opacity-100">
                                                <div className="text-center text-white">
                                                    <ImagePlus className="mx-auto mb-2 h-8 w-8" />
                                                    <p className="text-sm font-medium">Click to replace image</p>
                                                </div>
                                            </div>
                                        )}
                                </label>

                                {/* Image Description Input - Below the image area */}
                                {editingVariant?.index !== undefined &&
                                    variantImages[editingVariant.index] &&
                                    variantImages[editingVariant.index].length > 0 && (
                                        <div>
                                            {variantImages[editingVariant.index].map((image, imageIndex) => (
                                                <input
                                                    key={imageIndex}
                                                    type="text"
                                                    placeholder="Mô tả hình ảnh"
                                                    value={image.attribute || ""}
                                                    onChange={(e) => {
                                                        if (handleUpdateVariantImageInfo && editingVariant?.index !== undefined) {
                                                            handleUpdateVariantImageInfo(
                                                                editingVariant.index,
                                                                imageIndex,
                                                                "attribute",
                                                                e.target.value,
                                                            );
                                                        }
                                                    }}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                />
                                            ))}
                                        </div>
                                    )}
                            </div>

                            {/* Error Message */}
                            {editingVariant?.index !== undefined && variantImageErrors[editingVariant.index] && (
                                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-500">⚠️</span>
                                        {variantImageErrors[editingVariant.index]}
                                    </div>
                                </div>
                            )}

                            {/* Info message */}
                            {(editingVariant?.index === undefined ||
                                !variantImages[editingVariant?.index] ||
                                variantImages[editingVariant?.index]?.length === 0) && (
                                <div className="w-full rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">💡</span>
                                        Nhấp vào hộp "Thêm Hình Ảnh" để tải lên hình ảnh biến thể. Hình ảnh giúp khách hàng nhìn thấy rõ các biến thể
                                        sản phẩm.
                                    </div>
                                </div>
                            )}
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
                            Hủy
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
                            {editingVariant && !editingVariant.isNew ? "Cập Nhật Biến Thể" : "Lưu Biến Thể"}
                        </ButtonHovCT>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VariantModal;

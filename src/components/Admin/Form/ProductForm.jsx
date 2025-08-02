import React, { useState } from "react";
import { MoveLeft, Save } from "lucide-react";
import ProductImages from "./FormComponents/ProductImages";
import VariantForm from "./FormComponents/VariantForm";
import VariantModal from "./FormComponents/VariantModal";
import FormField from "./FormComponents/FormField";
import { useProductFormLogic } from "./useProductFormLogic";
import { useFormFields } from "@/hooks/useFormFields";
// import DebugInfo from "../DebugInfo";

const ProductForm = () => {
    const {
        control,
        handleSubmit,
        errors,
        isSubmitting,
        watch,
        setValue,
        fields,
        append,
        remove,
        isLoading,
        images,
        setImages,
        imageErrors,
        setImageErrors,
        deletingVariant,
        handleDeleteVariant,
        onSubmit,
        isEditing,
        navigate,
        categories,
        brands,
        countries,
        suppliers,
        colors,
        sizes,
        materials,
        units,
        deleteSlider,
        // Variant Images
        variantImages,
        setVariantImages,
        variantImageErrors,
        handleAddVariantImage,
        handleRemoveVariantImage,
        handleUpdateVariantImageInfo,
        handleSaveVariantImages,
        validateVariantImages,
    } = useProductFormLogic();

    const { formFields, getFieldError, getFieldClassName } = useFormFields({
        control,
        errors,
        categories,
        brands,
        countries,
        suppliers,
        isEditing,
    });

    // Modal state management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    // Handle opening modal for new variant
    const handleAddVariant = () => {
        // Khi thêm variant mới, tạo index tạm thời để quản lý ảnh
        // Sử dụng index âm để tránh conflict với index thực
        const tempIndex = -1;
        console.log("🔵 [DEBUG] handleAddVariant - Creating temp index:", tempIndex);
        console.log("📊 [DEBUG] Current fields length:", fields.length);
        console.log("📁 [DEBUG] Current variant images:", variantImages);
        
        setEditingVariant({
            index: tempIndex,
            isNew: true,
        });
        setIsModalOpen(true);
    };

    // Handle opening modal for editing variant
    const handleEditVariant = (index) => {
        const variant = fields[index];
        const watchedData = watch(`ProductVariants[${index}]`) || {};

        setEditingVariant({
            index,
            ...variant,
            ...watchedData,
        });
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingVariant(null);
    };

    // Handle saving variant (add or update)
    const handleSaveVariant = (variantData) => {
        console.log("🔵 [DEBUG] handleSaveVariant called:", {
            editingVariant,
            variantData,
            currentVariantImages: variantImages,
            fieldsLength: fields.length
        });

        if (editingVariant && editingVariant.index !== undefined && !editingVariant.isNew) {
            // Update existing variant - handled by the modal
            console.log("✏️ [DEBUG] Updating existing variant at index:", editingVariant.index, variantData);
        } else {
            // Add new variant
            const newVariantIndex = fields.length;
            console.log("➕ [DEBUG] Adding new variant. New index will be:", newVariantIndex);
            console.log("📊 [DEBUG] Current fields length:", fields.length);
            console.log("📁 [DEBUG] Current variant images before append:", variantImages);

            // Thêm variant mới trước
            append({
                Id: 0,
                OriginalPrice: variantData.OriginalPrice || "",
                DiscountedPrice: variantData.DiscountedPrice || null,
                StockQty: variantData.StockQty || "",
                ColorId: variantData.ColorId || null,
                SizeId: variantData.SizeId || null,
                MaterialId: variantData.MaterialId || null,
                UnitId: variantData.UnitId || null,
            });

            // Sử dụng setTimeout để đảm bảo append đã hoàn thành
            setTimeout(() => {
                console.log("⏰ [DEBUG] Timeout - checking images after append");
                console.log("📊 [DEBUG] Fields length after append:", fields.length);
                
                // Nếu có ảnh cho variant mới, di chuyển từ index tạm thời sang index thực
                if (editingVariant && editingVariant.index !== undefined && variantImages[editingVariant.index]) {
                    const tempImages = variantImages[editingVariant.index];
                    const tempIndex = editingVariant.index;
                    console.log("🔄 [DEBUG] Moving images from temp index", tempIndex, "to actual index", newVariantIndex);
                    console.log("📁 [DEBUG] Images to move:", tempImages);

                    setVariantImages(prevImages => {
                        const newVariantImages = { ...prevImages };
                        delete newVariantImages[tempIndex]; // Xóa ảnh ở index tạm thời
                        newVariantImages[newVariantIndex] = tempImages; // Thêm ảnh vào index thực
                        console.log("✅ [DEBUG] Images moved successfully. New state:", newVariantImages);
                        return newVariantImages;
                    });
                } else {
                    console.log("ℹ️ [DEBUG] No images to move or editingVariant not found:", {
                        hasEditingVariant: !!editingVariant,
                        editingVariantIndex: editingVariant?.index,
                        hasImages: !!(editingVariant && variantImages[editingVariant.index]),
                        currentVariantImages: variantImages
                    });
                }
            }, 100); // Đợi 100ms để đảm bảo append hoàn thành
        }
    };

    // Handle duplicating variant
    const handleDuplicateVariant = (index) => {
        const variantToDuplicate = fields[index];
        const watchedData = watch(`ProductVariants[${index}]`) || {};
        
        // Tạo variant mới với dữ liệu giống hệt variant gốc
        const duplicatedVariant = {
            Id: 0, // ID mới sẽ được tạo khi save
            OriginalPrice: watchedData.OriginalPrice || variantToDuplicate.OriginalPrice || 0,
            DiscountedPrice: watchedData.DiscountedPrice || variantToDuplicate.DiscountedPrice || null,
            StockQty: watchedData.StockQty || variantToDuplicate.StockQty || 0,
            ColorId: watchedData.ColorId || variantToDuplicate.ColorId || null,
            SizeId: watchedData.SizeId || variantToDuplicate.SizeId || null,
            MaterialId: watchedData.MaterialId || variantToDuplicate.MaterialId || null,
            UnitId: watchedData.UnitId || variantToDuplicate.UnitId || null,
        };

        // Thêm variant mới vào form
        append(duplicatedVariant);

        // Sao chép ảnh của variant gốc (nếu có)
        if (variantImages[index] && variantImages[index].length > 0) {
            const newVariantIndex = fields.length; // Index của variant mới
            const duplicatedImages = variantImages[index].map(image => ({
                ...image,
                id: null, // Ảnh mới sẽ không có ID từ server
                // Giữ nguyên file và preview để có thể upload lại
            }));

            const newVariantImages = { ...variantImages };
            newVariantImages[newVariantIndex] = duplicatedImages;
            setVariantImages(newVariantImages);
            
            console.log("🔄 Duplicated variant with", duplicatedImages.length, "images");
        }

        console.log("✅ Variant duplicated successfully");
    };

    return (
        <>
            <div className="min-h-screen">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/admin/products")}
                        className="flex items-center gap-2 text-blue-600 transition-colors duration-200 hover:text-indigo-800"
                    >
                        <MoveLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">Quay Lại Danh Sách Sản Phẩm</span>
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                            {isEditing ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                        </h1>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className={`button-admin-hover`}
                            >
                                <Save className="h-5 w-5 sm:mr-2" />
                                <span className="max-sm:hidden">
                                    {isSubmitting || isLoading ? "Đang Xử Lý..." : isEditing ? "Cập Nhật Sản Phẩm" : "Tạo Sản Phẩm"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6">
                        {/* Product Information */}
                        <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-3">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Thông Tin Sản Phẩm</h2>
                            <div className="space-y-6">
                                {formFields.map((field) => (
                                    <FormField
                                        key={field.name}
                                        field={field}
                                        control={control}
                                        getFieldError={getFieldError}
                                        getFieldClassName={getFieldClassName}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Product Images */}
                        <ProductImages
                            images={images}
                            setImages={setImages}
                            imageErrors={imageErrors}
                            setImageErrors={setImageErrors}
                            watch={watch}
                            isEditing={isEditing}
                            deleteSlider={deleteSlider}
                        />

                        {/* Product Variants */}
                        <VariantForm
                            fields={fields}
                            control={control}
                            errors={errors}
                            colors={colors}
                            sizes={sizes}
                            materials={materials}
                            units={units}
                            deletingVariant={deletingVariant}
                            handleDeleteVariant={handleDeleteVariant}
                            handleDuplicateVariant={handleDuplicateVariant}
                            append={append}
                            remove={remove}
                            watch={watch}
                            setValue={setValue}
                            isModalOpen={isModalOpen}
                            editingVariant={editingVariant}
                            handleAddVariant={handleAddVariant}
                            handleEditVariant={handleEditVariant}
                            handleModalClose={handleModalClose}
                            handleSaveVariant={handleSaveVariant}
                            // Variant Images Props for display
                            variantImages={variantImages}
                            variantImageErrors={variantImageErrors}
                        />
                    </div>
                </form>
            </div>

            {/* Variant Modal - Outside of form */}
            <VariantModal
                open={isModalOpen}
                onClose={handleModalClose}
                onSave={handleSaveVariant}
                editingVariant={editingVariant}
                colors={colors}
                sizes={sizes}
                materials={materials}
                units={units}
                control={control}
                setValue={setValue}
                // Variant Images Props
                variantImages={variantImages}
                variantImageErrors={variantImageErrors}
                handleAddVariantImage={handleAddVariantImage}
                handleRemoveVariantImage={handleRemoveVariantImage}
                handleUpdateVariantImageInfo={handleUpdateVariantImageInfo}
            />
        </>
    );
};

export default ProductForm;

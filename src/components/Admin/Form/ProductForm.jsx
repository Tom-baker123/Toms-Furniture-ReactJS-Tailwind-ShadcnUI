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
        setEditingVariant(null);
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
        if (editingVariant && editingVariant.index !== undefined) {
            // Update existing variant - handled by the modal
            console.log("Updating variant at index:", editingVariant.index, variantData);
        } else {
            // Add new variant
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
        }
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
                        <span className="text-sm font-medium">Back to Products</span>
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
                                    {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update Product" : "Create Product"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6">
                        {/* Product Information */}
                        <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-3">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Product Information</h2>
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
            />
        </>
    );
};

export default ProductForm;

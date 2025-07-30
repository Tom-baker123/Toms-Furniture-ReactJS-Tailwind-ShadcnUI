import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createProduct, updateProduct, deleteSlider, deleteProductVariant } from "@/api/service/ProductService";
import toast from "react-hot-toast";
import { AdminAPIContext } from "@/context/AdminAPIContext";

export function useProductFormLogic() {
    const navigate = useNavigate();
    const productData = useLoaderData();
    const isEditing = !!productData;

    const { categories, brands, countries, suppliers, colors, sizes, materials, units, loading, error } = useContext(AdminAPIContext);

    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [imageErrors, setImageErrors] = useState({});
    const [deletingVariant, setDeletingVariant] = useState(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm({
        defaultValues: isEditing
            ? {
                Id: productData.id,
                ProductName: productData.productName || "",
                SpecificationDescription: productData.specificationDescription || "",
                BrandId: productData.brandId || null,
                CategoryId: productData.categoryId || null,
                CountriesId: productData.countriesId || null,
                SupplierId: productData.supplierId || null,
                IsActive: productData.isActive || true,
                ProductVariants: productData.productVariants?.map((pv) => ({
                    Id: pv.id || 0,
                    OriginalPrice: pv.originalPrice || 0,
                    DiscountedPrice: pv.discountedPrice || null,
                    StockQty: pv.stockQty || 0,
                    ColorId: pv.colorId || null,
                    SizeId: pv.sizeId || null,
                    MaterialId: pv.materialId || null,
                    UnitId: pv.unitId || null,
                })) || [
                        {
                            Id: 0,
                            OriginalPrice: "",
                            StockQty: "",
                            ColorId: null,
                            SizeId: null,
                            MaterialId: null,
                            UnitId: null,
                        },
                    ],
            }
            : {
                ProductName: "",
                SpecificationDescription: "",
                BrandId: null,
                CategoryId: null,
                CountriesId: null,
                SupplierId: null,
                IsActive: true,
                ProductVariants: [
                    {
                        Id: 0,
                        OriginalPrice: "",
                        StockQty: "",
                        ColorId: null,
                        SizeId: null,
                        MaterialId: null,
                        UnitId: null,
                    },
                ],
            },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "ProductVariants",
    });

    useEffect(() => {
        if (isEditing && productData.sliders) {
            setImages(
                productData.sliders.map((slider) => ({
                    id: slider.id,
                    file: null,
                    preview: slider.imageUrl,
                    alt: slider.title || "",
                    displayOrder: slider.displayOrder || 0,
                }))
            );
        } else {
            setImages([]);
        }
    }, [isEditing, productData]);

    const validateImages = () => {
        const newErrors = {};
        if (images.length === 0 || images.every((img) => !img.file && !img.preview)) {
            newErrors.images = "Please upload at least one image";
        }
        setImageErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDeleteVariant = async (index) => {
        const variantId = watch(`ProductVariants[${index}].Id`);
        if (variantId > 0) {
            if (!window.confirm("Are you sure you want to delete this variant?")) {
                return;
            }
            setDeletingVariant(index);
            try {
                await deleteProductVariant(variantId);
                remove(index);
                toast.success("Product variant deleted successfully.");
            } catch (error) {
                console.error(`Error deleting variant with ID ${variantId}:`, error.message);
                toast.error(`Error: ${error.message}`);
            } finally {
                setDeletingVariant(null);
            }
        } else {
            remove(index);
            toast.success("Product variant removed from form.");
        }
    };

    const onSubmit = async (data) => {
        if (isLoading || !validateImages()) return;

        // Additional validation for required fields
        const trimmedProductName = data.ProductName?.trim();
        if (!trimmedProductName || trimmedProductName === "") {
            toast.error("Product name is required and cannot be empty");
            return;
        }

        // Check for very short product names which might be considered invalid
        if (trimmedProductName.length < 3) {
            toast.error("Product name must be at least 3 characters long");
            return;
        }

        if (!data.CategoryId || data.CategoryId === "" || data.CategoryId === "0" || data.CategoryId === 0 || data.CategoryId === null) {
            toast.error("Category is required - please select a valid category");
            return;
        }

        // Validate ProductVariants
        if (!data.ProductVariants || data.ProductVariants.length === 0) {
            toast.error("At least one product variant is required");
            return;
        }

        // Validate each variant has required fields
        for (let i = 0; i < data.ProductVariants.length; i++) {
            const variant = data.ProductVariants[i];
            if (!variant.OriginalPrice || Number(variant.OriginalPrice) <= 0) {
                toast.error(`Variant ${i + 1}: Original price is required and must be greater than 0`);
                return;
            }
            if (variant.StockQty === null || variant.StockQty === undefined || Number(variant.StockQty) < 0) {
                toast.error(`Variant ${i + 1}: Stock quantity is required and cannot be negative`);
                return;
            }
            // Validate that discounted price is not greater than original price
            if (variant.DiscountedPrice && Number(variant.DiscountedPrice) >= Number(variant.OriginalPrice)) {
                toast.error(`Variant ${i + 1}: Discounted price must be less than original price`);
                return;
            }
        }

        setIsLoading(true);
        try {
            const productPayload = {
                ...data,
                // Ensure essential fields are not null/undefined
                Id: data.Id ? Number(data.Id) : undefined,
                ProductName: trimmedProductName,
                SpecificationDescription: data.SpecificationDescription?.trim() || "",
                CategoryId: Number(data.CategoryId),
                BrandId: data.BrandId && data.BrandId !== "" && data.BrandId !== "0" && data.BrandId !== null ? Number(data.BrandId) : null,
                CountriesId: data.CountriesId && data.CountriesId !== "" && data.CountriesId !== "0" && data.CountriesId !== null ? Number(data.CountriesId) : null,
                SupplierId: data.SupplierId && data.SupplierId !== "" && data.SupplierId !== "0" && data.SupplierId !== null ? Number(data.SupplierId) : null,
                IsActive: typeof data.IsActive === 'string' ?
                    (data.IsActive === 'true' ? true : false) :
                    (data.IsActive !== undefined ? data.IsActive : true),
                ProductVariants: data.ProductVariants.filter(pv =>
                    // Only include variants with valid data
                    pv.OriginalPrice && Number(pv.OriginalPrice) > 0 &&
                    pv.StockQty !== undefined && pv.StockQty !== null && Number(pv.StockQty) >= 0
                ).map((pv) => ({
                    Id: pv.Id ? Number(pv.Id) : 0,
                    OriginalPrice: Number(pv.OriginalPrice),
                    DiscountedPrice: pv.DiscountedPrice && pv.DiscountedPrice !== "" && pv.DiscountedPrice !== null ? Number(pv.DiscountedPrice) : null,
                    StockQty: Number(pv.StockQty),
                    ColorId: pv.ColorId && pv.ColorId !== "" && pv.ColorId !== "0" && pv.ColorId !== null ? Number(pv.ColorId) : null,
                    SizeId: pv.SizeId && pv.SizeId !== "" && pv.SizeId !== "0" && pv.SizeId !== null ? Number(pv.SizeId) : null,
                    MaterialId: pv.MaterialId && pv.MaterialId !== "" && pv.MaterialId !== "0" && pv.MaterialId !== null ? Number(pv.MaterialId) : null,
                    UnitId: pv.UnitId && pv.UnitId !== "" && pv.UnitId !== "0" && pv.UnitId !== null ? Number(pv.UnitId) : null,
                })),
            };

            // Debug: Log payload before sending
            console.log("Product payload to be sent:", productPayload);
            console.log("ProductVariants details:", productPayload.ProductVariants);

            // Additional debug for each variant
            productPayload.ProductVariants.forEach((variant, index) => {
                console.log(`Variant ${index}:`, variant);
            });

            // Validate critical fields before sending
            if (!productPayload.ProductName || productPayload.ProductName.trim() === "") {
                throw new Error("ProductName is required and cannot be empty");
            }
            if (!productPayload.CategoryId || productPayload.CategoryId === 0) {
                throw new Error("CategoryId is required and must be a valid number");
            }
            if (!productPayload.ProductVariants || productPayload.ProductVariants.length === 0) {
                throw new Error("At least one valid ProductVariant is required");
            }

            // Final check - ensure all variants have required fields
            for (const variant of productPayload.ProductVariants) {
                if (!variant.OriginalPrice || variant.OriginalPrice <= 0) {
                    throw new Error("All variants must have a valid OriginalPrice");
                }
                if (variant.StockQty < 0) {
                    throw new Error("All variants must have valid StockQty");
                }
            }
            const formatSliderIndex = (index) => String(index + 1).padStart(3, "0");
            const sliders = images.map((img, index) => ({
                imageFile: img.file,
                title: img.alt,
                linkUrl: `/products/${isEditing ? productData.id : "new"}`,
                displayOrder: index,
            }));
            if (isEditing) {
                await updateProduct(
                    productPayload,
                    sliders.filter((s) => s.imageFile)
                );
                toast.success("Product updated successfully!");
            } else {
                await createProduct(
                    productPayload,
                    sliders.filter((s) => s.imageFile)
                );
                toast.success("Product created successfully!");
            }
            navigate("/admin/products");
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        reset();
        setImages([]);
        setImageErrors({});
    };

    return {
        control,
        handleSubmit,
        errors,
        isSubmitting,
        reset,
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
        resetForm,
        isEditing,
        productData,
        navigate,
        categories,
        brands,
        countries,
        suppliers,
        colors,
        sizes,
        materials,
        units,
        loading,
        error,
        deleteSlider,
    };
}

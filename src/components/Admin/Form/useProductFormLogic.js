import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createProduct, updateProduct, deleteSlider, deleteProductVariant, createProductVariantImage, updateProductVariantImage, deleteProductVariantImage } from "@/api/service/ProductService";
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

    // State cho ảnh biến thể - key là variant index, value là array of images
    const [variantImages, setVariantImages] = useState({});
    const [variantImageErrors, setVariantImageErrors] = useState({});

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

    // Load variant images khi edit
    useEffect(() => {
        if (isEditing && productData.productVariants) {
            console.log("🔄 [INIT] Loading existing variant images...");
            console.log("📊 Product variants with images:", productData.productVariants);

            const loadedVariantImages = {};

            productData.productVariants.forEach((variant, variantIndex) => {
                if (variant.images && variant.images.length > 0) {
                    console.log(`📁 Loading ${variant.images.length} images for variant ${variantIndex}`);

                    loadedVariantImages[variantIndex] = variant.images.map((img, imgIndex) => ({
                        id: img.id,
                        file: null, // Existing image, no file
                        preview: img.imageUrl,
                        attribute: img.attribute || 'main',
                        displayOrder: img.displayOrder || imgIndex
                    }));

                    console.log(`✅ Loaded images for variant ${variantIndex}:`, loadedVariantImages[variantIndex]);
                }
            });

            setVariantImages(loadedVariantImages);
            console.log("🏁 All variant images loaded:", loadedVariantImages);
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
                // Xóa ảnh của variant này khỏi state
                const newVariantImages = { ...variantImages };
                delete newVariantImages[index];
                setVariantImages(newVariantImages);
                toast.success("Product variant deleted successfully.");
            } catch (error) {
                console.error(`Error deleting variant with ID ${variantId}:`, error.message);
                toast.error(`Error: ${error.message}`);
            } finally {
                setDeletingVariant(null);
            }
        } else {
            remove(index);
            // Xóa ảnh của variant này khỏi state
            const newVariantImages = { ...variantImages };
            delete newVariantImages[index];
            setVariantImages(newVariantImages);
            toast.success("Product variant removed from form.");
        }
    };

    // === VARIANT IMAGE HANDLERS ===

    // Thêm ảnh cho variant
    const handleAddVariantImage = (variantIndex, file) => {
        console.log("🔵 [VariantImage] Adding image for variant:", variantIndex);
        console.log("📁 File details:", {
            name: file.name,
            size: file.size,
            type: file.type
        });

        const newVariantImages = { ...variantImages };
        if (!newVariantImages[variantIndex]) {
            newVariantImages[variantIndex] = [];
            console.log("🆕 Created new image array for variant:", variantIndex);
        }

        const imageData = {
            id: null, // New image
            file: file,
            preview: URL.createObjectURL(file),
            displayOrder: newVariantImages[variantIndex].length,
            attribute: 'main' // Default attribute
        };

        console.log("📝 Image data created:", {
            id: imageData.id,
            hasFile: !!imageData.file,
            hasPreview: !!imageData.preview,
            displayOrder: imageData.displayOrder,
            attribute: imageData.attribute
        });

        newVariantImages[variantIndex].push(imageData);
        setVariantImages(newVariantImages);

        console.log("✅ Image added. Total images for variant", variantIndex, ":", newVariantImages[variantIndex].length);
        console.log("📊 Current variant images state:", newVariantImages);

        // Clear any errors for this variant
        const newErrors = { ...variantImageErrors };
        delete newErrors[variantIndex];
        setVariantImageErrors(newErrors);
        console.log("🧹 Cleared errors for variant:", variantIndex);
    };

    // Xóa ảnh variant
    const handleRemoveVariantImage = async (variantIndex, imageIndex) => {
        console.log("🔵 [VariantImage] Removing image:", { variantIndex, imageIndex });

        const images = variantImages[variantIndex] || [];
        const imageToRemove = images[imageIndex];

        console.log("📝 Image to remove:", {
            id: imageToRemove?.id,
            hasFile: !!imageToRemove?.file,
            hasPreview: !!imageToRemove?.preview,
            attribute: imageToRemove?.attribute
        });

        // Nếu là ảnh đã tồn tại (có ID), xóa khỏi server
        if (imageToRemove?.id && imageToRemove.id > 0) {
            console.log("🌐 Deleting existing image from server with ID:", imageToRemove.id);
            try {
                await deleteProductVariantImage(imageToRemove.id);
                console.log("✅ Image deleted from server successfully");
                toast.success("Variant image deleted successfully");
            } catch (error) {
                console.error("❌ Error deleting image from server:", error);
                toast.error(`Error deleting image: ${error.message}`);
                return;
            }
        } else {
            console.log("ℹ️ Removing new image (not saved to server yet)");
        }

        // Xóa khỏi state
        const newVariantImages = { ...variantImages };
        newVariantImages[variantIndex] = images.filter((_, idx) => idx !== imageIndex);

        // Nếu không còn ảnh nào, xóa key
        if (newVariantImages[variantIndex].length === 0) {
            delete newVariantImages[variantIndex];
            console.log("🗑️ Removed variant key from state (no images left)");
        }

        setVariantImages(newVariantImages);
        console.log("✅ Image removed from state. Remaining images for variant", variantIndex, ":", newVariantImages[variantIndex]?.length || 0);
        console.log("📊 Current variant images state:", newVariantImages);
    };

    // Cập nhật thông tin ảnh variant
    const handleUpdateVariantImageInfo = (variantIndex, imageIndex, field, value) => {
        console.log("🔵 [VariantImage] Updating image info:", {
            variantIndex,
            imageIndex,
            field,
            value
        });

        const newVariantImages = { ...variantImages };
        if (newVariantImages[variantIndex] && newVariantImages[variantIndex][imageIndex]) {
            const oldValue = newVariantImages[variantIndex][imageIndex][field];
            newVariantImages[variantIndex][imageIndex][field] = value;
            setVariantImages(newVariantImages);

            console.log("✅ Image info updated:", {
                field,
                oldValue,
                newValue: value
            });
            console.log("📊 Updated image data:", newVariantImages[variantIndex][imageIndex]);
        } else {
            console.warn("⚠️ Image not found for update:", { variantIndex, imageIndex });
        }
    };

    // Upload/Update ảnh variant
    const handleSaveVariantImages = async (productId, variantId, variantIndex) => {
        console.log("🔵 [VariantImage] Saving variant images...");
        console.log("📝 Input params:", { productId, variantId, variantIndex });

        const images = variantImages[variantIndex] || [];
        console.log("📂 Images to save:", images.length);
        console.log("📊 Images data:", images.map((img, idx) => ({
            index: idx,
            id: img.id,
            hasFile: !!img.file,
            attribute: img.attribute,
            displayOrder: img.displayOrder
        })));

        const results = [];
        const updatedImages = [...images]; // Copy để update IDs sau khi tạo mới

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            console.log(`\n🔄 Processing image ${i + 1}/${images.length}:`);
            console.log("📝 Image details:", {
                id: image.id,
                hasFile: !!image.file,
                attribute: image.attribute,
                displayOrder: i
            });

            try {
                if (image.id && image.id > 0) {
                    // Cập nhật ảnh existing (chỉ cập nhật nếu có file mới)
                    if (image.file) {
                        console.log("🔄 Updating existing image with new file...");
                        const imageData = {
                            Id: image.id,
                            ProVarId: variantId,
                            Attribute: image.attribute || 'main',
                            DisplayOrder: i
                        };
                        console.log("📝 Update data:", imageData);

                        const result = await updateProductVariantImage(imageData, image.file);
                        console.log("✅ Update result:", result);
                        results.push({ success: true, data: result });

                        // Update preview URL if returned
                        if (result.data && result.data.imageUrl) {
                            updatedImages[i] = {
                                ...updatedImages[i],
                                preview: result.data.imageUrl,
                                file: null // Clear file after successful upload
                            };
                        }
                    } else {
                        console.log("ℹ️ Skipping existing image without new file");
                        results.push({ success: true, data: { message: "No update needed" } });
                    }
                } else {
                    // Tạo ảnh mới
                    console.log("🆕 Creating new image...");
                    if (!image.file) {
                        console.error("❌ No file for new image");
                        results.push({ success: false, error: "No file provided for new image" });
                        continue;
                    }

                    const imageData = {
                        ProVarId: variantId,
                        Attribute: image.attribute || 'main',
                        DisplayOrder: i
                    };
                    console.log("📝 Create data:", imageData);

                    const result = await createProductVariantImage(imageData, image.file);
                    console.log("✅ Create result:", result);
                    results.push({ success: true, data: result });

                    // Update image với ID mới và preview URL
                    if (result.data) {
                        updatedImages[i] = {
                            ...updatedImages[i],
                            id: result.data.id || result.data.Id,
                            preview: result.data.imageUrl || updatedImages[i].preview,
                            file: null // Clear file after successful upload
                        };
                        console.log("🔄 Updated image with new ID:", updatedImages[i]);
                    }
                }
            } catch (error) {
                console.error(`❌ Error saving variant image ${i}:`, error);
                console.error("📊 Full error details:", error);
                results.push({ success: false, error: error.message });
            }
        }

        // Update state với images mới (có IDs)
        const newVariantImages = { ...variantImages };
        newVariantImages[variantIndex] = updatedImages;
        setVariantImages(newVariantImages);
        console.log("🔄 Updated variant images state:", newVariantImages);

        console.log("🏁 Save variant images completed");
        console.log("📊 Results summary:", {
            total: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
        });
        console.log("📊 Detailed results:", results);

        return results;
    };

    // Validate ảnh variants
    const validateVariantImages = () => {
        console.log("🔵 [VariantImage] Validating variant images...");
        console.log("📊 Current variant images state:", variantImages);
        console.log("📊 Current fields:", fields.length);

        const errors = {};

        // Kiểm tra từng variant có ít nhất 1 ảnh
        fields.forEach((field, index) => {
            const images = variantImages[index] || [];
            console.log(`📝 Variant ${index}: ${images.length} images`);

            if (images.length === 0) {
                const errorMsg = `Variant ${index + 1} needs at least one image`;
                errors[index] = errorMsg;
                console.log(`❌ Validation error for variant ${index}:`, errorMsg);
            } else {
                console.log(`✅ Variant ${index} validation passed`);
            }
        });

        setVariantImageErrors(errors);

        const isValid = Object.keys(errors).length === 0;
        console.log("🏁 Validation result:", {
            isValid,
            errorCount: Object.keys(errors).length,
            errors
        });

        return isValid;
    };

    const onSubmit = async (data) => {
        if (isLoading || !validateImages() || !validateVariantImages()) return;

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
                console.log("🔄 [UPDATE MODE] Starting product update...");
                const result = await updateProduct(
                    productPayload,
                    sliders.filter((s) => s.imageFile)
                );
                console.log("✅ Product update result:", result);

                // Xử lý ảnh biến thể cho update
                console.log("🖼️ [VARIANT IMAGES] Processing variant images for update...");
                console.log("📊 ProductVariants count:", productPayload.ProductVariants.length);
                console.log("📊 Current variantImages state:", variantImages);

                const variantImageResults = [];
                for (let i = 0; i < productPayload.ProductVariants.length; i++) {
                    const variant = productPayload.ProductVariants[i];
                    const images = variantImages[i] || [];

                    console.log(`\n🔄 Processing variant ${i}:`);
                    console.log("📝 Variant data:", variant);
                    console.log("📁 Images count:", images.length);
                    console.log("📊 Images details:", images.map(img => ({
                        id: img.id,
                        hasFile: !!img.file,
                        attribute: img.attribute
                    })));

                    if (variant.Id && images.length > 0) {
                        console.log("🚀 Calling handleSaveVariantImages...");
                        const imageResults = await handleSaveVariantImages(productPayload.Id, variant.Id, i);
                        console.log("📋 Image results:", imageResults);
                        variantImageResults.push(...imageResults);
                    } else {
                        console.log("⏭️ Skipping variant (no ID or no images)");
                    }
                }

                console.log("🏁 All variant image processing completed");
                console.log("📊 Total results:", variantImageResults.length);

                const failedImages = variantImageResults.filter(r => !r.success);
                if (failedImages.length > 0) {
                    console.warn("❌ Some variant images failed to upload:", failedImages);
                    toast.warning(`Product updated but ${failedImages.length} variant images failed to upload`);
                } else {
                    console.log("✅ All variant images processed successfully");
                    toast.success("Product and all variant images updated successfully!");
                }
            } else {
                console.log("🆕 [CREATE MODE] Starting product creation...");
                const result = await createProduct(
                    productPayload,
                    sliders.filter((s) => s.imageFile)
                );
                console.log("✅ Product creation result:", result);

                // Xử lý ảnh biến thể cho create
                console.log("🖼️ [VARIANT IMAGES] Processing variant images for creation...");
                const createdProductId = result.product?.data?.productId;
                const createdVariants = result.product?.data?.productVariants;

                console.log("📝 Created product ID:", createdProductId);
                console.log("📝 Created variants:", createdVariants);
                console.log("📊 Current variantImages state:", variantImages);

                if (createdProductId && createdVariants) {
                    const variantImageResults = [];

                    for (let i = 0; i < createdVariants.length; i++) {
                        const createdVariant = createdVariants[i];
                        const images = variantImages[i] || [];

                        console.log(`\n🔄 Processing created variant ${i}:`);
                        console.log("📝 Created variant data:", createdVariant);
                        console.log("📁 Images count:", images.length);
                        console.log("📊 Images details:", images.map(img => ({
                            id: img.id,
                            hasFile: !!img.file,
                            attribute: img.attribute
                        })));

                        if (images.length > 0) {
                            console.log("🚀 Calling handleSaveVariantImages for created variant...");
                            const imageResults = await handleSaveVariantImages(createdProductId, createdVariant.id, i);
                            console.log("📋 Image results:", imageResults);
                            variantImageResults.push(...imageResults);
                        } else {
                            console.log("⏭️ Skipping variant (no images)");
                        }
                    }

                    console.log("🏁 All variant image processing completed");
                    console.log("📊 Total results:", variantImageResults.length);

                    const failedImages = variantImageResults.filter(r => !r.success);
                    if (failedImages.length > 0) {
                        console.warn("❌ Some variant images failed to upload:", failedImages);
                        toast.warning(`Product created but ${failedImages.length} variant images failed to upload`);
                    } else {
                        console.log("✅ All variant images processed successfully");
                        toast.success("Product and all variant images created successfully!");
                    }
                } else {
                    console.warn("⚠️ No created product ID or variants found");
                    toast.success("Product created successfully!");
                }
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
        setVariantImages({});
        setVariantImageErrors({});
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
        // Variant Images
        variantImages,
        variantImageErrors,
        handleAddVariantImage,
        handleRemoveVariantImage,
        handleUpdateVariantImageInfo,
        handleSaveVariantImages,
        validateVariantImages,
    };
}

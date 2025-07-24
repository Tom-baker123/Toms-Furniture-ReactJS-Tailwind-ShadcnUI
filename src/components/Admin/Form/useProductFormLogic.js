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
    } = useForm({
        defaultValues: isEditing
            ? {
                Id: productData.id,
                ProductName: productData.productName || "",
                SpecificationDescription: productData.specificationDescription || "",
                BrandId: productData.brandId || "",
                CategoryId: productData.categoryId || "",
                CountriesId: productData.countriesId || "",
                SupplierId: productData.supplierId || "",
                IsActive: productData.isActive || true,
                ProductVariants: productData.productVariants?.map((pv) => ({
                    Id: pv.id || 0,
                    OriginalPrice: pv.originalPrice || 0,
                    DiscountedPrice: pv.discountedPrice || null,
                    StockQty: pv.stockQty || 0,
                    ColorId: pv.colorId || "",
                    SizeId: pv.sizeId || "",
                    MaterialId: pv.materialId || "",
                    UnitId: pv.unitId || "",
                })) || [
                        {
                            Id: 0,
                            OriginalPrice: 0,
                            StockQty: 0,
                            ColorId: "",
                            SizeId: "",
                            MaterialId: "",
                            UnitId: "",
                        },
                    ],
            }
            : {
                ProductName: "",
                SpecificationDescription: "",
                BrandId: "",
                CategoryId: "",
                CountriesId: "",
                SupplierId: "",
                IsActive: true,
                ProductVariants: [
                    {
                        Id: 0,
                        OriginalPrice: 0,
                        StockQty: 0,
                        ColorId: "",
                        SizeId: "",
                        MaterialId: "",
                        UnitId: "",
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
        setIsLoading(true);
        try {
            const productPayload = {
                ...data,
                ProductVariants: data.ProductVariants.map((pv) => ({
                    ...pv,
                    OriginalPrice: Number(pv.OriginalPrice),
                    DiscountedPrice: pv.DiscountedPrice ? Number(pv.DiscountedPrice) : null,
                    StockQty: Number(pv.StockQty),
                    ColorId: Number(pv.ColorId),
                    SizeId: Number(pv.SizeId),
                    MaterialId: Number(pv.MaterialId),
                    UnitId: Number(pv.UnitId),
                })),
            };
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

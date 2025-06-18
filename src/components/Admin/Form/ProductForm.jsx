import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import {
    createProduct,
    updateProduct,
    getAllCategories,
    getAllBrands,
    getAllCountries,
    getAllSuppliers,
    getAllColors,
    getAllSizes,
    getAllMaterials,
    getAllUnits,
    deleteSlider,
} from "@/api/api";
import { MoveLeft, Plus, X, Upload, Image, Save, RotateCcw, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useDesktopBreakpoint } from "@/hooks/useDesktopBreakpoint";

const ProductForm = () => {
    const navigate = useNavigate();
    const productData = useLoaderData();
    const isEditing = !!productData;

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [countries, setCountries] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [units, setUnits] = useState([]);
    const [images, setImages] = useState([]);
    const [imageErrors, setImageErrors] = useState({});

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
                      OriginalPrice: pv.originalPrice || 0,
                      DiscountedPrice: pv.discountedPrice || null,
                      StockQty: pv.stockQty || 0,
                      ColorId: pv.colorId || "",
                      SizeId: pv.sizeId || "",
                      MaterialId: pv.materialId || "",
                      UnitId: pv.unitId || "",
                  })) || [{ OriginalPrice: 0, StockQty: 0, ColorId: "", SizeId: "", MaterialId: "", UnitId: "" }],
              }
            : {
                  ProductName: "",
                  SpecificationDescription: "",
                  BrandId: "",
                  CategoryId: "",
                  CountriesId: "",
                  SupplierId: "",
                  IsActive: true,
                  ProductVariants: [{ OriginalPrice: 0, StockQty: 0, ColorId: "", SizeId: "", MaterialId: "", UnitId: "" }],
              },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "ProductVariants",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, brandsData, countriesData, suppliersData, colorsData, sizesData, materialsData, unitsData] = await Promise.all(
                    [
                        getAllCategories(),
                        getAllBrands(),
                        getAllCountries(),
                        getAllSuppliers(),
                        getAllColors(),
                        getAllSizes(),
                        getAllMaterials(),
                        getAllUnits(),
                    ],
                );
                setCategories(categoriesData);
                setBrands(brandsData);
                setCountries(countriesData);
                setSuppliers(suppliersData);
                setColors(colorsData);
                setSizes(sizesData);
                setMaterials(materialsData);
                setUnits(unitsData);

                if (isEditing && productData.sliders) {
                    setImages(
                        productData.sliders.map((slider) => ({
                            id: slider.id,
                            file: null,
                            preview: slider.imageUrl,
                            alt: slider.title || "",
                            displayOrder: slider.displayOrder || 0,
                        })),
                    );
                } else {
                    setImages([{ file: null, preview: null, alt: "", displayOrder: 0 }]);
                }
            } catch (error) {
                toast.error(`Error loading data: ${error.message}`);
            }
        };
        fetchData();
    }, [isEditing, productData]);

    const handleImageChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => {
                    const newImages = [...prev];
                    newImages[index] = {
                        ...newImages[index],
                        file: file,
                        preview: reader.result,
                        alt: newImages[index].alt || watch("ProductName") || `Image ${index + 1}`,
                    };
                    return newImages;
                });
            };
            reader.readAsDataURL(file);
        }
        event.target.value = "";
    };

    const handleAddImageWithFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => [
                    ...prev,
                    {
                        file: file,
                        preview: reader.result,
                        alt: watch("ProductName") || `Image ${prev.length + 1}`,
                        displayOrder: prev.length,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        }
        event.target.value = "";
    };

    const handleAltChange = (index, value) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages[index] = { ...newImages[index], alt: value };
            return newImages;
        });
    };

    const removeImageField = async (index, sliderId) => {
        if (sliderId && isEditing) {
            try {
                await deleteSlider(sliderId);
                toast.success("Image removed successfully!");
            } catch (error) {
                toast.error(`Error removing image: ${error.message}`);
                return;
            }
        }
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const validateImages = () => {
        const newErrors = {};
        if (images.length === 0 || images.every((img) => !img.file && !img.preview)) {
            newErrors.images = "Please upload at least one image";
        }
        setImageErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

            const sliders = images.map((img, index) => ({
                imageFile: img.file,
                title: img.alt,
                linkUrl: `/products/${isEditing ? productData.id : "new"}`,
                displayOrder: index,
            }));

            if (isEditing) {
                await updateProduct(
                    productPayload,
                    sliders.filter((s) => s.imageFile),
                );
                toast.success("Product updated successfully!");
            } else {
                await createProduct(
                    productPayload,
                    sliders.filter((s) => s.imageFile),
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
        setImages([{ file: null, preview: null, alt: "", displayOrder: 0 }]);
        setImageErrors({});
    };

    return (
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
                    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">{isEditing ? "Update Product" : "Add New Product"}</h1>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className={`button-admin-hover`}
                        >
                            <Save className="sm:mr-2 h-5 w-5 " />
                            <span className="max-sm:hidden">{isSubmitting || isLoading ? "Processing..." : isEditing ? "Update Product" : "Create Product"}</span>
                        </button>
                        {/* <button
                            type="button"
                            onClick={resetForm}
                            className="flex items-center rounded-md border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </button> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6">
                    {/* Product Information */}
                    <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-3">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Product Information</h2>
                        <div className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                                <Controller
                                    name="ProductName"
                                    control={control}
                                    rules={{
                                        required: "Product name is required",
                                        maxLength: {
                                            value: 100,
                                            message: "Product name must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-1 w-full rounded-md border ${errors.ProductName ? "border-red-500" : "border-gray-300"} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
                                            placeholder="Enter product name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.ProductName && <p className="mt-1 text-sm text-red-600">{errors.ProductName.message}</p>}
                            </div>

                            {/* Specification Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Specification Description</label>
                                <Controller
                                    name="SpecificationDescription"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Enter specification description"
                                            rows={4}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category *</label>
                                <Controller
                                    name="CategoryId"
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    render={({ field }) => (
                                        <select
                                            className={`mt-1 w-full rounded-md border ${errors.CategoryId ? "border-red-500" : "border-gray-300"} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
                                            {...field}
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.CategoryId && <p className="mt-1 text-sm text-red-600">{errors.CategoryId.message}</p>}
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <Controller
                                    name="BrandId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500"
                                            {...field}
                                        >
                                            <option value="">Select brand</option>
                                            {brands.map((brand) => (
                                                <option
                                                    key={brand.id}
                                                    value={brand.id}
                                                >
                                                    {brand.brandName}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <Controller
                                    name="CountriesId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500"
                                            {...field}
                                        >
                                            <option value="">Select country</option>
                                            {countries.map((country) => (
                                                <option
                                                    key={country.id}
                                                    value={country.id}
                                                >
                                                    {country.countryName}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </div>

                            {/* Supplier */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                                <Controller
                                    name="SupplierId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500"
                                            {...field}
                                        >
                                            <option value="">Select supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option
                                                    key={supplier.id}
                                                    value={supplier.id}
                                                >
                                                    {supplier.supplierName}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </div>

                            {/* Status */}
                            {isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500"
                                                {...field}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Product Images ({images.length})</h2>
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-start gap-4">
                                {images.map((image, index) => (
                                    <div
                                        key={`image-${index}-${image.preview ? "with-preview" : "no-preview"}`}
                                        className="relative w-32 flex-shrink-0"
                                    >
                                        <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 p-2 transition-colors hover:border-indigo-400">
                                            {image.preview ? (
                                                <div className="relative h-full w-full">
                                                    <img
                                                        src={image.preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-full w-full rounded-md object-cover"
                                                    />
                                                    <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center rounded-md bg-black opacity-0 transition-opacity hover:opacity-100">
                                                        <div className="flex gap-2">
                                                            <label className="bg-opacity-90 hover:bg-opacity-100 cursor-pointer rounded bg-white px-2 py-1 text-xs font-medium text-gray-700">
                                                                <Upload className="mr-1 inline h-3 w-3" />
                                                                Replace
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => handleImageChange(index, e)}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-500 transition-colors hover:text-indigo-600">
                                                    <Image className="mb-1 h-6 w-6" />
                                                    <span className="text-center text-xs font-medium">Select Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageChange(index, e)}
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        {/* Alt text input */}
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={image.alt}
                                                onChange={(e) => handleAltChange(index, e.target.value)}
                                                placeholder="Description..."
                                                className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index, image.id)}
                                            className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>

                                        {/* Image number */}
                                        <div className="bg-opacity-50 absolute top-1 left-1 rounded bg-black px-1.5 py-0.5 text-xs text-white">
                                            {index + 1}
                                        </div>

                                        {/* Main image indicator */}
                                        {index === 0 && (
                                            <div className="absolute top-1 right-1 rounded bg-indigo-500 px-1.5 py-0.5 text-xs text-white">Main</div>
                                        )}
                                    </div>
                                ))}

                                {/* Add image button */}
                                <div className="w-32 flex-shrink-0">
                                    <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600">
                                        <Plus className="mb-1 h-6 w-6" />
                                        <span className="text-xs font-medium">Add Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAddImageWithFile}
                                        />
                                    </label>
                                </div>
                            </div>

                            {imageErrors.images && <p className="text-sm text-red-600">{imageErrors.images}</p>}

                            {/* Image info */}
                            <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Image className="mt-0.5 h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-800">
                                            <strong>Tip:</strong> The first image will be the main product image. Click the "+" button to add a new
                                            image. Scroll horizontally to view all images.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Variants */}
                    <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-3">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Product Variants</h2>
                        <div className="space-y-6">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="relative rounded-lg border border-gray-200 p-4"
                                >
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-red-500 transition-colors duration-200 hover:text-red-600"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash size={20} />
                                    </button>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* Original Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Original Price</label>
                                            <Controller
                                                name={`ProductVariants[${index}].OriginalPrice`}
                                                control={control}
                                                rules={{
                                                    required: "Original price is required",
                                                    min: { value: 0, message: "Price must be non-negative" },
                                                }}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        className={`mt-1 w-full rounded-md border ${errors.ProductVariants?.[index]?.OriginalPrice ? "border-red-500" : "border-gray-300"} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
                                                        placeholder="Enter original price"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.ProductVariants?.[index]?.OriginalPrice && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ProductVariants[index].OriginalPrice.message}</p>
                                            )}
                                        </div>

                                        {/* Discounted Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Discounted Price</label>
                                            <Controller
                                                name={`ProductVariants[${index}].DiscountedPrice`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500"
                                                        placeholder="Enter discounted price"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Stock Quantity */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                            <Controller
                                                name={`ProductVariants[${index}].StockQty`}
                                                control={control}
                                                rules={{
                                                    required: "Stock quantity is required",
                                                    min: { value: 0, message: "Stock quantity must be non-negative" },
                                                }}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        className={`mt-1 w-full rounded-md border ${errors.ProductVariants?.[index]?.StockQty ? "border-red-500" : "border-gray-300"} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
                                                        placeholder="Enter stock quantity"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.ProductVariants?.[index]?.StockQty && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ProductVariants[index].StockQty.message}</p>
                                            )}
                                        </div>

                                        {/* Color */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Color</label>
                                            <Controller
                                                name={`ProductVariants[${index}].ColorId`}
                                                control={control}
                                                rules={{ required: "Color is required" }}
                                                render={({ field }) => (
                                                    <select
                                                        className={`mt-1 w-full rounded-md border ${errors.ProductVariants?.[index]?.ColorId ? "border-red-500" : "border-gray-300"} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
                                                        {...field}
                                                    >
                                                        <option value="">Select color</option>
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
                                            {errors.ProductVariants?.[index]?.ColorId && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ProductVariants[index].ColorId.message}</p>
                                            )}
                                        </div>

                                        {/* Size */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Size</label>
                                            <Controller
                                                name={`ProductVariants[${index}].SizeId`}
                                                control={control}
                                                rules={{ required: "Size is required" }}
                                                render={({ field }) => (
                                                    <select
                                                        className={`mt-1 w-full rounded-md border ${errors.ProductVariants?.[index]?.SizeId ? "border-red-500" : "border-gray-300"} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
                                                        {...field}
                                                    >
                                                        <option value="">Select size</option>
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
                                            {errors.ProductVariants?.[index]?.SizeId && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ProductVariants[index].SizeId.message}</p>
                                            )}
                                        </div>

                                        {/* Material */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Material</label>
                                            <Controller
                                                name={`ProductVariants[${index}].MaterialId`}
                                                control={control}
                                                rules={{ required: "Material is required" }}
                                                render={({ field }) => (
                                                    <select
                                                        className={`mt-1 w-full rounded-md border ${errors.ProductVariants?.[index]?.MaterialId ? "border-red-500" : "border-gray-300"} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
                                                        {...field}
                                                    >
                                                        <option value="">Select material</option>
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
                                            {errors.ProductVariants?.[index]?.MaterialId && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ProductVariants[index].MaterialId.message}</p>
                                            )}
                                        </div>

                                        {/* Unit */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Unit</label>
                                            <Controller
                                                name={`ProductVariants[${index}].UnitId`}
                                                control={control}
                                                rules={{ required: "Unit is required" }}
                                                render={({ field }) => (
                                                    <select
                                                        className={`mt-1 w-full rounded-md border ${errors.ProductVariants?.[index]?.UnitId ? "border-red-500" : "border-gray-300"} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
                                                        {...field}
                                                    >
                                                        <option value="">Select unit</option>
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
                                            {errors.ProductVariants?.[index]?.UnitId && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ProductVariants[index].UnitId.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="flex items-center gap-2 text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
                                onClick={() =>
                                    append({
                                        OriginalPrice: 0,
                                        StockQty: 0,
                                        ColorId: "",
                                        SizeId: "",
                                        MaterialId: "",
                                        UnitId: "",
                                    })
                                }
                            >
                                <Plus className="h-5 w-5" />
                                <span className="text-sm font-medium">Add Variant</span>
                            </button>
                        </div>
                    </div>

                    {/* Debug Info */}
                    <div className="rounded-md border bg-gray-50 p-4 lg:col-span-3">
                        <h3 className="mb-2 text-sm font-medium text-gray-700">Debug Information:</h3>
                        <div className="space-y-1 text-xs text-gray-600">
                            <p>Number of Images: {images.length}</p>
                            <p>Product Name: {watch("ProductName") || "(not entered)"}</p>
                            <p>Images Selected: {images.filter((img) => img.file || img.preview).length}</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;

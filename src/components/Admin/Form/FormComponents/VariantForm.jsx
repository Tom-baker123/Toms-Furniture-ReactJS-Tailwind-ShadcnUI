import React from "react";
import { Controller } from "react-hook-form";
import { Plus, Trash } from "lucide-react";

const VariantForm = ({ fields, control, errors, colors, sizes, materials, units, deletingVariant, handleDeleteVariant, append }) => {
    return (
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
                            onClick={() => handleDeleteVariant(index)}
                            disabled={deletingVariant === index}
                        >
                            {deletingVariant === index ? <span className="animate-spin">⌛</span> : <Trash size={20} />}
                        </button>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                                            className={`mt-1 w-full rounded-md border ${
                                                errors.ProductVariants?.[index]?.OriginalPrice ? "border-red-500" : "border-gray-300"
                                            } px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
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
                                        min: {
                                            value: 0,
                                            message: "Stock quantity must be non-negative",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            className={`mt-1 w-full rounded-md border ${
                                                errors.ProductVariants?.[index]?.StockQty ? "border-red-500" : "border-gray-300"
                                            } px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
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
                                    // rules={{ required: "Color is required" }}
                                    render={({ field }) => (
                                        <select
                                            className={`mt-1 w-full rounded-md border ${
                                                errors.ProductVariants?.[index]?.ColorId ? "border-red-500" : "border-gray-300"
                                            } px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
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
                                    // rules={{ required: "Size is required" }}
                                    render={({ field }) => (
                                        <select
                                            className={`mt-1 w-full rounded-md border ${
                                                errors.ProductVariants?.[index]?.SizeId ? "border-red-500" : "border-gray-300"
                                            } px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
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
                                    // rules={{ required: "Material is required" }}
                                    render={({ field }) => (
                                        <select
                                            className={`mt-1 w-full rounded-md border ${
                                                errors.ProductVariants?.[index]?.MaterialId ? "border-red-500" : "border-gray-300"
                                            } px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
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
                                    // rules={{ required: "Unit is required" }}
                                    render={({ field }) => (
                                        <select
                                            className={`mt-1 w-full rounded-md border ${
                                                errors.ProductVariants?.[index]?.UnitId ? "border-red-500" : "border-gray-300"
                                            } px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500`}
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
    );
};

export default VariantForm;

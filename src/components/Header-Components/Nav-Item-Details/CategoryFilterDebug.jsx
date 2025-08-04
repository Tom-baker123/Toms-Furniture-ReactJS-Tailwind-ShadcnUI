import React, { useContext } from "react";
import { APIContext } from "@/context/APIContext";
import { useLocation } from "react-router-dom";

const CategoryFilterDebug = () => {
    const { categories, products } = useContext(APIContext);
    const location = useLocation();

    // Lấy categoryId từ URL
    const params = new URLSearchParams(location.search);
    const categoryIdParam = params.get("categoryId");
    const selectedCategoryId = categoryIdParam ? parseInt(categoryIdParam) : null;

    // Tìm category được chọn
    const selectedCategory = categories?.find((cat) => cat.id === selectedCategoryId);

    // Logic filter giống như trong Products.jsx
    let categoryIdsToFilter = [];
    if (selectedCategory && categories) {
        categoryIdsToFilter = [selectedCategoryId];

        // Nếu là parent category, thêm cả children
        if (selectedCategory.parentId === null) {
            const childCategories = categories.filter((cat) => cat.parentId === selectedCategoryId);
            const childCategoryIds = childCategories.map((cat) => cat.id);
            categoryIdsToFilter = [...categoryIdsToFilter, ...childCategoryIds];
        }
    }

    // Lọc products
    const filteredProducts =
        products?.items?.filter((product) => (categoryIdsToFilter.length > 0 ? categoryIdsToFilter.includes(product.categoryId) : true)) || [];

    if (!selectedCategoryId) {
        return (
            <div className="rounded border border-blue-200 bg-blue-50 p-4">
                <h3 className="font-bold text-blue-800">No category selected</h3>
                <p className="text-blue-600">Add ?categoryId=1 to URL to test filtering</p>
            </div>
        );
    }

    return (
        <div className="rounded border border-green-200 bg-green-50 p-4">
            <h3 className="mb-4 font-bold text-green-800">Category Filter Debug</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Filter Info */}
                <div>
                    <h4 className="mb-2 font-semibold">Filter Information:</h4>
                    <ul className="space-y-1 text-sm">
                        <li>
                            <strong>URL param:</strong> categoryId={categoryIdParam}
                        </li>
                        <li>
                            <strong>Selected Category:</strong> {selectedCategory?.categoryName}
                        </li>
                        <li>
                            <strong>Is Parent Category:</strong> {selectedCategory?.parentId === null ? "Yes" : "No"}
                        </li>
                        <li>
                            <strong>Category IDs to filter:</strong> [{categoryIdsToFilter.join(", ")}]
                        </li>
                        <li>
                            <strong>Total products found:</strong> {filteredProducts.length}
                        </li>
                    </ul>
                </div>

                {/* Categories Structure */}
                <div>
                    <h4 className="mb-2 font-semibold">Category Structure:</h4>
                    <div className="text-sm">
                        {selectedCategory?.parentId === null ? (
                            <div>
                                <div className="font-medium text-blue-600">
                                    📁 {selectedCategory.categoryName} (Parent - ID: {selectedCategory.id})
                                </div>
                                {categories
                                    ?.filter((cat) => cat.parentId === selectedCategoryId)
                                    .map((child) => (
                                        <div
                                            key={child.id}
                                            className="ml-4 text-gray-600"
                                        >
                                            📄 {child.categoryName} (Child - ID: {child.id})
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-gray-600">
                                📄 {selectedCategory?.categoryName} (Child - ID: {selectedCategory?.id})
                                <div className="text-xs text-gray-500">
                                    Parent: {categories?.find((cat) => cat.id === selectedCategory?.parentId)?.categoryName}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sample Products */}
            <div className="mt-4">
                <h4 className="mb-2 font-semibold">Sample Filtered Products (first 5):</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {filteredProducts.slice(0, 5).map((product) => (
                        <div
                            key={product.id}
                            className="rounded bg-white p-2 text-xs shadow"
                        >
                            <div className="truncate font-medium">{product.productName}</div>
                            <div className="text-gray-500">Category: {product.categoryName}</div>
                            <div className="text-gray-400">ID: {product.categoryId}</div>
                        </div>
                    ))}
                </div>
                {filteredProducts.length === 0 && <p className="text-sm text-gray-500">No products found for this category</p>}
            </div>
        </div>
    );
};

export default CategoryFilterDebug;

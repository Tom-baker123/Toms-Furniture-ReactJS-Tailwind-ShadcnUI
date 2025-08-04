import React, { useContext } from "react";
import { APIContext } from "@/context/APIContext";
import { buildCategoryHierarchy } from "./categoryUtils";

const CategoryDebugger = () => {
    const { categories, loading, error } = useContext(APIContext);

    if (loading) {
        return <div>Loading categories...</div>;
    }

    if (error) {
        return <div>Error loading categories: {error}</div>;
    }

    if (!categories || categories.length === 0) {
        return <div>No categories found</div>;
    }

    const hierarchy = buildCategoryHierarchy(categories);

    return (
        <div className="bg-gray-100 p-4">
            <h3 className="mb-4 text-lg font-bold">Category Hierarchy Debug</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {hierarchy.map((parentCategory, index) => (
                    <div
                        key={index}
                        className="rounded-lg bg-white p-4 shadow"
                    >
                        <h4 className="mb-2 font-semibold text-blue-600">{parentCategory.title}</h4>
                        <p className="mb-2 text-sm text-gray-600">{parentCategory.description}</p>
                        {parentCategory.roomTypeName && <p className="mb-2 text-xs text-purple-600">Room: {parentCategory.roomTypeName}</p>}
                        <ul className="ml-4">
                            {parentCategory.items.map((childCategory, childIndex) => (
                                <li
                                    key={childIndex}
                                    className="mb-1 text-sm text-gray-700"
                                >
                                    • {childCategory.label}
                                    {childCategory.roomTypeName && (
                                        <span className="ml-2 text-xs text-purple-500">({childCategory.roomTypeName})</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryDebugger;

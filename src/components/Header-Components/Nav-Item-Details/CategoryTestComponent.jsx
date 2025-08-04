import React from "react";
import { testCategoryUtils, sampleCategories } from "./categoryTest";
import { buildCategoryHierarchy, createMegaMenuFromCategories } from "./categoryUtils";

const CategoryTestComponent = () => {
    const testResults = testCategoryUtils();

    // Test với sample data đầy đủ
    const hierarchy = buildCategoryHierarchy(sampleCategories);
    const megaMenuConfig = createMegaMenuFromCategories(sampleCategories);

    console.log("=== FULL TEST RESULTS ===");
    console.log("Sample Categories Count:", sampleCategories.length);
    console.log(
        "Parent Categories:",
        sampleCategories.filter((c) => c.parentId === null).map((c) => c.categoryName),
    );
    console.log(
        "Child Categories:",
        sampleCategories.filter((c) => c.parentId !== null).map((c) => `${c.categoryName} (parent: ${c.parentId})`),
    );
    console.log("Hierarchy:", hierarchy);
    console.log("Mega Menu Config:", megaMenuConfig);

    return (
        <div className="bg-gray-50 p-6">
            <h2 className="mb-6 text-2xl font-bold">Category Test Debug</h2>

            {/* Hiển thị Parent Categories */}
            <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold">Parent Categories ({sampleCategories.filter((c) => c.parentId === null).length}):</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {sampleCategories
                        .filter((c) => c.parentId === null)
                        .map((category) => (
                            <div
                                key={category.id}
                                className="rounded bg-blue-100 p-3"
                            >
                                <div className="font-medium text-blue-800">{category.categoryName}</div>
                                <div className="text-xs text-blue-600">ID: {category.id}</div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Hiển thị Hierarchy Result */}
            <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold">Hierarchy Result ({hierarchy.length} groups):</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {hierarchy.map((group, index) => (
                        <div
                            key={index}
                            className="rounded-lg bg-white p-4 shadow"
                        >
                            <h4 className="mb-3 font-bold text-green-700">{group.title}</h4>
                            <ul className="space-y-2">
                                {group.items.map((item, itemIndex) => (
                                    <li
                                        key={itemIndex}
                                        className={`text-sm ${item.isViewAll ? "font-semibold text-blue-600" : "text-gray-600"}`}
                                    >
                                        • {item.label}
                                        {item.roomTypeName && <span className="ml-2 text-xs text-purple-500">({item.roomTypeName})</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hiển thị Mega Menu Columns */}
            <div>
                <h3 className="mb-4 text-lg font-semibold">Mega Menu Columns ({megaMenuConfig.columns.length} columns):</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {megaMenuConfig.columns.map((column, columnIndex) => (
                        <div
                            key={columnIndex}
                            className="rounded-lg bg-yellow-50 p-4"
                        >
                            <h4 className="mb-3 font-bold text-yellow-700">Cột {columnIndex + 1}</h4>
                            {column.map((section, sectionIndex) => (
                                <div
                                    key={sectionIndex}
                                    className="mb-4"
                                >
                                    <h5 className="mb-2 font-medium text-gray-800">{section.title}</h5>
                                    <ul className="ml-4">
                                        {section.items.map((item, itemIndex) => (
                                            <li
                                                key={itemIndex}
                                                className={`mb-1 text-sm ${item.isViewAll ? "font-semibold text-blue-600" : "text-gray-600"}`}
                                            >
                                                • {item.label}
                                                {item.roomTypeName && <span className="ml-2 text-xs text-purple-500">({item.roomTypeName})</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics */}
            <div className="mt-8 rounded bg-green-50 p-4">
                <h4 className="mb-2 font-semibold text-green-800">Statistics:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div className="text-green-700">
                        <div className="font-medium">Total Categories</div>
                        <div className="text-lg">{sampleCategories.length}</div>
                    </div>
                    <div className="text-green-700">
                        <div className="font-medium">Parent Categories</div>
                        <div className="text-lg">{sampleCategories.filter((c) => c.parentId === null).length}</div>
                    </div>
                    <div className="text-green-700">
                        <div className="font-medium">Child Categories</div>
                        <div className="text-lg">{sampleCategories.filter((c) => c.parentId !== null).length}</div>
                    </div>
                    <div className="text-green-700">
                        <div className="font-medium">Mega Menu Columns</div>
                        <div className="text-lg">{megaMenuConfig.columns.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryTestComponent;

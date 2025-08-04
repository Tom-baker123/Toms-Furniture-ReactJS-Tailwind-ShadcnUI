import React, { useContext } from "react";
import { APIContext } from "@/context/APIContext";
import { createMegaMenuFromCategories } from "./categoryUtils";

const MegaMenuPreview = () => {
    const { categories, loading, error } = useContext(APIContext);

    if (loading) {
        return (
            <div className="rounded border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-yellow-800">Đang tải danh mục...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded border border-red-200 bg-red-50 p-4">
                <p className="text-red-800">Lỗi tải danh mục: {error}</p>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="rounded border border-gray-200 bg-gray-50 p-4">
                <p className="text-gray-800">Không có danh mục nào</p>
            </div>
        );
    }

    const megaMenuConfig = createMegaMenuFromCategories(categories);

    return (
        <div className="rounded border border-green-200 bg-green-50 p-4">
            <h3 className="mb-4 text-lg font-bold text-green-800">Mega Menu Preview ({categories.length} categories loaded)</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {megaMenuConfig.columns.map((column, columnIndex) => (
                    <div
                        key={columnIndex}
                        className="rounded bg-white p-4 shadow"
                    >
                        <h4 className="mb-3 font-semibold text-blue-600">Cột {columnIndex + 1}</h4>
                        {column.map((section, sectionIndex) => (
                            <div
                                key={sectionIndex}
                                className="mb-4"
                            >
                                <h5 className="mb-2 font-medium text-gray-800">{section.title}</h5>
                                <ul className="ml-4 text-sm">
                                    {section.items.map((item, itemIndex) => (
                                        <li
                                            key={itemIndex}
                                            className="mb-1"
                                        >
                                            <span className={`${item.isViewAll ? "font-semibold text-blue-600" : "text-gray-600"}`}>
                                                {item.label}
                                            </span>
                                            {item.roomTypeName && <span className="ml-2 text-xs text-purple-500">({item.roomTypeName})</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded bg-blue-50 p-4">
                <h4 className="mb-2 font-semibold text-blue-800">Thống kê:</h4>
                <ul className="text-sm text-blue-700">
                    <li>Tổng số danh mục: {categories.length}</li>
                    <li>Danh mục cha: {categories.filter((c) => c.parentId === null).length}</li>
                    <li>Danh mục con: {categories.filter((c) => c.parentId !== null).length}</li>
                    <li>Số cột trong mega menu: {megaMenuConfig.columns.length}</li>
                </ul>
            </div>
        </div>
    );
};

export default MegaMenuPreview;

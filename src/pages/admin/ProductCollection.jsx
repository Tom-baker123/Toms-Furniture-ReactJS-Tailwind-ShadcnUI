import React from "react";
// import { AllCategories } from "@/constants";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData } from "react-router-dom";

const ProductCollection = () => {
    const categories = useLoaderData(); // Lấy dữ liệu từ loader

    return (
        <div className="flex flex-col gap-y-4">
            <div className="title">Product Collection</div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Categories</div>
                </div>
                {/* Product Table */}
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            {/* thead.table-header>tr.table-row>th.table-head*6 */}
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Image</th>
                                    <th className="table-head">Name Collection</th>
                                    <th className="table-head">Description</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {categories.map((category, catIndex) => (
                                    <tr
                                        key={catIndex}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{category.id}</td>
                                        <td className="table-cell">
                                            <img
                                                src={category.imageUrl}
                                                alt="s"
                                                width={50}
                                                height={50}
                                            />
                                        </td>
                                        <td className="table-cell">{category.categoryName}</td>
                                        <td className="table-cell">{category.descriptions}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button className="text-blue-500 dark:text-blue-600">
                                                    <PencilLine size={20} />
                                                </button>
                                                <button className="text-red-500">
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCollection;

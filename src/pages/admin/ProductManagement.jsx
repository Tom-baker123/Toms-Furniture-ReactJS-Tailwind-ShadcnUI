import React from "react";
import { useLoaderData } from "react-router-dom";
import { PencilLine, Trash } from "lucide-react"; // Giả sử sử dụng lucide-react cho icon

const ProductManagement = () => {
    const products = useLoaderData(); // Lấy dữ liệu từ loader

    return (
        <div className="flex flex-col gap-y-4">
            <div className="title">Product Management</div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Products</div>
                </div>
                {/* Product Table */}
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Image</th>
                                    <th className="table-head">Product Name</th>
                                    <th className="table-head">Description</th>
                                    <th className="table-head">Category</th>
                                    <th className="table-head">Brand</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {products.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{product.id}</td>
                                        <td className="table-cell">
                                            {product.sliders && product.sliders.length > 0 ? (
                                                <img
                                                    src={product.sliders[0].imageUrl}
                                                    alt={product.productName}
                                                    width={50}
                                                    height={50}
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </td>
                                        <td className="table-cell">{product.productName}</td>
                                        <td className="table-cell">{product.specificationDescription || "N/A"}</td>
                                        <td className="table-cell">{product.categoryName || "N/A"}</td>
                                        <td className="table-cell">{product.brandName || "N/A"}</td>
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

export default ProductManagement;

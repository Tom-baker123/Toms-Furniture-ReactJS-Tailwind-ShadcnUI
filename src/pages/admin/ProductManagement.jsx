import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteProduct } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

// Component hiển thị danh sách sản phẩm
// - Hiển thị bảng với thông tin sản phẩm và số lượng biến thể
// - Các cột: ID, Image, Product Name, Variants Count, Status, Created Date, Updated Date, Actions
const ProductManagement = () => {
    const products = useLoaderData()?.items; // Lấy dữ liệu từ loader
    const navigate = useNavigate();

    // Hàm xử lý xóa sản phẩm
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                toast.success("Product deleted successfully!");
                navigate(0); // Reload trang để cập nhật danh sách
            } catch (error) {
                toast.error(`Error deleting product: ${error.message}`);
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm sản phẩm */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Product Management</div>
                <button
                    className="button-admin-hover"
                    onClick={() => navigate("/admin/products/New_Product")}
                >
                    Add Product
                </button>
            </div>
            {/* Bảng hiển thị danh sách sản phẩm */}
            <div className="card overflow-hidden rounded-sm bg-white shadow-xs">
                <div className="card-header">
                    <div className="card-title text-lg font-bold text-slate-800">All Products</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full text-sm">
                            <thead className="table-header bg-gray-50">
                                <tr className="table-row">
                                    <th className="table-head px-4 py-2 whitespace-nowrap">#</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Image</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Product Name</th>
                                    <th className="table-head px-4 py-2 text-right whitespace-nowrap">Variants Count</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Status</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Created Date</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Updated Date</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {products.map((product, index) => (
                                    <tr
                                        key={index}
                                        className="table-row hover:bg-gray-50"
                                    >
                                        <td className="table-cell px-4 py-2">{product.id}</td>
                                        <td className="table-cell px-4 py-2">
                                            {product.sliders?.[0]?.imageUrl ? (
                                                <img
                                                    src={product.sliders[0].imageUrl}
                                                    alt={product.productName}
                                                    width={50}
                                                    height={50}
                                                    className="rounded object-cover"
                                                />
                                            ) : (
                                                "No image"
                                            )}
                                        </td>
                                        <td className="table-cell px-4 py-2">{product.productName}</td>
                                        <td className="table-cell px-4 py-2 text-right">
                                            {product.productVariants ? product.productVariants.length : 0} variant
                                        </td>
                                        <td className="table-cell px-4 py-2">
                                            {product.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Active</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Inactive</div>
                                            )}
                                        </td>
                                        <td className="table-cell px-4 py-2">{FormatDatetime(product.createdDate) || "N/A"}</td>
                                        <td className="table-cell px-4 py-2">{FormatDatetime(product.updatedDate) || "N/A"}</td>
                                        <td className="table-cell px-4 py-2">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                    onClick={() => navigate(`/admin/products/Edit_Product/${product.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(product.id)}
                                                >
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

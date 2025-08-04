import React, { useState } from "react";
import ProductVariantsModalContent from "@/components/Admin/ModalContent/ProductVariantsModalContent";
import { Eye, PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteProduct, updateProduct } from "@/api/service/ProductService";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";
import { useAdminModal } from "@/context/AdminModalContext";
import buildProductUpdatePayload from "@/lib/buildProductUpdatePayload";
// Component hiển thị danh sách sản phẩm
// - Hiển thị bảng với thông tin sản phẩm và số lượng biến thể
// - Các cột: ID, Image, Product Name, Variants Count, Status, Created Date, Updated Date, Actions
const ProductManagement = () => {
    const [products, setProducts] = useState(useLoaderData()?.items);
    const navigate = useNavigate();
    const { openModal } = useAdminModal();
    // Hàm xử lý xóa sản phẩm
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            try {
                await deleteProduct(id);
                toast.success("Xóa sản phẩm thành công!");
                navigate(0); // Reload trang để cập nhật danh sách
            } catch (error) {
                toast.error(`Lỗi khi xóa sản phẩm: ${error.message}`);
            }
        }
    };
    // Hàm mở modal hiển thị biến thể
    const handleShowVariants = (variants) => {
        openModal(<ProductVariantsModalContent variants={variants} />, { className: "max-w-2xl" });
    };

    // Cập nhật trạng thái trực tiếp
    const handleToggleActive = async (product) => {
        try {
            const productData = buildProductUpdatePayload(product, { isActive: !product.isActive });
            const updated = await updateProduct(productData);
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === product.id ? { ...p, isActive: !p.isActive, updatedDate: updated.product?.updatedDate || new Date().toISOString() } : p,
                ),
            );
            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại");
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm sản phẩm */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Quản lý sản phẩm</div>
                <button
                    className="button-admin-hover"
                    onClick={() => navigate("/admin/products/New_Product")}
                >
                    Thêm sản phẩm
                </button>
            </div>
            {/* Bảng hiển thị danh sách sản phẩm */}
            <div className="card overflow-hidden rounded-sm bg-white shadow-xs">
                <div className="card-header">
                    <div className="card-title text-lg font-bold text-slate-800">Tất cả sản phẩm</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full text-sm">
                            <thead className="table-header bg-gray-50">
                                <tr className="table-row">
                                    <th className="table-head px-4 py-2 whitespace-nowrap">#</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Ảnh</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Tên sản phẩm</th>
                                    <th className="table-head px-4 py-2 text-right whitespace-nowrap">Số biến thể</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Trạng thái</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Ngày tạo</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Ngày cập nhật</th>
                                    <th className="table-head px-4 py-2 whitespace-nowrap">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {products.map((product, index) => (
                                    <tr
                                        key={index}
                                        className="table-row hover:bg-gray-50"
                                    >
                                        <td className="table-cell px-4 py-2">{index + 1}</td>
                                        <td className="table-cell px-4 py-2">
                                            {product.sliders?.[0]?.imageUrl ? (
                                                <img
                                                    src={product.sliders[0].imageUrl}
                                                    alt={product.productName}
                                                    width={50}
                                                    height={50}
                                                    className="rounded bg-gray-100 object-cover"
                                                />
                                            ) : (
                                                "--"
                                            )}
                                        </td>
                                        <td className="table-cell px-4 py-2">{product.productName}</td>
                                        <td className="table-cell px-4 py-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleShowVariants(product.productVariants)}
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-gray-200 px-3 py-1 text-gray-700 transition-colors duration-75 hover:border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                                            >
                                                <Eye size={20} />
                                                <span className="text-sm font-medium">
                                                    {product.productVariants ? product.productVariants.length : 0} biến thể
                                                </span>
                                            </button>
                                        </td>
                                        <td className="table-cell px-4 py-2">
                                            <button
                                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${product.isActive ? "bg-teal-500" : "bg-gray-300"}`}
                                                onClick={() => handleToggleActive(product)}
                                                title="Chuyển trạng thái"
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${product.isActive ? "translate-x-6" : "translate-x-1"}`}
                                                />
                                                <span className="absolute left-1 text-xs font-bold text-gray-400 select-none"></span>
                                                <span className="absolute right-1 text-xs font-bold text-teal-700 select-none"></span>
                                            </button>
                                        </td>
                                        <td className="table-cell px-4 py-2">{FormatDatetime(product.createdDate) || "Không có dữ liệu"}</td>
                                        <td className="table-cell px-4 py-2">{FormatDatetime(product.updatedDate) || "Không có dữ liệu"}</td>
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

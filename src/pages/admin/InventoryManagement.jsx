import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteProduct } from "@/api/api"; // Import API xóa sản phẩm

const InventoryManagement = () => {
    const inventories = useLoaderData(); // Lấy dữ liệu từ loader
    const navigate = useNavigate();

    // Hàm xử lý xóa sản phẩm
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                const response = await deleteProduct(id);
                alert(response.message || "Xóa sản phẩm thành công!");
                // Tải lại trang sau khi xóa
                navigate(0);
            } catch (error) {
                alert("Lỗi khi xóa sản phẩm: " + error.message);
            }
        }
    };

    // Hàm xử lý chỉnh sửa sản phẩm
    const handleEdit = (id) => {
        navigate(`/admin/products/${id}`);
    };

    // Hàm tính tổng tồn kho từ các biến thể
    const calculateTotalStock = (variants) => {
        return variants.reduce((total, variant) => total + variant.stockQty, 0);
    };

    // Hàm lấy hình ảnh đầu tiên từ sliders
    const getProductImage = (sliders) => {
        const activeSlider = sliders.find((slider) => slider.isActive);
        return activeSlider?.imageUrl || "https://via.placeholder.com/50"; // Hình ảnh mặc định nếu không có slider
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="title">Quản lý tồn kho</div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Tất cả sản phẩm</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Hình ảnh</th>
                                    <th className="table-head whitespace-nowrap">Tên sản phẩm</th>
                                    <th className="table-head whitespace-nowrap">Danh mục</th>
                                    <th className="table-head whitespace-nowrap">Tồn kho</th>
                                    <th className="table-head whitespace-nowrap">Ngày tạo</th>
                                    <th className="table-head whitespace-nowrap">Ngày cập nhật</th>
                                    <th className="table-head whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {inventories.map((inventory, index) => (
                                    <tr
                                        key={inventory.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{inventory.id}</td>
                                        <td className="table-cell">
                                            <img
                                                src={getProductImage(inventory.sliders)}
                                                alt={inventory.productName}
                                                width={50}
                                                height={50}
                                                className="object-cover"
                                            />
                                        </td>
                                        <td className="table-cell">{inventory.productName}</td>
                                        <td className="table-cell">{inventory.categoryName || "Không có danh mục"}</td>
                                        <td className="table-cell">{calculateTotalStock(inventory.productVariants)}</td>
                                        <td className="table-cell">{new Date(inventory.createdDate).toLocaleDateString()}</td>
                                        <td className="table-cell">
                                            {inventory.updatedDate ? new Date(inventory.updatedDate).toLocaleDateString() : "Chưa cập nhật"}
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="text-blue-500 dark:text-blue-600"
                                                    onClick={() => handleEdit(inventory.id)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(inventory.id)}
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

export default InventoryManagement;

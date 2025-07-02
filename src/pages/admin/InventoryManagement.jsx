import React, { useState, useEffect } from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteProduct, updateProductVariant, getColorById, getSizeById, getMaterialById, getUnitById } from "@/api/api";
import FormatDatetime from "@/hooks/FormatDatetime";

const InventoryManagement = () => {
    const inventories = useLoaderData()?.items; // Lấy dữ liệu sản phẩm từ loader
    const navigate = useNavigate();
    const [stockUpdates, setStockUpdates] = useState({}); // Lưu trữ thay đổi tồn kho theo variantId

    // Hàm xử lý xóa sản phẩm
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                const response = await deleteProduct(id);
                alert(response.message || "Xóa sản phẩm thành công!");
                navigate(0); // Reload trang
            } catch (error) {
                alert("Lỗi khi xóa sản phẩm: " + error.message);
            }
        }
    };

    // Hàm xử lý chỉnh sửa sản phẩm
    const handleEdit = (id) => {
        navigate(`/admin/products/Edit_Product/${id}`);
    };

    // Hàm lấy hình ảnh đầu tiên từ sliders
    const getProductImage = (sliders) => {
        const activeSlider = sliders.find((slider) => slider.isActive);
        return activeSlider?.imageUrl || "https://via.placeholder.com/50"; // Hình ảnh mặc định
    };

    // Hàm xử lý thay đổi số lượng tồn kho
    const handleStockChange = (variantId, value) => {
        const numValue = value === "" ? 0 : parseInt(value);
        setStockUpdates((prev) => ({
            ...prev,
            [variantId]: isNaN(numValue) ? 0 : numValue,
        }));
    };

    // Hàm tăng số lượng tồn kho
    const handleIncrease = (variantId, currentStock) => {
        setStockUpdates((prev) => ({
            ...prev,
            [variantId]: (prev[variantId] !== undefined ? prev[variantId] : currentStock) + 1,
        }));
    };

    // Hàm giảm số lượng tồn kho
    const handleDecrease = (variantId, currentStock) => {
        setStockUpdates((prev) => ({
            ...prev,
            [variantId]: (prev[variantId] !== undefined ? prev[variantId] : currentStock) - 1,
        }));
    };

    // Hàm lưu cập nhật tồn kho cho biến thể
    const handleSaveStock = async (variant) => {
        const newStock = stockUpdates[variant.id];
        if (newStock !== undefined) {
            try {
                // Chuẩn bị dữ liệu biến thể để gửi API
                const variantData = {
                    Id: variant.id,
                    OriginalPrice: variant.originalPrice,
                    DiscountedPrice: variant.discountedPrice,
                    StockQty: newStock,
                    ColorId: variant.colorId || 0,
                    SizeId: variant.sizeId || 0,
                    MaterialId: variant.materialId || 0,
                    UnitId: variant.unitId || 0,
                    IsActive: variant.isActive ?? true,
                };

                // Gọi API cập nhật biến thể
                const response = await updateProductVariant(variantData);
                alert(response.message || `Cập nhật tồn kho thành công! Biến thể ID: ${variant.id}, Số lượng mới: ${newStock}`);

                // Reset trạng thái sau khi lưu
                setStockUpdates((prev) => {
                    const newState = { ...prev };
                    delete newState[variant.id];
                    return newState;
                });

                // Reload dữ liệu
                navigate(0);
            } catch (error) {
                alert("Lỗi khi cập nhật tồn kho: " + error.message);
            }
        }
    };

    // Hàm lấy giá trị hiển thị cho input
    const getDisplayValue = (variantId, stockQty) => {
        return stockUpdates[variantId] !== undefined ? stockUpdates[variantId] : stockQty;
    };

    // Hàm lấy tên thuộc tính biến thể
    const getVariantAttributeName = (variant) => {
        return (
            <div className="flex gap-1">
                <span>{`${variant?.colorName || "N/A"}`}</span>
                <span>{`/ ${variant?.sizeName || "N/A"}`}</span>
                <span>{`/ ${variant?.materialName || "N/A"}`}</span>
                <span>{`/ ${variant?.unitName || "N/A"}`}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="title">Quản lý tồn kho</div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Tất cả sản phẩm</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Hình ảnh</th>
                                    <th className="table-head whitespace-nowrap">Tên sản phẩm</th>
                                    <th className="table-head whitespace-nowrap">Color/Size/Material/Unit</th>
                                    <th className="table-head whitespace-nowrap">Danh mục</th>
                                    <th className="table-head whitespace-nowrap">Tồn kho</th>
                                    <th className="table-head whitespace-nowrap">Ngày tạo</th>
                                    <th className="table-head whitespace-nowrap">Ngày cập nhật</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {inventories.map((inventory) =>
                                    inventory.productVariants.map((variant, variantIndex) => (
                                        <tr
                                            key={`${inventory.id}-${variant.id}`}
                                            className="table-row"
                                        >
                                            <td className="table-cell">{variant.id}</td>
                                            <td className="table-cell">
                                                {variantIndex === 0 && (
                                                    <img
                                                        src={getProductImage(inventory.sliders)}
                                                        alt={inventory.productName}
                                                        width={50}
                                                        height={50}
                                                        className="object-cover"
                                                    />
                                                )}
                                            </td>
                                            <td className="table-cell">{variantIndex === 0 ? inventory.productName : ""}</td>
                                            <td className="table-cell">{getVariantAttributeName(variant)}</td>
                                            <td className="table-cell">{variantIndex === 0 ? inventory.categoryName || "Không có danh mục" : ""}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    {/* Nút giảm */}
                                                    <button
                                                        onClick={() => handleDecrease(variant.id, variant.stockQty)}
                                                        className="rounded border bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
                                                        type="button"
                                                    >
                                                        -
                                                    </button>

                                                    {/* Input số lượng */}
                                                    <input
                                                        type="number"
                                                        value={getDisplayValue(variant.id, variant.stockQty)}
                                                        onChange={(e) => handleStockChange(variant.id, e.target.value)}
                                                        className="w-16 rounded border px-2 py-1 text-center text-sm"
                                                        step="1"
                                                    />

                                                    {/* Nút tăng */}
                                                    <button
                                                        onClick={() => handleIncrease(variant.id, variant.stockQty)}
                                                        className="rounded border bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
                                                        type="button"
                                                    >
                                                        +
                                                    </button>

                                                    {/* Nút Lưu - chỉ hiện khi có thay đổi */}
                                                    {stockUpdates[variant.id] !== undefined && (
                                                        <button
                                                            onClick={() => handleSaveStock(variant)}
                                                            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                                            type="button"
                                                        >
                                                            Lưu
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="table-cell">{variantIndex === 0 ? FormatDatetime(inventory.createdDate) || "N/A" : ""}</td>
                                            <td className="table-cell">{variantIndex === 0 ? FormatDatetime(inventory.updatedDate) || "N/A" : ""}</td>
                                        </tr>
                                    )),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryManagement;

import React from "react";
import PromotionSelector from "./PromotionSelector";

const OrderSummary = ({ subtotal, shippingFee, discountAmount, total, promotionProps, orderError, ghnError, onPlaceOrder }) => {
    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Tổng kết đơn hàng</h2>

            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">{subtotal.toLocaleString()}đ</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">{shippingFee > 0 ? `${shippingFee.toLocaleString()}đ` : "Chưa tính"}</span>
                </div>

                {/* Chọn mã giảm giá */}
                <PromotionSelector {...promotionProps} />

                {/* Hiển thị số tiền giảm */}
                {promotionProps.selectedPromotion && discountAmount > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Giảm giá</span>
                        <span className="font-medium text-green-600">- {discountAmount} đ</span>
                    </div>
                )}

                <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Tổng cộng</span>
                        <span className="text-2xl font-bold text-slate-700">
                            {(total - discountAmount).toLocaleString()} <span className="underline">đ</span>{" "}
                        </span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {(orderError || ghnError) && (
                <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{orderError || ghnError}</div>
            )}

            {/* Nút đặt hàng */}
            <button
                onClick={onPlaceOrder}
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
                Đặt hàng
            </button>
        </div>
    );
};

export default OrderSummary;

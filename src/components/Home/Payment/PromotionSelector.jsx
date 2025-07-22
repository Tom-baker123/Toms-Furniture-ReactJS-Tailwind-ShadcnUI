import React from "react";

const PromotionSelector = ({ promotionList, selectedPromotion, setSelectedPromotion, promotionLoading, promotionError }) => {
    return (
        <div className="flex flex-col gap-3">
            <span className="text-gray-600">Mã giảm giá</span>
            <div className="flex-1">
                {promotionLoading ? (
                    <span>Đang tải...</span>
                ) : promotionError ? (
                    <span className="text-sm text-red-500">{promotionError}</span>
                ) : (
                    <select
                        className="w-full rounded border px-2 py-1"
                        value={selectedPromotion ? selectedPromotion.id : ""}
                        onChange={(e) => {
                            const promo = promotionList.find((p) => String(p.id) === e.target.value);
                            setSelectedPromotion(promo || null);
                        }}
                    >
                        <option value="">-- Không áp dụng --</option>
                        {promotionList.map((promo) => (
                            <option
                                key={promo.id}
                                value={promo.id}
                            >
                                {promo.promotionCode} - {promo.promotionType?.promotionTypeName || ""} {promo.discountValue}
                                {promo.promotionType?.promotionUnit === 1 ? "%" : promo.promotionType?.promotionUnit === 0 ? "$" : ""} (Đơn tối thiểu:{" "}
                                {promo.orderMinimum}$)
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
};

export default PromotionSelector;

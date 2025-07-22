import React from "react";
import CartSummary from "./CartSummary";
import OrderSummary from "./OrderSummary";

const PaymentSidebar = ({
    cartData,
    cartLoading,
    imageErrors,
    handleImageError,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    promotionProps,
    orderError,
    ghnError,
    onPlaceOrder,
}) => {
    return (
        <div className="sticky top-6 h-fit space-y-6">
            <CartSummary
                cart={cartData}
                cartLoading={cartLoading}
                imageErrors={imageErrors}
                handleImageError={handleImageError}
            />

            <OrderSummary
                subtotal={subtotal}
                shippingFee={shippingFee}
                discountAmount={discountAmount}
                total={total}
                promotionProps={promotionProps}
                orderError={orderError}
                ghnError={ghnError}
                onPlaceOrder={onPlaceOrder}
            />
        </div>
    );
};

export default PaymentSidebar;

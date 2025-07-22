import React from "react";

const CartSummary = ({ cart, cartLoading, imageErrors, handleImageError }) => {
    if (cartLoading) {
        return (
            <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">Sản phẩm</h2>
                <div>Đang tải giỏ hàng...</div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">Sản phẩm (0)</h2>
                <div>Giỏ hàng của bạn đang trống.</div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Sản phẩm ({cart.length})</h2>
            <div className="space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center space-x-4 border-b border-gray-200 pb-4 last:border-b-0"
                    >
                        <img
                            src={
                                imageErrors[item.id]
                                    ? "/src/assets/product-image.jpg"
                                    : item.productVariant?.images?.[0]?.imageUrl || "/src/assets/product-image.jpg"
                            }
                            alt={item.productName}
                            className="h-16 w-16 rounded object-cover"
                            onError={() => handleImageError(item.id)}
                        />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium">{item.productName}</h3>
                            <p className="text-sm text-gray-600">
                                {(item.productVariant?.discountedPrice ?? item.productVariant?.originalPrice ?? 0).toLocaleString()}$ x{" "}
                                {item.quantity}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">
                                {((item.productVariant?.discountedPrice ?? item.productVariant?.originalPrice ?? 0) * item.quantity).toLocaleString()}
                                $
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartSummary;

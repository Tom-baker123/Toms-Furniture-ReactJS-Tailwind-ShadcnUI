import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const variant = product.productVariants?.[0];
    const image = product.sliders?.[0]?.imageUrl;
    const hasDiscount = variant?.discountedPrice && variant?.discountedPrice < variant?.originalPrice;

    return (
        <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            {image && (
                <div className="relative">
                    <img
                        src={image}
                        alt={product.productName}
                        className="h-32 w-full object-cover"
                    />
                    {hasDiscount && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                            -{Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)}%
                        </Badge>
                    )}
                </div>
            )}
            <CardContent className="p-3">
                <h4 className="mb-1 line-clamp-2 text-sm font-semibold">{product.productName}</h4>
                <p className="mb-2 text-xs text-gray-600">
                    {product.categoryName} • {product.brandName}
                </p>

                {variant && (
                    <div className="mb-2">
                        {hasDiscount ? (
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-red-600">{formatPrice(variant.discountedPrice)}</span>
                                <span className="text-xs text-gray-500 line-through">{formatPrice(variant.originalPrice)}</span>
                            </div>
                        ) : (
                            <span className="text-sm font-bold">{formatPrice(variant.originalPrice)}</span>
                        )}

                        <div className="mt-1 flex flex-wrap gap-1">
                            {variant.colorName && (
                                <Badge
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {variant.colorName}
                                </Badge>
                            )}
                            {variant.sizeName && (
                                <Badge
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {variant.sizeName}
                                </Badge>
                            )}
                            {variant.materialName && (
                                <Badge
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {variant.materialName}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => onViewDetails?.(product)}
                    >
                        <Eye className="mr-1 h-3 w-3" />
                        Xem
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => onAddToCart?.(product, variant)}
                        disabled={!variant || variant.stockQty <= 0}
                    >
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Mua
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;

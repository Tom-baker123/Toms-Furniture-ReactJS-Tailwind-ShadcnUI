import ProductImageGallery from "@/components/Home/ProductDetails/ProductImageGallery";
import showHeader from "@/hooks/showHeader";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Minus, Plus, Check, Truck, RotateCcw, MapPin, ChevronRight, Zap, X, Star } from "lucide-react";
import { APIContext } from "@/context/APIContext";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { formatVNDForDisplay } from "@/utils/currencyUtils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ProductDetails = () => {
    const showHead = showHeader();
    const { proid } = useParams();
    const { fetchProductById, product, loading } = useContext(APIContext);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [showOffer, setShowOffer] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const { addToCart, loading: cartLoading } = useCart();

    // Fetch product by id (proid)
    useEffect(() => {
        if (proid) {
            fetchProductById(proid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proid]);

    // Set default color and variant when product loaded
    useEffect(() => {
        if (product && product.productVariants && product.productVariants.length > 0) {
            setSelectedColor(product.productVariants[0].colorName);
            setSelectedMaterial(product.productVariants[0].materialName);
            setSelectedSize(product.productVariants[0].sizeName);
            setSelectedVariant(product.productVariants[0]);
        }
    }, [product]);

    // Update selectedVariant when color, material, or size changes
    useEffect(() => {
        if (product && product.productVariants && selectedColor && selectedMaterial && selectedSize) {
            const found = product.productVariants.find(
                (v) => v.colorName === selectedColor && v.materialName === selectedMaterial && v.sizeName === selectedSize,
            );
            if (found) setSelectedVariant(found);
        }
    }, [selectedColor, selectedMaterial, selectedSize, product]);

    const handleQuantityChange = (type) => {
        if (!selectedVariant) return;
        if (type === "increase") {
            setQuantity((prev) => {
                if (prev < selectedVariant.stockQty) {
                    return prev + 1;
                }
                return prev;
            });
        } else if (type === "decrease") {
            setQuantity((prev) => {
                if (prev > 1) {
                    return prev - 1;
                }
                return prev;
            });
        }
    };

    // Handler thêm vào giỏ hàng
    const handleAddToCart = async () => {
        if (!selectedVariant) return;
        await addToCart({
            proVarId: selectedVariant.id,
            quantity: quantity,
        });
        toast.success("Đã thêm vào giỏ hàng thành công!");
    };

    if (loading || !product) {
        return <div className="container-custom py-10 text-center text-lg">Đang tải dữ liệu sản phẩm...</div>;
    }

    // Lấy danh sách màu từ các biến thể
    const colors = product.productVariants
        ? Array.from(new Map(product.productVariants.map((v) => [v.colorName, { name: v.colorName, value: v.colorCode }])).values())
        : [];

    // Lấy danh sách vật liệu từ các biến thể
    const materials = product.productVariants
        ? Array.from(new Map(product.productVariants.map((v) => [v.materialName, { name: v.materialName }])).values())
        : [];

    // Lấy danh sách kích thước từ các biến thể
    const sizes = product.productVariants ? Array.from(new Map(product.productVariants.map((v) => [v.sizeName, { name: v.sizeName }])).values()) : [];

    // Sticky offset for header
    const stickyTop = showHead ? 140 : 16; // px, adjust as needed for your header height

    return (
        <div className="container-custom">
            <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 lg:gap-x-8">
                {/* Left side - Product Images */}
                <div
                    className="transition-all md:sticky md:top-[var(--sticky-top)] md:z-[1] md:self-start"
                    style={{ "--sticky-top": `${stickyTop}px` }}
                >
                    <ProductImageGallery images={product.sliders?.map((s) => s.imageUrl) || []} />
                </div>

                {/* Right side - Product Information */}
                <div
                    className="relative space-y-5 transition-all md:sticky md:top-[var(--sticky-top)] md:z-[1] md:self-start"
                    style={{ "--sticky-top": `${stickyTop}px` }}
                >
                    {/* Product Title and Vendor */}
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.productName}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                                Nhà cung cấp: <span className="cursor-pointer underline">{product.supplierName}</span>
                            </span>
                            <span>
                                Loại: <span className="cursor-pointer underline">{product.categoryName}</span>
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-orange-700">{formatVNDForDisplay(selectedVariant?.discountedPrice) || "-"}</span>
                        {selectedVariant && selectedVariant.discountedPrice < selectedVariant.originalPrice && (
                            <span className="text-xl font-semibold text-gray-400 line-through">
                                {formatVNDForDisplay(selectedVariant.originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Check className="h-5 w-5 stroke-3" />
                            <span className="font-bold">Hiện đại</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Check className="h-5 w-5 stroke-3" />
                            <span className="font-bold">Thân thiện môi trường</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Check className="h-5 w-5 stroke-3" />
                            <span className="font-bold">Bảo hành</span>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="h-5 w-5 rounded-full bg-green-500"></div>
                            <div className="absolute top-0 left-0 h-5 w-5 animate-ping rounded-full bg-green-500 opacity-75"></div>
                        </div>
                        <span className="text-sm font-medium text-green-700">Còn hàng ({selectedVariant?.stockQty ?? 0})</span>
                    </div>

                    {/* Description */}
                    {/* <p className="leading-relaxed text-gray-600">{product.specificationDescription}</p> */}

                    {/* Color Selection */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="font-medium">Màu sắc:</span>
                            <span className="text-gray-600">{selectedColor}</span>
                        </div>
                        <div className="flex gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xs border-2 transition-all ${
                                        selectedColor === color.name ? "border-black" : "border-transparent"
                                    }`}
                                    title={color.name}
                                >
                                    <div
                                        className="h-8 w-8 rounded-xs"
                                        style={{ backgroundColor: color.value }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Material Selection */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="font-medium">Chất liệu:</span>
                            <span className="text-gray-600">{selectedMaterial}</span>
                        </div>
                        <div className="flex gap-2">
                            {materials.map((material) => (
                                <button
                                    key={material.name}
                                    onClick={() => setSelectedMaterial(material.name)}
                                    className={`cursor-pointer rounded-full border-2 px-4 py-2 transition-all ${
                                        selectedMaterial === material.name
                                            ? "border-black bg-black text-white"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                    }`}
                                    title={material.name}
                                >
                                    {material.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="font-medium">Kích thước:</span>
                            <span className="text-gray-600">{selectedSize}</span>
                        </div>
                        <div className="flex gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size.name}
                                    onClick={() => setSelectedSize(size.name)}
                                    className={`cursor-pointer rounded-full border-2 px-4 py-2 transition-all ${
                                        selectedSize === size.name
                                            ? "border-black bg-black text-white"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                    }`}
                                    title={size.name}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="mt-12 flex items-center gap-4">
                        <div className="flex items-center rounded-full border border-gray-300">
                            <button
                                onClick={() => handleQuantityChange("decrease")}
                                className={`cursor-pointer rounded-l-full p-2 transition-colors ${quantity <= 1 ? "text-gray-400" : ""}`}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[60px] px-4 py-3 text-center font-medium">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange("increase")}
                                className={`cursor-pointer rounded-r-full p-2 transition-colors ${!selectedVariant || quantity >= selectedVariant.stockQty ? "text-gray-400" : ""}`}
                                disabled={!selectedVariant || quantity >= selectedVariant.stockQty}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <ButtonHovCT
                            className={"!flex-1 !border-none py-3 !font-semibold"}
                            bgColor="bg-gray-100"
                            hoverBgColor=" bg-black" // lớp trượt màu đen
                            textColor="text-black"
                            hoverTextColor="text-white"
                            onClick={handleAddToCart}
                            disabled={cartLoading || !selectedVariant}
                        >
                            {cartLoading ? "Đang thêm..." : "Thêm vào giỏ"}
                        </ButtonHovCT>
                    </div>

                    {/* Buy Now Button - sticky stops here */}
                    <div id="buy-now-anchor" />
                    <ButtonHovCT
                        className={"w-full !flex-1 !border-none py-3 !font-semibold"}
                        bgColor="bg-black"
                        // hoverBgColor="bg-white" // lớp trượt màu trắng
                        textColor="!text-white"
                        hoverTextColor="text-white"
                    >
                        Mua ngay
                    </ButtonHovCT>

                    {/* Shipping Info */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-700">Miễn phí vận chuyển quốc tế cho đơn hàng trên 500$</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <RotateCcw className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-700">Miễn phí đổi trả trong vòng 30 ngày</span>
                        </div>
                    </div>

                    {/* Pickup Info */}
                    <div className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-gray-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Có thể nhận hàng tại cửa hàng California</p>
                                    <p className="text-sm text-gray-500">Thường sẵn sàng trong 24 giờ</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Limited Time Offer */}
                    {showOffer && (
                        <div className="relative rounded-lg border border-green-200 bg-green-50 p-4">
                            <button
                                onClick={() => setShowOffer(false)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">Ưu đãi có thời hạn</p>
                                    <p className="text-sm text-green-700">
                                        Giảm $20 khi mua từ $1000 trở lên! <span className="cursor-pointer underline">Tìm hiểu thêm</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-16">
                <Tabs
                    defaultValue="description"
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="description">Thông tin sản phẩm</TabsTrigger>
                        <TabsTrigger value="reviews">Đánh giá sản phẩm</TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="description"
                        className="space-y-6"
                    >
                        <div className="prose max-w-none">
                            <h3 className="mb-4 text-xl font-semibold">Mô tả sản phẩm</h3>
                            <p className="leading-relaxed text-gray-600">
                                {product.specificationDescription ||
                                    "Đây là một sản phẩm nội thất chất lượng cao được thiết kế với phong cách hiện đại và tính năng vượt trội. Sản phẩm được làm từ chất liệu cao cấp, đảm bảo độ bền và tính thẩm mỹ cho không gian sống của bạn."}
                            </p>

                            <h4 className="mt-6 mb-3 text-lg font-semibold">Thông số kỹ thuật</h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Danh mục:</span>
                                        <span>{product.categoryName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Nhà cung cấp:</span>
                                        <span>{product.supplierName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Màu sắc:</span>
                                        <span>{selectedColor}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Chất liệu:</span>
                                        <span>{selectedMaterial}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Kích thước:</span>
                                        <span>{selectedSize}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Tình trạng:</span>
                                        <span className="text-green-600">Còn hàng</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="reviews"
                        className="space-y-6"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">Đánh giá sản phẩm</h3>
                                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                                    Viết đánh giá
                                </button>
                            </div>

                            {/* Rating Summary */}
                            <div className="rounded-lg bg-gray-50 p-6">
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-gray-900">4.5</div>
                                        <div className="mt-1 flex items-center justify-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">Dựa trên 156 đánh giá</div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <div
                                                key={star}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="w-6 text-sm">{star}</span>
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <div className="h-2 flex-1 rounded-full bg-gray-200">
                                                    <div
                                                        className="h-2 rounded-full bg-yellow-400"
                                                        style={{
                                                            width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="w-8 text-sm text-gray-600">
                                                    {star === 5 ? 109 : star === 4 ? 31 : star === 3 ? 8 : star === 2 ? 5 : 3}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sample Reviews */}
                            <div className="space-y-4">
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                                            N
                                        </div>
                                        <div>
                                            <div className="font-medium">Nguyễn Văn A</div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">
                                        Sản phẩm rất đẹp và chất lượng. Giao hàng nhanh, đóng gói cẩn thận. Tôi rất hài lòng với mua hàng này.
                                    </p>
                                    <div className="mt-2 text-sm text-gray-500">2 tuần trước</div>
                                </div>

                                <div className="rounded-lg border border-gray-200 p-4">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white">
                                            T
                                        </div>
                                        <div>
                                            <div className="font-medium">Trần Thị B</div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(4)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                    />
                                                ))}
                                                <Star className="h-4 w-4 text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">
                                        Thiết kế đẹp, phù hợp với không gian nhà tôi. Chỉ có điều giao hàng hơi chậm một chút.
                                    </p>
                                    <div className="mt-2 text-sm text-gray-500">1 tháng trước</div>
                                </div>

                                <div className="rounded-lg border border-gray-200 p-4">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-semibold text-white">
                                            L
                                        </div>
                                        <div>
                                            <div className="font-medium">Lê Minh C</div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">
                                        Chất lượng vượt mong đợi! Sản phẩm chắc chắn, màu sắc đúng như hình. Sẽ tiếp tục ủng hộ shop.
                                    </p>
                                    <div className="mt-2 text-sm text-gray-500">3 tuần trước</div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button className="rounded-lg bg-gray-100 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-200">
                                    Xem thêm đánh giá
                                </button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ProductDetails;

import React, { useState, useEffect, useRef, useCallback } from "react";
import QuantityInput from "./QuantityInput";
import { useDebounce } from "react-use";
import { ChevronRight, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Cart from "@/pages/Cart";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import ProgressBar from "./ProgressBar";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartModal = ({ open, onClose, children, ItemCount = 0 }) => {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef();
    const navigate = useNavigate();
    const { cart, removeFromCart, updateCart, loading, cartTotal } = useCart();
    // State để lưu số lượng hiển thị tạm thời cho từng item
    const [localQuantities, setLocalQuantities] = useState({});
    // State để lưu các lần thay đổi số lượng tạm thời (debounce)
    const [pendingUpdate, setPendingUpdate] = useState({});

    // Đồng bộ localQuantities khi cart thay đổi (ví dụ khi load lại cart từ server)
    useEffect(() => {
        if (cart && cart.length > 0) {
            setLocalQuantities((prev) => {
                const updated = { ...prev };
                cart.forEach((item) => {
                    updated[item.proVarId] = item.quantity;
                });
                return updated;
            });
        }
    }, [cart]);

    // Debounce cập nhật số lượng từng item
    useDebounce(
        () => {
            Object.values(pendingUpdate).forEach((val) => {
                if (val !== undefined && val !== null) {
                    updateCart(val);
                }
            });
            setPendingUpdate({});
        },
        400,
        [pendingUpdate],
    );

    // Hàm gọi khi muốn tăng/giảm số lượng: cập nhật local trước, rồi debounce API
    const debouncedUpdateCart = useCallback((item, newQuantity) => {
        // Kiểm tra giới hạn stock
        const maxStock = item.productVariant?.stockQty || 999;
        if (newQuantity > maxStock) {
            toast.error(`Chỉ còn ${maxStock} sản phẩm trong kho!`);
            return;
        }

        setLocalQuantities((prev) => ({
            ...prev,
            [item.proVarId]: newQuantity,
        }));
        setPendingUpdate((prev) => ({
            ...prev,
            [item.id]: {
                id: item.id,
                proVarId: item.proVarId,
                quantity: newQuantity,
            },
        }));
    }, []);

    // Quản lý hiển thị modal
    useEffect(() => {
        if (open) {
            setShow(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        } else if (!open && show) {
            timeoutRef.current = setTimeout(() => setShow(false), 300);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [open, show]);

    // Đóng modal bằng phím ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    // Xử lý ngăn không cho scroll khi modal bật lên
    useEffect(() => {
        if (open) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");

        return () => document.body.classList.remove("overflow-hidden");
    }, [open]);

    return (
        <>
            {/* Nền mờ */}
            <div
                className={cn(
                    "fixed inset-0 z-[9998] bg-black transition-opacity duration-300",
                    open ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0",
                )}
                onClick={onClose}
            />

            {/* Panel trượt từ bên phải */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 z-[9999] flex h-screen w-full flex-col justify-between bg-white transition-transform duration-300 sm:w-3/4 md:w-[32rem]",
                    open ? "translate-x-0" : "translate-x-full",
                )}
            >
                {/* Topbar của cart */}
                <div className="bg-[#1D349A] px-[15px] py-3 text-center text-[15px] font-semibold text-white">
                    ✌🏼 Hãy lựa chọn chọn những sản phẩm bạn thích
                </div>

                {/* Danh sách cart */}
                <div className="flex justify-between border-b px-4 py-3 text-[20px] font-bold md:px-7 md:py-4 md:text-[16px] lg:text-2xl">
                    <h2 className="">
                        <span>Giỏ hàng của bạn ({cart?.length || 0}) </span>
                    </h2>
                    {/* Nút đóng */}
                    <button
                        className="hover-rotate cursor-pointer"
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        <X className="h-7 w-7 stroke-3" />
                    </button>
                </div>

                {/* Nội dung modal */}
                {/* [1.] Item Cart Sẽ hiện ở đây */}
                <div className="Cart-Modal-Content flex-1 overflow-auto">
                    <div className="mb-3 flex flex-col gap-2 pb-5">
                        <p className="font-semibold text-[#0d8756]"> Hãy lựa chọn chọn những sản phẩm bạn thích. </p>
                        <ProgressBar />
                    </div>

                    <div className="flex flex-col !gap-y-6">
                        {cart && cart.length > 0 ? (
                            cart.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex w-full items-start gap-3"
                                >
                                    <img
                                        src={
                                            item.productVariant?.images?.length > 0
                                                ? item.productVariant.images[0].imageUrl
                                                : "/img/cart-image/Spoke-Sofa-Armrest-b.webp"
                                        }
                                        alt={item.productName}
                                        className="rounded-lg"
                                        width={100}
                                    />
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between gap-3">
                                                <div className="">
                                                    <h2 className="block text-lg font-semibold">{item.productName}</h2>
                                                    <p className="block">
                                                        {item.productVariant?.materialName}, {item.productVariant?.colorName},{" "}
                                                        {item.productVariant?.sizeName}
                                                    </p>
                                                    {/* Hiển thị stock quantity */}
                                                    {/* {item.productVariant?.stockQty && (
                                                        <p className="text-sm text-gray-500">Stock: {item.productVariant.stockQty} available</p>
                                                    )} */}
                                                </div>
                                                {/* Nút Gỡ Item Cart */}
                                                <button
                                                    className="hover-rotate cursor-pointer"
                                                    onClick={async () => {
                                                        await removeFromCart(item.id !== 0 ? item.id : item.proVarId);
                                                        toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
                                                    }}
                                                    aria-label="Xóa"
                                                >
                                                    <X className="h-5 w-5 stroke-3" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* QuantityButton thay bằng nút cập nhật số lượng */}
                                                <div className="flex items-center rounded-full border">
                                                    <button
                                                        className={`cursor-pointer px-2 py-1 transition-colors ${
                                                            (localQuantities[item.proVarId] ?? item.quantity) <= 1 ? "text-gray-400" : ""
                                                        }`}
                                                        disabled={(localQuantities[item.proVarId] ?? item.quantity) <= 1 || loading}
                                                        onClick={() =>
                                                            debouncedUpdateCart(item, (localQuantities[item.proVarId] ?? item.quantity) - 1)
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <QuantityInput
                                                        value={localQuantities[item.proVarId] ?? item.quantity}
                                                        onChange={(val) => {
                                                            // Kiểm tra không vượt quá stock quantity
                                                            const maxStock = item.productVariant?.stockQty || 999;
                                                            const finalVal = Math.min(val, maxStock);
                                                            debouncedUpdateCart(item, finalVal);
                                                        }}
                                                        disabled={loading}
                                                        min={1}
                                                        max={item.productVariant?.stockQty || 999}
                                                    />
                                                    <button
                                                        className={`cursor-pointer px-2 py-1 transition-colors ${
                                                            !item.productVariant ||
                                                            (localQuantities[item.proVarId] ?? item.quantity) >= (item.productVariant?.stockQty || 0)
                                                                ? "text-gray-400"
                                                                : ""
                                                        }`}
                                                        disabled={
                                                            loading ||
                                                            !item.productVariant ||
                                                            (localQuantities[item.proVarId] ?? item.quantity) >= (item.productVariant?.stockQty || 0)
                                                        }
                                                        onClick={() => {
                                                            const currentQty = localQuantities[item.proVarId] ?? item.quantity;
                                                            const maxStock = item.productVariant?.stockQty || 0;
                                                            if (currentQty < maxStock) {
                                                                debouncedUpdateCart(item, currentQty + 1);
                                                            }
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="font-bold whitespace-nowrap md:text-lg">
                                                    {item.productVariant?.discountedPrice?.toLocaleString() + ".00" ||
                                                        item.productVariant?.originalPrice?.toLocaleString() + ".00"}{" "}
                                                    <span className="underline">đ</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="grid gap-3">
                                <h3 className="text-center text-2xl font-bold">Giỏ hàng của bạn hiện đang trống.</h3>
                                <p className="text-center text-gray-500">Không biết bắt đầu từ đâu? Hãy thử những bộ sưu tập này:</p>
                                <ShoppingCart
                                    size={48}
                                    className="mx-auto text-gray-500"
                                />
                                <ButtonHovCT
                                    className={"mx-auto mt-2 w-fit !border-black"}
                                    bgColor="bg-black"
                                    hoverBgColor=" bg-white" // lớp trượt màu đen
                                    textColor="text-white"
                                >
                                    Tiếp tục mua sắm
                                </ButtonHovCT>
                            </div>
                        )}
                    </div>
                </div>

                {/* [2.] Option Panel  */}
                <div className="Cart-Modal-Footer w-full border-t border-gray-200 bg-white drop-shadow-2xl">
                    <div className="grid grid-cols-1 gap-2">
                        {/* <div className="flex gap-2">
                            <ButtonHovCT
                                className="!border-gray-200 !py-1 !text-sm"
                                bgColor="bg-gray-200"
                                hoverBgColor="bg-black"
                                textColor="text-black"
                                hoverTextColor="group-hover:text-white"
                            >
                                <span className="flex items-center justify-center">
                                    Ghi chú đơn hàng <ChevronRight />
                                </span>
                            </ButtonHovCT>
                            <ButtonHovCT
                                className="!border-gray-200 !py-1 !text-sm"
                                bgColor="bg-gray-200"
                                hoverBgColor="bg-black"
                                textColor="text-black"
                                hoverTextColor="group-hover:text-white"
                            >
                                <span className="flex items-center justify-center">
                                    Ước tính phí vận chuyển <ChevronRight />
                                </span>
                            </ButtonHovCT>
                        </div> */}
                        <div className="h-auto">
                            <div className="grid gap-5">
                                <div className="grid gap-1">
                                    <div className="flex items-center justify-between text-xl font-bold">
                                        <div className="">Tổng tiền ước tính</div>
                                        <div className="text-2xl">{cartTotal.toLocaleString()} VND</div>
                                    </div>
                                    <div className="text-left text-sm">Thuế và phí vận chuyển sẽ được tính khi thanh toán</div>
                                </div>
                                <div className="flex gap-2">
                                    <ButtonHovCT
                                        className="!border-gray-200 !font-bold"
                                        bgColor="bg-gray-200"
                                        hoverBgColor="bg-black"
                                        textColor="text-black"
                                        hoverTextColor="group-hover:text-white"
                                        onClick={() => {
                                            navigate("/cart");
                                            onClose();
                                        }}
                                    >
                                        Xem giỏ hàng
                                    </ButtonHovCT>
                                    <ButtonHovCT
                                        bgColor="bg-black !font-bold"
                                        hoverBgColor=" bg-white" // lớp trượt màu đen
                                        textColor="text-white"
                                        className="flex-1 !border-black"
                                        onClick={() => {
                                            navigate("/checkout");
                                            onClose();
                                        }}
                                    >
                                        Thanh toán
                                    </ButtonHovCT>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartModal;

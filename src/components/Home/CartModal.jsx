import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Cart from "@/pages/Cart";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import ProgressBar from "./ProgressBar";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const CartModal = ({ open, onClose, children, ItemCount = 0 }) => {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef();
    const { cart, removeFromCart, updateCart, loading } = useCart();
    // Debounce map: { [cartItemId]: timeoutId }
    const debounceMap = useRef({});

    // Debounced update handler
    const debouncedUpdateCart = useCallback(
        (item, newQuantity) => {
            if (debounceMap.current[item.id]) {
                clearTimeout(debounceMap.current[item.id]);
            }
            debounceMap.current[item.id] = setTimeout(() => {
                updateCart({
                    id: item.id,
                    proVarId: item.proVarId,
                    quantity: newQuantity,
                });
                debounceMap.current[item.id] = null;
            }, 400);
        },
        [updateCart],
    );

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
                    ✌🏼 Free Express Shipping on orders $500!
                </div>

                {/* Danh sách cart */}
                <div className="flex justify-between border-b px-4 py-3 text-[20px] font-bold md:px-7 md:py-4 md:text-[16px] lg:text-2xl">
                    <h2 className="">
                        <span>Your cart ({cart?.length || 0}) </span>
                    </h2>
                    {/* Nút đóng */}
                    <button
                        className="hover-rotate cursor-pointer"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X className="h-7 w-7 stroke-3" />
                    </button>
                </div>

                {/* Nội dung modal */}
                {/* [1.] Item Cart Sẽ hiện ở đây */}
                <div className="Cart-Modal-Content flex-1 overflow-auto">
                    <div className="mb-3 flex flex-col gap-2 pb-5">
                        <p className="font-semibold text-[#0d8756]"> You are eligible for free shipping. </p>
                        <ProgressBar />
                    </div>

                    <div className="flex flex-col !gap-y-6">
                        {cart && cart.length > 0 ? (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex w-full items-start gap-3"
                                >
                                    <img
                                        src={"/img/cart-image/Spoke-Sofa-Armrest-b.webp"}
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
                                                        {item.productVariant?.materialName}, {item.productVariant?.colorName}
                                                    </p>
                                                </div>
                                                {/* Nút Gỡ Item Cart */}
                                                <button
                                                    className="hover-rotate cursor-pointer"
                                                    onClick={async () => {
                                                        await removeFromCart(item.id);
                                                        toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
                                                    }}
                                                    aria-label="Remove"
                                                >
                                                    <X className="h-5 w-5 stroke-3" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* QuantityButton thay bằng nút cập nhật số lượng */}
                                                <div className="flex items-center rounded-full border">
                                                    <button
                                                        className="px-2 py-1"
                                                        disabled={item.quantity <= 1 || loading}
                                                        onClick={() => debouncedUpdateCart(item, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3">{item.quantity}</span>
                                                    <button
                                                        className="px-2 py-1"
                                                        disabled={loading}
                                                        onClick={() => debouncedUpdateCart(item, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="font-bold whitespace-nowrap md:text-lg">
                                                    {item.productVariant?.discountedPrice?.toLocaleString() ||
                                                        item.productVariant?.originalPrice?.toLocaleString()}{" "}
                                                    VND
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-gray-500">Giỏ hàng trống</div>
                        )}
                    </div>
                </div>

                {/* [2.] Option Panel  */}
                <div className="Cart-Modal-Footer w-full border-t border-gray-200 bg-white drop-shadow-2xl">
                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex gap-2">
                            <ButtonHovCT
                                className="!border-gray-200 !py-1 !text-sm"
                                bgColor="bg-gray-200"
                                hoverBgColor="bg-black"
                                textColor="text-black"
                                hoverTextColor="group-hover:text-white"
                            >
                                <span className="flex items-center justify-center">
                                    Order Note <ChevronRight />
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
                                    Estimate Shipping <ChevronRight />
                                </span>
                            </ButtonHovCT>
                        </div>
                        <div className="h-auto">
                            <div className="grid gap-5">
                                <div className="grid gap-1">
                                    <div className="flex items-center justify-between text-xl font-bold">
                                        <div className="">Estimated total</div>
                                        <div className="text-2xl">{"2.000.000"} VND</div>
                                    </div>
                                    <div className="text-left text-sm">Taxes and shipping calculated at checkout</div>
                                </div>
                                <div className="flex gap-2">
                                    <ButtonHovCT
                                        className="!border-gray-200 !font-bold"
                                        bgColor="bg-gray-200"
                                        hoverBgColor="bg-black"
                                        textColor="text-black"
                                        hoverTextColor="group-hover:text-white"
                                    >
                                        View Cart
                                    </ButtonHovCT>
                                    <ButtonHovCT
                                        bgColor="bg-black !font-bold"
                                        hoverBgColor=" bg-white" // lớp trượt màu đen
                                        textColor="text-white"
                                        className="flex-1 !border-black"
                                    >
                                        Estimate Shipping
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

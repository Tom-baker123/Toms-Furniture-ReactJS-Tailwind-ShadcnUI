import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Cart from "@/pages/Cart";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";

const CartModal = ({ open, onClose, children, ItemCount = 0 }) => {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef();

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
                    "fixed top-0 right-0 z-[9999] flex h-screen w-full flex-col bg-white transition-transform duration-300 sm:w-3/4 md:w-[32rem]",
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
                        <span>Your cart ({(ItemCount = 0)}) </span>
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
                {/* {children} */}
                <div className="flex h-full flex-col  w-full">
                    <div className="Cart-Modal-Content flex-1 ">asdasdsad</div>

                    <div className="Cart-Modal-Footer border-t border-gray-200 bg-white drop-shadow-2xl">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex gap-2">
                                <ButtonHovCT
                                    className="!border-gray-200"
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
                                    className="!border-gray-200"
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
                            <div className="">
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
                                            className="!border-gray-200"
                                            bgColor="bg-gray-200"
                                            hoverBgColor="bg-black"
                                            textColor="text-black"
                                            hoverTextColor="group-hover:text-white"
                                        >
                                            Order Note
                                        </ButtonHovCT>
                                        <ButtonHovCT
                                            bgColor="bg-black"
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
            </div>
        </>
    );
};

export default CartModal;

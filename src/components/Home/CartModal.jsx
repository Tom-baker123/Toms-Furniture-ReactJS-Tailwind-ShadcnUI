import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
                    "fixed top-0 right-0 z-[9999] h-screen w-full bg-white transition-transform duration-300 sm:w-3/4 md:w-[32rem]",
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
                {children}
            </div>
        </>
    );
};

export default CartModal;

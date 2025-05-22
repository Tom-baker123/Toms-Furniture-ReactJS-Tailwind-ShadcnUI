import { useModal } from "@/context/ModalContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const ANIMATION_DURATION = 250; // ms

const ModalTemplate = () => {
    const { isOpen, modalContent, modalOptions, closeModal } = useModal();
    const [show, setShow] = useState(false);
    const [animate, setAnimate] = useState("in");

    // [1.] Xử lý sự kiện nhấn nút escape để thoát modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, closeModal]);

    // [2.] Xử lý ngăn không cho scroll khi modal bật lên
    useEffect(() => {
        if (isOpen) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");

        // Clean up khi mount
        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    // [3.] Xử lý sự kiện đóng mở modal
    useEffect(() => {
        if (isOpen) {
            setShow(true);
            setAnimate("in");
        } else if (show) {
            setAnimate("out");
            const timeout = setTimeout(() => setShow(false), ANIMATION_DURATION);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${animate === "in" ? "animate-fade-in" : "animate-fade-out"}`}
        >
            {/* Backdrop */}
            <div
                onClick={closeModal}
                className={`fixed inset-0 bg-black/50 transition-opacity ${animate === "in" ? "animate-fade-in" : "animate-fade-out"}`}
            />

            {/* Modal content */}
            <div
                className={cn(
                    `relative z-[9999] max-h-full w-full overflow-auto rounded-lg px-3 md:px-10 pt-7 [scrollbar-width:_thin]`,
                    animate === "in" ? "animate-scale-in" : "animate-scale-out",
                )}
                onClick={closeModal}
            >
                <div
                    className={cn(`relative mx-auto w-full rounded-md bg-white p-5 shadow-lg md:p-7`, modalOptions.className || "")}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={closeModal}
                    >
                        <X className="h-7 w-7 stroke-3" />
                    </button>
                    {modalContent}
                </div>
            </div>
        </div>
    );
};

export default ModalTemplate;

import { useModal } from "@/context/ModalContext";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const ANIMATION_DURATION = 250; // ms

const ModalTemplate = () => {
    const { isOpen, modalContent, closeModal } = useModal();
    const [show, setShow] = useState(false);
    const [animate, setAnimate] = useState("in");

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
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${animate === "in" ? "animate-fade-in" : "animate-fade-out"}`}>
            {/* Backdrop */}
            <div
                onClick={closeModal}
                className={`fixed inset-0 bg-black/50 transition-opacity ${animate === "in" ? "animate-fade-in" : "animate-fade-out"}`}
            ></div>
            {/* Modal content */}
            <div
                className={`relative mx-5 w-full max-w-md rounded-lg bg-white p-6 shadow-lg z-[9999] ${animate === "in" ? "animate-scale-in" : "animate-scale-out"}`}
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
    );
};

export default ModalTemplate;
import React, { useRef } from "react";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
    const modalRef = useRef(null);
    if (!open) return null;

    // Close modal when click outside
    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onCancel();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center"
            onMouseDown={handleOverlayClick}
        >
            {/* Overlay with fade-in */}
            <div className="animate-fadeInOverlay absolute inset-0 bg-black/70" />
            {/* Modal with fade-in and scale */}
            <div className="relative z-10 mx-4 w-full max-w-md">
                <div
                    ref={modalRef}
                    className="animate-fadeInModal rounded-xl bg-white p-8 shadow-2xl dark:bg-slate-800"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="mb-3 text-2xl font-bold text-slate-800 dark:text-slate-200">{title}</div>
                    <div className="mb-6 text-base text-slate-700 dark:text-slate-300">{message}</div>
                    <div className="flex justify-end gap-3">
                        <button
                            className="rounded-lg bg-gray-200 px-5 py-2 font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            onClick={onCancel}
                        >
                            Hủy
                        </button>
                        <button
                            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
                            onClick={onConfirm}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
            {/* Tailwind custom animation classes */}
            <style>{`
                .animate-fadeInOverlay {
                    animation: fadeInOverlay 0.25s ease;
                }
                @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeInModal {
                    animation: fadeInModal 0.25s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes fadeInModal {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;

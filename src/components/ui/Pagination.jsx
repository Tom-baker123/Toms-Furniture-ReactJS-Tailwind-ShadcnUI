import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showPages = 5,
    className = "",
    showInfo = true,
    totalItems = 0,
    itemsPerPage = 10,
    ...props
}) => {
    // Tính toán số trang hiển thị
    const getVisiblePages = () => {
        const pages = [];
        const halfShow = Math.floor(showPages / 2);

        let startPage = Math.max(1, currentPage - halfShow);
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        // Điều chỉnh lại nếu không đủ trang ở cuối
        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div
            className={cn("flex flex-col items-center gap-4", className)}
            {...props}
        >
            {/* Thông tin hiển thị */}
            {showInfo && (
                <div className="text-sm text-gray-600">
                    Showing {startItem} to {endItem} of {totalItems} products
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        "flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                        currentPage === 1
                            ? "cursor-not-allowed border-gray-200 text-gray-400"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
                    )}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers - Hidden on mobile for very small screens */}
                <div className="hidden items-center gap-1 sm:flex">
                    {/* First page if not visible */}
                    {visiblePages[0] > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                            >
                                1
                            </button>
                            {visiblePages[0] > 2 && <span className="px-2 py-2 text-gray-500">...</span>}
                        </>
                    )}

                    {/* Visible page numbers */}
                    {visiblePages.map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={cn(
                                "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                                pageNum === currentPage
                                    ? "border-black bg-black text-white"
                                    : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
                            )}
                        >
                            {pageNum}
                        </button>
                    ))}

                    {/* Last page if not visible */}
                    {visiblePages[visiblePages.length - 1] < totalPages && (
                        <>
                            {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="px-2 py-2 text-gray-500">...</span>}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile: Show current page info */}
                <div className="px-3 py-2 text-sm font-medium text-gray-700 sm:hidden">
                    Page {currentPage} of {totalPages}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        "flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                        currentPage === totalPages
                            ? "cursor-not-allowed border-gray-200 text-gray-400"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
                    )}
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;

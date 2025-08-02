import React from "react";

const SearchLoadingSkeleton = () => {
    return (
        <div className="p-2">
            <div className="border-b p-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 p-3"
                >
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 animate-pulse rounded-md bg-gray-200"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchLoadingSkeleton;

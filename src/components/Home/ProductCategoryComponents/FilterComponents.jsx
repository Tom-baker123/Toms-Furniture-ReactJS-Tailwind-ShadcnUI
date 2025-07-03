import { cn } from "@/lib/utils";
import React, { useState, useCallback } from "react";

const FilterComponents = ({ showHead, title = "", json = "Please Check Your Filter Problem" }) => {
    const [AccordionOpen, setAccordionOpen] = useState(true);
    const [priceRange, setPriceRange] = useState([0, 3429]);
    const maxPrice = 3429;
    const minPrice = 0;

    const [isDragging, setIsDragging] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);

    const handleRangeChange = useCallback(
        (index, value) => {
            const newRange = [...priceRange];
            newRange[index] = Math.max(minPrice, Math.min(maxPrice, value));

            // Ensure min doesn't exceed max and vice versa
            if (index === 0 && newRange[0] > newRange[1]) {
                newRange[0] = newRange[1];
            } else if (index === 1 && newRange[1] < newRange[0]) {
                newRange[1] = newRange[0];
            }

            setPriceRange(newRange);
        },
        [priceRange, minPrice, maxPrice],
    );

    const handleMouseDown = (index) => (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragIndex(index);

        const handleMouseMove = (e) => {
            const sliderTrack = e.currentTarget?.parentElement || document.querySelector(".slider-track");
            if (!sliderTrack) return;

            const rect = sliderTrack.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            const value = Math.round((percentage / 100) * (maxPrice - minPrice) + minPrice);
            handleRangeChange(index, value);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setDragIndex(null);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleTrackClick = (e) => {
        if (isDragging) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        const value = Math.round((percentage / 100) * (maxPrice - minPrice) + minPrice);

        // Determine which handle to move (closer one)
        const distanceToMin = Math.abs(value - priceRange[0]);
        const distanceToMax = Math.abs(value - priceRange[1]);
        const indexToMove = distanceToMin <= distanceToMax ? 0 : 1;

        handleRangeChange(indexToMove, value);
    };

    const handleInputChange = useCallback(
        (index, value) => {
            const numValue = parseInt(value) || 0;
            handleRangeChange(index, numValue);
        },
        [handleRangeChange],
    );

    const getSliderPosition = (value) => {
        return ((value - minPrice) / (maxPrice - minPrice)) * 100;
    };

    const renderPriceSlider = () => (
        <div className="pt-6">
            <div className="mb-4 text-[15px] text-gray-600">The highest price is ${maxPrice.toLocaleString()}.00</div>

            {/* Slider Container */}
            <div className="relative mx-2.5 mb-6">
                {/* Track */}
                <div
                    className="slider-track relative h-2 cursor-pointer rounded-full bg-gray-200"
                    onClick={handleTrackClick}
                >
                    {/* Active Range */}
                    <div
                        className="pointer-events-none absolute h-2 rounded-full bg-black"
                        style={{
                            left: `${getSliderPosition(priceRange[0])}%`,
                            width: `${getSliderPosition(priceRange[1]) - getSliderPosition(priceRange[0])}%`,
                        }}
                    />

                    {/* Min Handle */}
                    <div
                        className={`absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform cursor-grab rounded-full border-2 border-black bg-white ${isDragging && dragIndex === 0 ? "scale-110 cursor-grabbing" : ""}`}
                        style={{ left: `${getSliderPosition(priceRange[0])}%` }}
                        onMouseDown={handleMouseDown(0)}
                    />

                    {/* Max Handle */}
                    <div
                        className={`absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform cursor-grab rounded-full border-2 border-black bg-white ${isDragging && dragIndex === 1 ? "scale-110 cursor-grabbing" : ""}`}
                        style={{ left: `${getSliderPosition(priceRange[1])}%` }}
                        onMouseDown={handleMouseDown(1)}
                    />
                </div>
            </div>

            {/* Price Input Fields */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">$</span>
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                            className="w-full rounded-full border-0 bg-gray-100 py-2 pr-4 pl-8 text-center text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            min={minPrice}
                            max={maxPrice}
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">$</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                            className="w-full rounded-full border-0 bg-gray-100 py-2 pr-4 pl-8 text-center text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            min={minPrice}
                            max={maxPrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="border-b border-gray-200 py-6 first:pt-0 last:border-0">
            <button
                onClick={() => setAccordionOpen(!AccordionOpen)}
                className="flex w-full cursor-pointer justify-between select-none"
            >
                <span className="text-md font-bold">{title || "Filter"}</span>
                <svg
                    className="ml-8 shrink-0 fill-black"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        y="7"
                        width="16"
                        height="2"
                        rx="1"
                        className={`origin-center transform transition duration-200 ease-out ${AccordionOpen && "!rotate-180"}`}
                    />
                    <rect
                        y="7"
                        width="16"
                        height="2"
                        rx="1"
                        className={`origin-center rotate-90 transform transition duration-200 ease-out ${AccordionOpen && "!rotate-180"}`}
                    />
                </svg>
            </button>
            <div
                className={cn(
                    `grid cursor-pointer overflow-hidden text-sm text-slate-600 transition-all duration-150 ease-in-out`,
                    AccordionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
            >
                <div className="overflow-hidden">
                    {/* Price Slider */}
                    {title.toLowerCase().includes("price") && renderPriceSlider()}

                    {/* Original Filter Options for non-price filters */}
                    {!title.toLowerCase().includes("price") && (
                        <ul className="grid w-full gap-3 pt-6">
                            <li className="flex w-full items-center gap-2">
                                <input
                                    name="filter.v.availability"
                                    value="1"
                                    className="checkbox h-5 w-5"
                                    id="vertical-filter.v.availability-1"
                                    type="checkbox"
                                />
                                <label
                                    htmlFor="vertical-filter.v.availability-1"
                                    className="text-subtext reversed-link flex flex-grow items-center justify-between gap-1 text-gray-400"
                                >
                                    <span className="text-[15px] font-bold">In stock</span>
                                    <span className="count">1</span>
                                </label>
                            </li>
                            <li className="flex items-center gap-2">
                                <input
                                    name="filter.v.availability"
                                    value="1"
                                    className="checkbox h-5 w-5"
                                    id="vertical-filter.v.availability-2"
                                    type="checkbox"
                                />
                                <label
                                    htmlFor="vertical-filter.v.availability-2"
                                    className="text-subtext reversed-link flex flex-grow items-center justify-between gap-1 text-gray-400"
                                >
                                    <span className="text-[15px] font-bold">Out of stock</span>
                                    <span className="count">1</span>
                                </label>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterComponents;

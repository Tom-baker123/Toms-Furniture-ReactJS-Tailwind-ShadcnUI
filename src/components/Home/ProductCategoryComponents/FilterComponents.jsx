import { cn } from "@/lib/utils";
import React, { useState, useCallback, useContext, useMemo } from "react";
import { APIContext } from "@/context/APIContext";

const FilterComponents = ({ showHead, title = "", onFilterChange, products = [], currentFilters = {} }) => {
    const [AccordionOpen, setAccordionOpen] = useState(true);

    // Tính toán giá tối đa từ dữ liệu sản phẩm thực tế (dựa vào discountedPrice)
    const maxPrice = useMemo(() => {
        if (!products?.length) return 3000000; // Fallback value

        const allPrices = products.flatMap(
            (product) =>
                product.productVariants?.map((variant) => variant.discountedPrice ?? variant.originalPrice).filter((price) => price != null) || [],
        );

        return allPrices.length > 0 ? Math.max(...allPrices, 3000000) : 3000000; // Ít nhất 3 triệu
    }, [products]);

    const minPrice = 0; // Giá tối thiểu cố định
    const [priceRange, setPriceRange] = useState([0, 3000000]); // Khởi tạo với giá trị mặc định
    const [isDragging, setIsDragging] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);
    const [pendingPriceRange, setPendingPriceRange] = useState([0, 3000000]); // Khởi tạo với giá trị mặc định

    // Cập nhật priceRange khi maxPrice thay đổi
    React.useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
        setPendingPriceRange([minPrice, maxPrice]);
    }, [maxPrice, minPrice]);

    // Lấy dữ liệu từ APIContext
    const { categories, colors, materials, sizes, brands, countries } = useContext(APIContext);

    // Hàm lọc sản phẩm (giống như trong Products.jsx)
    const getFilteredProducts = (tempFilters = currentFilters) => {
        if (!products?.length) return [];

        let filteredProducts = [...products];

        // Áp dụng các bộ lọc
        if (tempFilters.categoryNames?.length > 0) {
            filteredProducts = filteredProducts.filter((product) => tempFilters.categoryNames.includes(product.categoryName));
        }

        if (tempFilters.brandNames?.length > 0) {
            filteredProducts = filteredProducts.filter((product) => tempFilters.brandNames.includes(product.brandName));
        }

        if (tempFilters.countryNames?.length > 0) {
            filteredProducts = filteredProducts.filter((product) => tempFilters.countryNames.includes(product.countryName));
        }

        if (tempFilters.colorNames?.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productVariants.some((variant) => tempFilters.colorNames.includes(variant.colorName)),
            );
        }

        if (tempFilters.sizeNames?.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productVariants.some((variant) => tempFilters.sizeNames.includes(variant.sizeName)),
            );
        }

        if (tempFilters.materialNames?.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productVariants.some((variant) => tempFilters.materialNames.includes(variant.materialName)),
            );
        }

        // Lọc theo giá (dựa vào discountedPrice)
        if (tempFilters.minPrice !== null || tempFilters.maxPrice !== null) {
            filteredProducts = filteredProducts.filter((product) => {
                const minPrice = Math.min(
                    ...product.productVariants.map((v) => v.discountedPrice ?? v.originalPrice).filter((price) => price != null),
                );

                if (tempFilters.minPrice !== null && minPrice < tempFilters.minPrice) return false;
                if (tempFilters.maxPrice !== null && minPrice > tempFilters.maxPrice) return false;
                return true;
            });
        }

        // Lọc theo trạng thái tồn kho
        if (tempFilters.inStock !== null) {
            filteredProducts = filteredProducts.filter((product) => {
                const totalStock = product.productVariants.reduce((sum, variant) => sum + (variant.stockQty || 0), 0);
                return tempFilters.inStock ? totalStock > 0 : totalStock === 0;
            });
        }

        return filteredProducts;
    };

    // Hàm tính số lượng sản phẩm cho mỗi filter option
    const getProductCountForOption = (filterType, optionValue) => {
        if (!products?.length) return 0;

        // Tạo bản sao của filters hiện tại, bỏ filter hiện tại để tính count chính xác
        const tempFilters = { ...currentFilters };
        const filterKey = `${filterType}Names`;

        if (filterType === "availability") {
            // Tạm thời bỏ inStock filter
            const { inStock, ...filtersWithoutStock } = tempFilters;

            // Thêm inStock mới
            if (optionValue === "In stock") {
                filtersWithoutStock.inStock = true;
            } else if (optionValue === "Out of stock") {
                filtersWithoutStock.inStock = false;
            }

            return getFilteredProducts(filtersWithoutStock).length;
        } else {
            // Tạm thời bỏ filter hiện tại
            const filtersWithoutCurrent = { ...tempFilters };
            delete filtersWithoutCurrent[filterKey];

            // Thêm option này
            filtersWithoutCurrent[filterKey] = [optionValue];

            return getFilteredProducts(filtersWithoutCurrent).length;
        }
    };

    // Danh sách các tùy chọn lọc dựa trên title với memoization
    const getFilterOptions = useMemo(() => {
        switch (title.toLowerCase()) {
            case "category":
                return (
                    categories?.map((category) => ({
                        value: category.categoryName,
                        label: category.categoryName,
                        count: getProductCountForOption("category", category.categoryName),
                    })) || []
                );
            case "color":
                return (
                    colors?.map((color) => ({
                        value: color.colorName,
                        label: color.colorName,
                        count: getProductCountForOption("color", color.colorName),
                    })) || []
                );
            case "material":
                return (
                    materials?.map((material) => ({
                        value: material.materialName,
                        label: material.materialName,
                        count: getProductCountForOption("material", material.materialName),
                    })) || []
                );
            case "size":
                return (
                    sizes?.map((size) => ({
                        value: size.sizeName,
                        label: size.sizeName,
                        count: getProductCountForOption("size", size.sizeName),
                    })) || []
                );
            case "brand":
                return (
                    brands?.map((brand) => ({
                        value: brand.brandName,
                        label: brand.brandName,
                        count: getProductCountForOption("brand", brand.brandName),
                    })) || []
                );
            case "country":
                return (
                    countries?.map((country) => ({
                        value: country.countryName,
                        label: country.countryName,
                        count: getProductCountForOption("country", country.countryName),
                    })) || []
                );
            case "availability":
                return [
                    {
                        value: "In stock",
                        label: "In stock",
                        count: getProductCountForOption("availability", "In stock"),
                    },
                    {
                        value: "Out of stock",
                        label: "Out of stock",
                        count: getProductCountForOption("availability", "Out of stock"),
                    },
                ];
            default:
                return [];
        }
    }, [title, categories, colors, materials, sizes, brands, countries, products, currentFilters]);

    // Xử lý thay đổi giá từ slider hoặc input
    const handleRangeChange = useCallback(
        (index, value) => {
            const numValue = Number(value);
            const newRange = [...pendingPriceRange];

            // Áp dụng giới hạn min/max
            newRange[index] = Math.max(minPrice, Math.min(maxPrice, numValue));

            // Đảm bảo min không vượt max và ngược lại
            if (index === 0) {
                // Nếu đang thay đổi min và min > max, thì set min = max
                if (newRange[0] > newRange[1]) {
                    newRange[0] = newRange[1];
                }
            } else {
                // Nếu đang thay đổi max và max < min, thì set max = min
                if (newRange[1] < newRange[0]) {
                    newRange[1] = newRange[0];
                }
            }

            // Cập nhật pendingPriceRange
            setPendingPriceRange(newRange);
            return newRange; // Trả về newRange để sử dụng ngay
        },
        [pendingPriceRange, minPrice, maxPrice],
    );

    // Xử lý khi thả chuột (mouse up)
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragIndex(null);
        // Chỉ gọi API nếu giá trị thay đổi
        if (pendingPriceRange[0] !== priceRange[0] || pendingPriceRange[1] !== priceRange[1]) {
            setPriceRange(pendingPriceRange);
            if (onFilterChange && title.toLowerCase().includes("price")) {
                console.log("Calling API with price range (mouse up):", pendingPriceRange); // Debug
                onFilterChange("price", pendingPriceRange); // Gọi API với khoảng giá cuối cùng
            }
        }
    }, [pendingPriceRange, priceRange, onFilterChange, title]);

    const handleMouseDown = (index) => (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragIndex(index);

        const handleMouseMove = (moveEvent) => {
            const sliderTrack = e.currentTarget?.parentElement || document.querySelector(".slider-track");
            if (!sliderTrack) return;

            const rect = sliderTrack.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
            const value = Math.round((percentage / 100) * (maxPrice - minPrice) + minPrice);
            handleRangeChange(index, value);
        };

        const handleMouseUpEvent = () => {
            handleMouseUp(); // Gọi handleMouseUp khi thả chuột
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUpEvent);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUpEvent);
    };

    const handleTrackClick = (e) => {
        if (isDragging) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        const value = Math.round((percentage / 100) * (maxPrice - minPrice) + minPrice);

        // Xác định thanh kéo gần nhất để di chuyển
        const distanceToMin = Math.abs(value - pendingPriceRange[0]);
        const distanceToMax = Math.abs(value - pendingPriceRange[1]);
        const indexToMove = distanceToMin <= distanceToMax ? 0 : 1;

        // Cập nhật và gọi API nếu giá trị thay đổi
        const newRange = handleRangeChange(indexToMove, value);
        if (newRange[0] !== priceRange[0] || newRange[1] !== priceRange[1]) {
            setPriceRange(newRange);
            if (onFilterChange && title.toLowerCase().includes("price")) {
                console.log("Calling API with price range (track click):", newRange); // Debug
                onFilterChange("price", newRange);
            }
        }
    };

    const handleInputChange = useCallback(
        (index, value) => {
            const numValue = parseInt(value) || 0;
            // Cập nhật và gọi API nếu giá trị thay đổi
            const newRange = handleRangeChange(index, numValue);

            // Gọi API ngay lập tức khi thay đổi input
            if (newRange[0] !== priceRange[0] || newRange[1] !== priceRange[1]) {
                setPriceRange(newRange);
                if (onFilterChange && title.toLowerCase().includes("price")) {
                    console.log("Calling API with price range (input):", newRange); // Debug
                    onFilterChange("price", newRange);
                }
            }
        },
        [handleRangeChange, priceRange, onFilterChange, title],
    );

    const getSliderPosition = (value) => {
        const range = maxPrice - minPrice;
        if (range === 0) return 0; // Tránh division by zero
        return Math.max(0, Math.min(100, ((value - minPrice) / range) * 100));
    };

    // Hàm kiểm tra xem option có được chọn hay không
    const isOptionChecked = (filterType, optionValue) => {
        if (filterType === "availability") {
            if (optionValue === "In stock") {
                return currentFilters.inStock === true;
            } else if (optionValue === "Out of stock") {
                return currentFilters.inStock === false;
            }
            return false;
        } else {
            const filterKey = `${filterType}Names`;
            return currentFilters[filterKey]?.includes(optionValue) || false;
        }
    };

    // Xử lý thay đổi checkbox
    const handleCheckboxChange = (value) => {
        if (onFilterChange) {
            console.log("Calling API with filter:", title, value); // Debug
            onFilterChange(title.toLowerCase(), value);
        }
    };

    const renderPriceSlider = () => (
        <div className="pt-6">
            <div className="mb-4 text-[15px] text-gray-600">Giá Cao Nhất: {maxPrice.toLocaleString()} VNĐ</div>

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
                            left: `${getSliderPosition(pendingPriceRange[0])}%`,
                            width: `${getSliderPosition(pendingPriceRange[1]) - getSliderPosition(pendingPriceRange[0])}%`,
                        }}
                    />

                    {/* Min Handle */}
                    <div
                        className={`absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform cursor-grab rounded-full border-2 border-black bg-white ${isDragging && dragIndex === 0 ? "scale-110 cursor-grabbing" : ""}`}
                        style={{ left: `${getSliderPosition(pendingPriceRange[0])}%` }}
                        onMouseDown={handleMouseDown(0)}
                    />

                    {/* Max Handle */}
                    <div
                        className={`absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform cursor-grab rounded-full border-2 border-black bg-white ${isDragging && dragIndex === 1 ? "scale-110 cursor-grabbing" : ""}`}
                        style={{ left: `${getSliderPosition(pendingPriceRange[1])}%` }}
                        onMouseDown={handleMouseDown(1)}
                    />
                </div>
            </div>

            {/* Price Input Fields */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">đ</span>
                        <input
                            type="number"
                            value={pendingPriceRange[0]}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                            className="w-full rounded-full border-0 bg-gray-100 py-2 pl-5 text-center text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            min={minPrice}
                            max={maxPrice}
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">đ</span>
                        <input
                            type="number"
                            value={pendingPriceRange[1]}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                            className="w-full rounded-full border-0 bg-gray-100 py-2 pl-5 text-center text-sm focus:ring-2 focus:ring-black focus:outline-none"
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

                    {/* Checkbox Filter Options */}
                    {!title.toLowerCase().includes("price") && (
                        <ul className="grid w-full gap-3 pt-6">
                            {getFilterOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className="flex w-full items-center gap-2"
                                >
                                    <input
                                        name={`filter.v.${title.toLowerCase()}`}
                                        value={option.value}
                                        className="checkbox h-5 w-5"
                                        id={`vertical-filter.v.${title.toLowerCase()}-${index}`}
                                        type="checkbox"
                                        checked={isOptionChecked(title.toLowerCase(), option.value)}
                                        onChange={(e) => handleCheckboxChange(e.target.value)}
                                    />
                                    <label
                                        htmlFor={`vertical-filter.v.${title.toLowerCase()}-${index}`}
                                        className="text-subtext reversed-link flex flex-grow items-center justify-between gap-1 text-gray-400"
                                    >
                                        <span className="text-[15px] font-bold">{option.label}</span>
                                        <span className="count">{option.count}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterComponents;

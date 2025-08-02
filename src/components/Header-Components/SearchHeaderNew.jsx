import React, { useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { APIContext } from "@/context/APIContext";
import SearchLoadingSkeleton from "../ui/SearchLoadingSkeleton";
import Fuse from "fuse.js";
import "./SearchHeader.css";

const SearchHeaderNew = ({ id = "categories" }) => {
    const { categories, products, loading } = useContext(APIContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Cấu hình Fuse.js được memoize và tối ưu cho tìm kiếm
    const fuseOptions = useMemo(
        () => ({
            keys: [
                { name: "productName", weight: 0.3 },
                { name: "brandName", weight: 0.2 },
                { name: "categoryName", weight: 0.2 },
                { name: "materialName", weight: 0.15 },
                { name: "colorName", weight: 0.2 }, // Tăng weight cho colorName
                { name: "sizeName", weight: 0.05 },
                { name: "unitName", weight: 0.05 },
                { name: "supplierName", weight: 0.05 },
                { name: "countryName", weight: 0.05 },
            ],
            threshold: 0.6, // Tăng threshold để dễ tìm hơn
            includeScore: true,
            includeMatches: true,
            minMatchCharLength: 1, // Giảm xuống 1 để tìm được các từ ngắn
            ignoreLocation: true,
            useExtendedSearch: true,
            findAllMatches: true, // Tìm tất cả matches
        }),
        [],
    );

    // Chuẩn bị dữ liệu searchable được memoize
    const searchableProducts = useMemo(() => {
        if (!products?.items || products.items.length === 0) return [];

        return products.items.flatMap((product) => {
            if (product.productVariants && product.productVariants.length > 0) {
                return product.productVariants.map((variant) => ({
                    ...product,
                    materialName: variant.materialName || "",
                    colorName: variant.colorName || "",
                    sizeName: variant.sizeName || "",
                    unitName: variant.unitName || "",
                    originalPrice: variant.originalPrice,
                    discountedPrice: variant.discountedPrice,
                    stockQty: variant.stockQty,
                    variantId: variant.id,
                    searchString: [
                        product.productName,
                        product.brandName,
                        product.categoryName,
                        product.countryName,
                        product.supplierName,
                        variant.materialName,
                        variant.colorName,
                        variant.sizeName,
                        variant.unitName,
                    ]
                        .filter((item) => item && item.toString().trim().length > 0)
                        .join(" ")
                        .toLowerCase()
                        .trim(),
                }));
            } else {
                return [
                    {
                        ...product,
                        materialName: "",
                        colorName: "",
                        sizeName: "",
                        unitName: "",
                        searchString: [product.productName, product.brandName, product.categoryName, product.countryName, product.supplierName]
                            .filter((item) => item && item.toString().trim().length > 0)
                            .join(" ")
                            .toLowerCase()
                            .trim(),
                    },
                ];
            }
        });
    }, [products]);

    // Khởi tạo Fuse instance được memoize
    const fuse = useMemo(() => {
        if (searchableProducts.length === 0) return null;
        return new Fuse(searchableProducts, fuseOptions);
    }, [searchableProducts, fuseOptions]);

    // Debounced search function
    const performSearch = useCallback(
        (searchValue) => {
            if (!fuse || !searchValue.trim()) {
                setSearchResults([]);
                setIsDropdownOpen(false);
                setIsSearching(false);
                return;
            }

            const trimmedSearch = searchValue.trim();
            if (trimmedSearch.length < 2) {
                setSearchResults([]);
                setIsDropdownOpen(false);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);

            // Debounce search
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                try {
                    const results = fuse.search(trimmedSearch);

                    const filteredResults = results
                        .filter((result) => result.score <= 0.8) // Tăng từ 0.6 lên 0.8
                        .slice(0, 10) // Tăng số lượng kết quả
                        .map((result) => result.item);

                    setSearchResults(filteredResults);
                    setIsDropdownOpen(filteredResults.length > 0 || trimmedSearch.length >= 2);
                    setIsSearching(false);
                } catch (error) {
                    console.error("Search error:", error);
                    setSearchResults([]);
                    setIsDropdownOpen(false);
                    setIsSearching(false);
                }
            }, 300); // 300ms debounce
        },
        [fuse],
    );

    // Xử lý tìm kiếm khi searchTerm thay đổi
    useEffect(() => {
        performSearch(searchTerm);
    }, [searchTerm, performSearch]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategoryChange = (event) => {
        const selectedCategoryId = event.target.value;
        setSelectedCategory(selectedCategoryId);
        if (selectedCategoryId) {
            navigate(`/products?category=${selectedCategoryId}`);
        }
    };

    const handleSearchSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (searchTerm.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
                setIsDropdownOpen(false);
            }
        },
        [searchTerm, navigate],
    );

    const handleProductClick = useCallback(
        (product) => {
            navigate(`/products/${product.id}`);
            setSearchTerm("");
            setIsDropdownOpen(false);
        },
        [navigate],
    );

    const handleSearchFocus = useCallback(() => {
        if (searchResults.length > 0 && searchTerm.trim().length >= 2) {
            setIsDropdownOpen(true);
        }
    }, [searchResults.length, searchTerm]);

    const formatPrice = useCallback((price) => {
        if (!price) return "";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    }, []);

    const getProductImage = useCallback((product) => {
        if (product.sliders && product.sliders.length > 0) {
            const firstImage = product.sliders.find((slider) => slider.isActive);
            return firstImage?.imageUrl || product.sliders[0]?.imageUrl;
        }
        return "/img/Products/default-product.jpg";
    }, []);

    const highlightMatch = useCallback((text, searchTerm) => {
        if (!searchTerm.trim() || !text) return text;

        const regex = new RegExp(`(${searchTerm.trim()})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <span
                    key={index}
                    className="search-highlight rounded bg-yellow-200 px-1 font-semibold"
                >
                    {part}
                </span>
            ) : (
                part
            ),
        );
    }, []);

    return (
        <div className="relative w-full">
            <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 rounded-full bg-gray-200"
            >
                <div className="relative flex items-center">
                    <select
                        id={id}
                        value={selectedCategory}
                        className="text-md block w-18 appearance-none rounded-full border-2 border-transparent bg-gray-200 px-5 py-3 font-bold text-gray-900 focus:border-black focus:bg-white md:w-40"
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Danh mục</option>
                        {categories?.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.categoryName}
                            </option>
                        ))}
                    </select>

                    <svg
                        className="pointer-events-none absolute right-2 w-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.25 7.5L10 13.75L3.75 7.5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div className="flex w-full items-center border-l border-gray-400 pl-2">
                    <input
                        ref={searchRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={handleSearchFocus}
                        className="w-full bg-transparent outline-none"
                        placeholder="Tìm kiếm sản phẩm theo tên, thương hiệu, chất liệu..."
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="ml-2 rounded-full p-2 transition-colors hover:bg-gray-300"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>
            </form>

            {/* Dropdown kết quả tìm kiếm */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="search-dropdown absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
                >
                    {isSearching ? (
                        <SearchLoadingSkeleton />
                    ) : searchResults.length > 0 ? (
                        <div className="p-2">
                            <div className="border-b p-2 text-sm text-gray-500">Tìm thấy {searchResults.length} sản phẩm</div>
                            {searchResults.map((product, index) => (
                                <div
                                    key={`${product.id}-${product.variantId || index}`}
                                    onClick={() => handleProductClick(product)}
                                    className="search-result-item flex cursor-pointer items-center gap-3 rounded-md p-3 transition-colors hover:bg-gray-50"
                                >
                                    {/* Ảnh sản phẩm */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.productName}
                                            className="h-12 w-12 rounded-md object-cover"
                                            onError={(e) => {
                                                e.target.src = "/img/Products/default-product.jpg";
                                            }}
                                        />
                                    </div>

                                    {/* Thông tin sản phẩm */}
                                    <div className="min-w-0 flex-1">
                                        <h4 className="truncate font-semibold text-gray-900">{highlightMatch(product.productName, searchTerm)}</h4>
                                        <div className="mt-1 text-sm text-gray-600">
                                            <span className="mr-2 inline-block">{highlightMatch(product.brandName, searchTerm)}</span>
                                            <span className="mr-2 inline-block">•</span>
                                            <span className="mr-2 inline-block">{highlightMatch(product.categoryName, searchTerm)}</span>
                                            {product.materialName && (
                                                <>
                                                    <span className="mr-2 inline-block">•</span>
                                                    <span className="mr-2 inline-block">{highlightMatch(product.materialName, searchTerm)}</span>
                                                </>
                                            )}
                                            {product.colorName && (
                                                <>
                                                    <span className="mr-2 inline-block">•</span>
                                                    <span className="inline-block">{highlightMatch(product.colorName, searchTerm)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Giá */}
                                    <div className="flex-shrink-0 text-right">
                                        {product.discountedPrice ? (
                                            <div>
                                                <div className="font-semibold text-red-600">{formatPrice(product.discountedPrice)}</div>
                                                <div className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</div>
                                            </div>
                                        ) : (
                                            <div className="font-semibold text-gray-900">{formatPrice(product.originalPrice)}</div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Xem tất cả kết quả */}
                            <div className="mt-2 border-t pt-2">
                                <button
                                    onClick={() => {
                                        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full py-2 text-center font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Xem tất cả kết quả cho "{searchTerm}"
                                </button>
                            </div>
                        </div>
                    ) : searchTerm.trim().length >= 2 ? (
                        <div className="p-4 text-center text-gray-500">
                            <svg
                                className="mx-auto mb-2 h-12 w-12 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <p>Không tìm thấy sản phẩm nào phù hợp với "{searchTerm}"</p>
                            <p className="mt-1 text-sm">Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default SearchHeaderNew;

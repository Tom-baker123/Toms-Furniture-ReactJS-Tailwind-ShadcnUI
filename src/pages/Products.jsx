import AboutMaterial from "@/components/Home/ProductCategoryComponents/AboutMaterial";
import BannerProducts from "@/components/Home/ProductCategoryComponents/BannerProducts";
import FilterComponents from "@/components/Home/ProductCategoryComponents/FilterComponents";
import ProductCategoryToolbar from "@/components/Home/ProductCategoryToolbar";
import CategorySwiper from "@/components/Home/Swiper-Components/CategorySwiper";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import showHeader from "@/hooks/showHeader";
import { cn } from "@/lib/utils";
import { ChevronDown, Grid2x2, List } from "lucide-react";
import React, { useCallback, useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { APIContext } from "@/context/APIContext";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@/components/ui/Pagination";

const Products = () => {
    // Sử dụng showHeader hook để lấy trạng thái hiển thị của header
    const showHead = showHeader();
    const navigate = useNavigate();
    const { products, loading, error, refetch } = useContext(APIContext);

    // Lấy categoryId param từ query string
    const location = useLocation();
    const { categories } = useContext(APIContext);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryIdParam = params.get("categoryId") || params.get("category"); // Hỗ trợ cả categoryId và category
        const searchParam = params.get("search"); // Thêm xử lý tham số search
        console.log("categoryIdParam from query:", categoryIdParam);
        console.log("searchParam from query:", searchParam);

        // Xử lý tham số search
        if (searchParam) {
            setFilters((prev) => ({
                ...prev,
                searchTerm: decodeURIComponent(searchParam),
                categoryIds: [], // Reset categoryIds khi có search
            }));
        } else if (categoryIdParam && categories) {
            // Chuyển đổi categoryIdParam thành số để so sánh với categoryId
            const categoryId = parseInt(categoryIdParam);
            if (!isNaN(categoryId)) {
                // Tìm category được chọn
                const selectedCategory = categories.find((cat) => cat.id === categoryId);

                if (selectedCategory) {
                    let categoryIdsToFilter = [categoryId];

                    // Nếu là parent category (parentId = null), thêm cả các child categories
                    if (selectedCategory.parentId === null) {
                        const childCategories = categories.filter((cat) => cat.parentId === categoryId);
                        const childCategoryIds = childCategories.map((cat) => cat.id);
                        categoryIdsToFilter = [...categoryIdsToFilter, ...childCategoryIds];
                        console.log("Parent category selected, including children:", categoryIdsToFilter);
                    }

                    setFilters((prev) => ({
                        ...prev,
                        categoryIds: categoryIdsToFilter,
                    }));
                }
            }
        } else {
            // Nếu không có categoryId param và không có search param, reset cả hai
            setFilters((prev) => ({
                ...prev,
                categoryIds: [],
                searchTerm: "",
            }));
        }

        // Reset về trang 1 khi URL thay đổi
        setCurrentPage(1);
    }, [location.search, categories]);

    // State cho pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8); // Số sản phẩm trên mỗi trang
    const pageSizeInputRef = useRef();
    const debounceTimeoutRef = useRef();

    const [filters, setFilters] = useState({
        categoryNames: [],
        categoryIds: [], // Thêm categoryIds để lọc theo ID
        brandNames: [],
        countryNames: [],
        colorNames: [],
        sizeNames: [],
        materialNames: [],
        minPrice: null,
        maxPrice: null,
        inStock: null,
        sortBy: "",
        sortOrder: "",
        searchTerm: "", // Thêm searchTerm cho tìm kiếm
    });

    // Hàm lọc và sắp xếp sản phẩm phía client
    const getFilteredAndSortedProducts = () => {
        if (!products?.items) return [];

        let filteredProducts = [...products.items];

        console.log("Current filters:", filters); // Debug log
        console.log("Total products before filter:", filteredProducts.length); // Debug log

        // Áp dụng tìm kiếm trước tiên
        if (filters.searchTerm && filters.searchTerm.trim()) {
            const searchTermLower = filters.searchTerm.toLowerCase().trim();
            filteredProducts = filteredProducts.filter((product) => {
                // Tìm kiếm trong tên sản phẩm
                if (product.productName && product.productName.toLowerCase().includes(searchTermLower)) {
                    return true;
                }

                // Tìm kiếm trong tên thương hiệu
                if (product.brandName && product.brandName.toLowerCase().includes(searchTermLower)) {
                    return true;
                }

                // Tìm kiếm trong tên danh mục
                if (product.categoryName && product.categoryName.toLowerCase().includes(searchTermLower)) {
                    return true;
                }

                // Tìm kiếm trong mô tả sản phẩm
                if (product.specificationDescription && product.specificationDescription.toLowerCase().includes(searchTermLower)) {
                    return true;
                }

                // Tìm kiếm trong các thuộc tính của variant
                return (
                    product.productVariants &&
                    product.productVariants.some((variant) => {
                        return (
                            (variant.colorName && variant.colorName.toLowerCase().includes(searchTermLower)) ||
                            (variant.sizeName && variant.sizeName.toLowerCase().includes(searchTermLower)) ||
                            (variant.materialName && variant.materialName.toLowerCase().includes(searchTermLower)) ||
                            (variant.unitName && variant.unitName.toLowerCase().includes(searchTermLower))
                        );
                    })
                );
            });
            console.log("Products after search filter:", filteredProducts.length); // Debug log
        }

        // Áp dụng các bộ lọc khác
        if (filters.categoryNames.length > 0) {
            filteredProducts = filteredProducts.filter((product) => filters.categoryNames.includes(product.categoryName));
        }

        // Lọc theo categoryId từ URL params
        if (filters.categoryIds.length > 0) {
            filteredProducts = filteredProducts.filter((product) => filters.categoryIds.includes(product.categoryId));
        }

        if (filters.brandNames.length > 0) {
            filteredProducts = filteredProducts.filter((product) => filters.brandNames.includes(product.brandName));
        }

        if (filters.countryNames.length > 0) {
            filteredProducts = filteredProducts.filter((product) => filters.countryNames.includes(product.countryName));
        }

        if (filters.colorNames.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productVariants.some((variant) => filters.colorNames.includes(variant.colorName)),
            );
        }

        if (filters.sizeNames.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productVariants.some((variant) => filters.sizeNames.includes(variant.sizeName)),
            );
        }

        if (filters.materialNames.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productVariants.some((variant) => filters.materialNames.includes(variant.materialName)),
            );
        }

        // Lọc theo giá (dựa vào discountedPrice)
        if (filters.minPrice !== null || filters.maxPrice !== null) {
            filteredProducts = filteredProducts.filter((product) => {
                const minPrice = Math.min(
                    ...product.productVariants.map((v) => v.discountedPrice ?? v.originalPrice).filter((price) => price != null),
                );

                if (filters.minPrice !== null && minPrice < filters.minPrice) return false;
                if (filters.maxPrice !== null && minPrice > filters.maxPrice) return false;
                return true;
            });
        }

        // Lọc theo trạng thái tồn kho
        if (filters.inStock !== null) {
            filteredProducts = filteredProducts.filter((product) => {
                const totalStock = product.productVariants.reduce((sum, variant) => sum + (variant.stockQty || 0), 0);
                return filters.inStock ? totalStock > 0 : totalStock === 0;
            });
        }

        // Sắp xếp
        if (filters.sortBy) {
            filteredProducts.sort((a, b) => {
                let comparison = 0;

                switch (filters.sortBy) {
                    case "title-ascending":
                        comparison = a.productName.localeCompare(b.productName);
                        break;
                    case "title-descending":
                        comparison = b.productName.localeCompare(a.productName);
                        break;
                    case "price-ascending":
                        const priceA = Math.min(
                            ...a.productVariants.map((v) => v.discountedPrice ?? v.originalPrice).filter((price) => price != null),
                        );
                        const priceB = Math.min(
                            ...b.productVariants.map((v) => v.discountedPrice ?? v.originalPrice).filter((price) => price != null),
                        );
                        comparison = priceA - priceB;
                        break;
                    case "price-descending":
                        const priceA2 = Math.min(
                            ...a.productVariants.map((v) => v.discountedPrice ?? v.originalPrice).filter((price) => price != null),
                        );
                        const priceB2 = Math.min(
                            ...b.productVariants.map((v) => v.discountedPrice ?? v.originalPrice).filter((price) => price != null),
                        );
                        comparison = priceB2 - priceA2;
                        break;
                    case "created-ascending":
                        comparison = new Date(a.createdAt) - new Date(b.createdAt);
                        break;
                    case "created-descending":
                        comparison = new Date(b.createdAt) - new Date(a.createdAt);
                        break;
                    default:
                        comparison = 0;
                }

                return comparison;
            });
        }

        console.log("Filtered products count:", filteredProducts.length); // Debug log
        return filteredProducts;
    };

    // Lấy danh sách sản phẩm đã lọc và sắp xếp
    const filteredProducts = getFilteredAndSortedProducts();

    // Tính toán pagination
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = useCallback((filterType, value) => {
        console.log("Filter change:", filterType, value); // Debug log
        setFilters((prevFilters) => {
            const newFilters = { ...prevFilters };

            // Xử lý filter category theo name
            if (filterType === "category") {
                const key = "categoryNames";
                // value là categoryName
                if (newFilters[key].includes(value)) {
                    newFilters[key] = newFilters[key].filter((item) => item !== value);
                } else {
                    newFilters[key] = [...newFilters[key], value];
                }
            }
            // Xử lý filter category theo ID (từ URL params)
            else if (filterType === "categoryId") {
                const key = "categoryIds";
                if (newFilters[key].includes(value)) {
                    newFilters[key] = newFilters[key].filter((item) => item !== value);
                } else {
                    newFilters[key] = [...newFilters[key], value];
                }
            }
            // Các filter khác giữ nguyên
            else if (["brand", "country", "color", "size", "material"].includes(filterType)) {
                const key = `${filterType}Names`;
                if (newFilters[key].includes(value)) {
                    newFilters[key] = newFilters[key].filter((item) => item !== value);
                } else {
                    newFilters[key] = [...newFilters[key], value];
                }
            }
            // Xử lý khoảng giá
            else if (filterType === "price") {
                newFilters.minPrice = value[0];
                newFilters.maxPrice = value[1];
            }
            // Xử lý trạng thái tồn kho
            else if (filterType === "availability") {
                if (value === "Còn hàng") {
                    newFilters.inStock = true;
                } else if (value === "Hết hàng") {
                    newFilters.inStock = false;
                } else {
                    newFilters.inStock = null;
                }
            }
            // Xử lý sắp xếp
            else if (filterType === "sortBy") {
                newFilters.sortBy = value;
                newFilters.sortOrder = value.includes("descending") ? "desc" : "asc";
            }

            // Reset về trang 1 khi có thay đổi filter
            setCurrentPage(1);
            return newFilters;
        });
    }, []);

    // Xử lý thay đổi trang
    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
        // Scroll lên toolbar sau khi đổi trang
        setTimeout(() => {
            const toolbar = document.getElementById("products-toolbar");
            if (toolbar) {
                toolbar.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 0);
    }, []);

    // Xử lý thay đổi số sản phẩm trên mỗi trang
    const handlePageSizeChange = useCallback((newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    }, []);

    // Debounce cho input page size
    const handlePageSizeInputChange = (e) => {
        const val = parseInt(e.target.value);
        setPageSize(e.target.value); // Cho phép nhập số tạm thời
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            if (!isNaN(val) && val > 0) {
                handlePageSizeChange(val);
            }
        }, 500);
    };

    // Xử lý thay đổi sort từ combobox
    const handleSortChange = (e) => {
        const value = e.target.value;
        handleFilterChange("sortBy", value);
    };

    const goToProductDetail = (param) => {
        navigate(`/products/${param}`, { replace: true });
    };

    return (
        <>
            {/* [1.] Khu vực làm banner */}
            <div className="container-custom">
                <BannerProducts className="my-2"></BannerProducts>
            </div>

            {/* [2.] Category List */}
            <div className="container-custom">
                <CategorySwiper />
                <div className="border-b"></div>
            </div>

            {/* [3.] Toolbar + Product List*/}
            <div
                id="products-toolbar"
                className="scroll-smooth pt-7 pb-[60px]"
            >
                {/* [3.1] Toolbar */}
                <div
                    className={cn(
                        `container-custom sticky z-10 bg-white py-3 transition-all duration-500`,
                        showHead ? `top-[133.5px] z-10 md:top-[157px] lg:top-[138px]` : `top-0 z-10`,
                    )}
                >
                    {/* Đảm bảo toolbar ở trên cùng */}
                    <div className="flex items-center justify-between">
                        <div className="flex h-full flex-col-reverse items-center gap-6 max-md:justify-between md:flex-row md:gap-3">
                            <ProductCategoryToolbar />
                            {/* Hiển thị tổng số sản phẩm từ API */}
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-md font-semibold text-gray-500">{totalItems} sản phẩm</span>
                                {/* Hiển thị thông báo tìm kiếm */}
                                {filters.searchTerm && <span className="text-sm text-blue-600">Kết quả tìm kiếm cho: "{filters.searchTerm}"</span>}
                            </div>

                            {/* Page Size Input - Ẩn trên mobile, hiển thị trên tablet+ */}
                            <div className="hidden items-center gap-2 sm:flex">
                                <label
                                    className="text-sm font-medium text-gray-700"
                                    htmlFor="pageSizeInput"
                                >
                                    Hiển thị:
                                </label>
                                <input
                                    id="pageSizeInput"
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={pageSize}
                                    onChange={handlePageSizeInputChange}
                                    ref={pageSizeInputRef}
                                    className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Right Toolbar */}
                        <div className="flex items-end gap-4 max-md:flex-col md:items-center lg:gap-8">
                            {/* Nút So sánh */}
                            {/* <label className="inline-flex cursor-pointer items-center gap-3">
                                <span className="text-md ms-3 !font-bold text-gray-900">So sánh: </span>
                                <input
                                    type="checkbox"
                                    value=""
                                    className="peer sr-only"
                                />
                                <div className="peer relative h-8 w-14.5 rounded-full bg-gray-200 transition-colors duration-100 peer-checked:bg-black peer-focus:outline-none after:absolute after:start-[5px] after:top-[4px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-white"></div>
                            </label> */}

                            {/* Combobox Để sắp xếp sản phẩm */}
                            <form className="hidden items-center gap-3 font-semibold lg:flex">
                                <label
                                    htmlFor="sortBy"
                                    className="text-md font-bold whitespace-nowrap"
                                >
                                    Sắp xếp theo:
                                </label>
                                <div className="relative my-2 inline-block text-left">
                                    <select
                                        id="sortBy"
                                        className="block appearance-none rounded-full border border-gray-300 bg-gray-100 px-4 py-2 pr-8 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        defaultValue="best-selling"
                                        onChange={handleSortChange}
                                    >
                                        <option value="manual">Nổi bật</option>
                                        <option value="best-selling">Bán chạy nhất</option>
                                        <option value="title-ascending">Tên A-Z</option>
                                        <option value="title-descending">Tên Z-A</option>
                                        <option value="price-ascending">Giá thấp đến cao</option>
                                        <option value="price-descending">Giá cao đến thấp</option>
                                        <option value="created-ascending">Cũ đến mới</option>
                                        <option value="created-descending">Mới đến cũ</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-0 mr-3 h-5 w-5 -translate-y-1/2 transform" />
                                </div>
                            </form>

                            {/* Hiển thị dưới dạng */}
                            <div className="flex items-end gap-2 font-semibold md:items-center">
                                <p className="text-md font-bold max-md:hidden">Hiển thị: </p>
                                {/* Layout Button 1 */}
                                <ButtonHovCT
                                    className={"!border-black !px-2.5 !py-2.5"}
                                    bgColor="bg-black"
                                    hoverBgColor=" bg-white"
                                    textColor="text-white"
                                >
                                    <Grid2x2 />
                                </ButtonHovCT>

                                {/* Layout Button 2 */}
                                <ButtonHovCT
                                    className={"!border-black !px-2.5 !py-2.5"}
                                    bgColor="bg-white"
                                    hoverBgColor=" bg-black"
                                    textColor="text-black"
                                    hoverTextColor="text-white"
                                >
                                    <List />
                                </ButtonHovCT>
                            </div>
                        </div>
                    </div>
                </div>

                {/* [3.2] Danh sách sản phẩm */}
                <div className="container-custom mt-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[15rem_1fr]">
                        {/* [4.1] Filter */}
                        <div className={cn(`sticky self-start transition-[top] max-lg:hidden`, showHead ? `top-[230px]` : `top-[90px]`)}>
                            {/* Bộ lọc Tình trạng hàng */}
                            <FilterComponents
                                showHead={showHead}
                                title="Availability"
                                onFilterChange={handleFilterChange}
                                products={products?.items || []}
                                currentFilters={filters}
                            />
                            {/* Bộ lọc Giá */}
                            <FilterComponents
                                showHead={showHead}
                                title="Price"
                                onFilterChange={handleFilterChange}
                                products={products?.items || []}
                                currentFilters={filters}
                            />
                            {/* Bộ lọc Danh mục */}
                            <FilterComponents
                                showHead={showHead}
                                title="Category"
                                onFilterChange={handleFilterChange}
                                products={products?.items || []}
                                currentFilters={filters}
                            />
                            {/* Bộ lọc Thương hiệu */}
                            <FilterComponents
                                showHead={showHead}
                                title="Brand"
                                onFilterChange={handleFilterChange}
                                products={products?.items || []}
                                currentFilters={filters}
                            />
                            {/* Bộ lọc Xuất xứ */}
                            <FilterComponents
                                showHead={showHead}
                                title="Country"
                                onFilterChange={handleFilterChange}
                                products={products?.items || []}
                                currentFilters={filters}
                            />
                            {/* Bộ lọc Màu sắc */}
                            <FilterComponents
                                showHead={showHead}
                                title="Color"
                                onFilterChange={handleFilterChange}
                                products={products?.items || []}
                                currentFilters={filters}
                            />
                            {/* Bộ lọc Kích thước */}
                            <FilterComponents
                                showHead={showHead}
                                title="Size"
                                onFilterChange={handleFilterChange}
                                products={products?.items || []}
                                currentFilters={filters}
                            />
                            {/* Bộ lọc Chất liệu */}
                            <FilterComponents
                                showHead={showHead}
                                title="Material"
                                onFilterChange={handleFilterChange}
                                products={products?.items || []}
                                currentFilters={filters}
                            />
                        </div>

                        {/* [4.2] Product List + Pagination */}
                        <div className="">
                            {/* [4.2.1] Product List */}
                            <div className="grid h-fit grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                                {/* Hiển thị trạng thái loading */}
                                {loading && (
                                    <div className="col-span-full flex items-center justify-center py-8">
                                        <p className="text-gray-500">Đang tải sản phẩm...</p>
                                    </div>
                                )}
                                {/* Hiển thị lỗi nếu có */}
                                {error && (
                                    <div className="col-span-full flex items-center justify-center py-8">
                                        <p className="text-red-500">Lỗi: {error}</p>
                                    </div>
                                )}
                                {/* Hiển thị thông báo khi không có sản phẩm */}
                                {!loading && !error && currentPageProducts?.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-8">
                                        {filters.searchTerm ? (
                                            <>
                                                <p className="text-center text-gray-500">
                                                    Không tìm thấy sản phẩm nào phù hợp với từ khóa "{filters.searchTerm}"
                                                </p>
                                                <p className="mt-2 text-sm text-gray-400">
                                                    Hãy thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn.</p>
                                        )}
                                    </div>
                                )}
                                {/* Hiển thị danh sách sản phẩm đã phân trang */}
                                {!loading &&
                                    !error &&
                                    currentPageProducts?.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group cursor-pointer"
                                        >
                                            {/* Product Image */}
                                            <div className="relative mb-3 overflow-hidden rounded-md">
                                                <Link to={`/products/${product.id}`}>
                                                    <img
                                                        className="aspect-square w-full rounded-md bg-gray-100 object-cover transition-transform duration-300 group-hover:scale-105"
                                                        src={product.sliders[0]?.imageUrl || "/img/placeholder.jpg"}
                                                        alt={product.productName}
                                                    />
                                                </Link>
                                                {/* Hiển thị promotion nếu có giảm giá */}
                                                {product.productVariants.some((pv) => pv.discountedPrice < pv.originalPrice) && (
                                                    <div className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                                                        Khuyến mãi
                                                    </div>
                                                )}
                                            </div>

                                            {/* Thông tin sản phẩm */}
                                            <div className="space-y-1">
                                                {/* Danh mục */}
                                                <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">{product.categoryName}</p>
                                                {/* Tên sản phẩm */}
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="line-clamp-2 text-lg font-bold text-ellipsis whitespace-nowrap text-gray-900"
                                                >
                                                    {product.productName}
                                                </Link>
                                                {/* Giá */}
                                                <p className="font-bold text-slate-500">
                                                    {Math.min(
                                                        ...product.productVariants
                                                            .map((pv) => pv.discountedPrice ?? pv.originalPrice)
                                                            .filter((price) => price != null),
                                                    ).toLocaleString()}{" "}
                                                    đ
                                                </p>
                                                {/* Tùy chọn màu sắc */}
                                                <div className="mt-2 flex items-center gap-2">
                                                    {[...new Set(product.productVariants.map((pv) => pv.colorName))].map((color, idx) => (
                                                        <Link
                                                            key={idx}
                                                            className="h-5 w-5 cursor-pointer rounded-xs border border-gray-300 transition-transform hover:scale-110"
                                                            style={{
                                                                backgroundColor:
                                                                    product.productVariants.find((pv) => pv.colorName === color)?.colorCode || "#000",
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* [4.2.2] Pagination */}
                            {totalItems > 0 && (
                                <div className="mt-3 flex flex-col items-center gap-4">
                                    {/* Thành phần phân trang */}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={totalItems}
                                        itemsPerPage={pageSize}
                                        showPages={3} // Giảm cho mobile
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* [5.] Collapsible Về cửa hàng */}
            <div className="">
                <AboutMaterial />
            </div>
        </>
    );
};

export default Products;

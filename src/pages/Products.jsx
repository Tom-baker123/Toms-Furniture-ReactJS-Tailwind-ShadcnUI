// import { NewArrivalsPicture } from "@/assets/FakeData";
import AboutMaterial from "@/components/Home/ProductCategoryComponents/AboutMaterial";
import BannerProducts from "@/components/Home/ProductCategoryComponents/BannerProducts";
import FilterComponents from "@/components/Home/ProductCategoryComponents/FilterComponents";
import ProductCategoryToolbar from "@/components/Home/ProductCategoryToolbar";
import CategorySwiper from "@/components/Swiper-Components/CategorySwiper";
// import ButtonHov from "@/components/tailwind-custom/ButtonHov";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
// import ButtonHovCustom from "@/components/tailwind-custom/ButtonHovCustom";
import showHeader from "@/hooks/showHeader";
import { cn } from "@/lib/utils";
import { ChevronDown, Funnel, Grid2x2, List } from "lucide-react";
import React, { useCallback, useContext, useState } from "react";
import { APIContext } from "@/context/APIContext";
import { Link, useNavigate } from "react-router-dom";

const Products = () => {
    // Sử dụng showHeader hook để lấy trạng thái hiển thị của header
    const showHead = showHeader();
    const navigate = useNavigate();
    const { products, loading, error, refetch } = useContext(APIContext);

    const [filters, setFilters] = useState({
        categoryNames: [],
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
    });

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = useCallback(
        (filterType, value) => {
            setFilters((prevFilters) => {
                const newFilters = { ...prevFilters };

                // Xử lý các bộ lọc dạng danh sách (checkbox)
                if (["category", "brand", "country", "color", "size", "material"].includes(filterType)) {
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
                    if (value === "In stock") {
                        newFilters.inStock = true;
                    } else if (value === "Out of stock") {
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

                // Gọi lại API với bộ lọc mới
                refetch(newFilters);
                return newFilters;
            });
        },
        [refetch],
    );

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
            <div className="scroll-smooth pt-7 pb-[60px]">
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
                            <span className="text-md font-semibold text-gray-500">{products?.totalCount || 0} products</span>
                        </div>

                        {/* Right Toolbar */}
                        <div className="flex items-end gap-4 max-md:flex-col md:items-center lg:gap-8">
                            {/* Nút Compare */}
                            <label className="inline-flex cursor-pointer items-center gap-3">
                                <span className="text-md ms-3 !font-bold text-gray-900">Compare: </span>
                                <input
                                    type="checkbox"
                                    value=""
                                    className="peer sr-only"
                                />
                                <div className="peer relative h-8 w-14.5 rounded-full bg-gray-200 transition-colors duration-100 peer-checked:bg-black peer-focus:outline-none after:absolute after:start-[5px] after:top-[4px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-white"></div>
                            </label>

                            {/* Combobox Để sắp xếp sản phẩm */}
                            <form className="hidden items-center gap-3 font-semibold lg:flex">
                                <label
                                    htmlFor="sortBy"
                                    className="text-md font-bold whitespace-nowrap"
                                >
                                    Sort By:
                                </label>
                                <div className="relative my-2 inline-block text-left">
                                    <select
                                        id="sortBy"
                                        className="block appearance-none rounded-full border border-gray-300 bg-gray-100 px-4 py-2 pr-8 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        defaultValue="best-selling"
                                        onChange={handleSortChange}
                                    >
                                        <option value="manual">Featured</option>
                                        <option value="best-selling">Best selling</option>
                                        <option value="title-ascending">Alphabetically, A-Z</option>
                                        <option value="title-descending">Alphabetically, Z-A</option>
                                        <option value="price-ascending">Price, low to high</option>
                                        <option value="price-descending">Price, high to low</option>
                                        <option value="created-ascending">Date, old to new</option>
                                        <option value="created-descending">Date, new to old</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-0 mr-3 h-5 w-5 -translate-y-1/2 transform" />
                                </div>
                            </form>

                            {/* Hiển thị dưới dạng */}
                            <div className="flex items-end gap-2 font-semibold md:items-center">
                                <p className="text-md font-bold max-md:hidden">View as: </p>
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
                            {/* Bộ lọc Availability */}
                            <FilterComponents
                                showHead={showHead}
                                title="Availability"
                                onFilterChange={handleFilterChange}
                            />
                            {/* Bộ lọc Price */}
                            <FilterComponents
                                showHead={showHead}
                                title="Price"
                                onFilterChange={handleFilterChange}
                            />
                            {/* Bộ lọc Category */}
                            <FilterComponents
                                showHead={showHead}
                                title="Category"
                                onFilterChange={handleFilterChange}
                            />
                            {/* Bộ lọc Brand */}
                            <FilterComponents
                                showHead={showHead}
                                title="Brand"
                                onFilterChange={handleFilterChange}
                            />
                            {/* Bộ lọc Country */}
                            <FilterComponents
                                showHead={showHead}
                                title="Country"
                                onFilterChange={handleFilterChange}
                            />
                            {/* Bộ lọc Color */}
                            <FilterComponents
                                showHead={showHead}
                                title="Color"
                                onFilterChange={handleFilterChange}
                            />
                            {/* Bộ lọc Size */}
                            <FilterComponents
                                showHead={showHead}
                                title="Size"
                                onFilterChange={handleFilterChange}
                            />
                            {/* Bộ lọc Material */}
                            <FilterComponents
                                showHead={showHead}
                                title="Material"
                                onFilterChange={handleFilterChange}
                            />
                        </div>

                        {/* [4.2] Product List */}
                        <div className="grid h-fit grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                            {/* Hiển thị trạng thái loading */}
                            {loading && <p>Loading products...</p>}
                            {/* Hiển thị lỗi nếu có */}
                            {error && <p className="text-red-500">Error: {error}</p>}
                            {/* Hiển thị danh sách sản phẩm từ API */}
                            {products?.items?.map((product) => (
                                <div
                                    key={product.id}
                                    className="group cursor-pointer"
                                >
                                    {/* Product Image */}
                                    <div className="relative mb-3 overflow-hidden rounded-md">
                                        <Link to={`/products/${product.id}`}>
                                            <img
                                                className="aspect-square w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                                                src={product.sliders[0]?.imageUrl || "/img/placeholder.jpg"}
                                                alt={product.productName}
                                            />
                                        </Link>
                                        {/* Hiển thị promotion nếu có giảm giá */}
                                        {product.productVariants.some((pv) => pv.discountedPrice < pv.originalPrice) && (
                                            <div className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                                                Sale
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-1">
                                        {/* Category */}
                                        <p className="text-sm font-semibold tracking-wider text-gray-600 uppercase">{product.categoryName}</p>
                                        {/* Product Name */}
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="line-clamp-2 text-lg font-bold text-gray-900"
                                        >
                                            {product.productName}
                                        </Link>
                                        {/* Price */}
                                        <p className="text-lg font-bold text-gray-900">
                                            $
                                            {Math.min(
                                                ...product.productVariants.map((pv) => pv.discountedPrice ?? pv.originalPrice),
                                            ).toLocaleString()}
                                        </p>
                                        {/* Color Options */}
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

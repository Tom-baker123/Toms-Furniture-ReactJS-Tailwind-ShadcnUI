import { NewArrivalsPicture } from "@/assets/FakeData";
import AboutMaterial from "@/components/Home/ProductCategoryComponents/AboutMaterial";
import BannerProducts from "@/components/Home/ProductCategoryComponents/BannerProducts";
import FilterComponents from "@/components/Home/ProductCategoryComponents/FilterComponents";
import ProductCategoryToolbar from "@/components/Home/ProductCategoryToolbar";
import CategorySwiper from "@/components/Swiper-Components/CategorySwiper";
import ButtonHov from "@/components/tailwind-custom/ButtonHov";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
// import ButtonHovCustom from "@/components/tailwind-custom/ButtonHovCustom";
import showHeader from "@/hooks/showHeader";
import { cn } from "@/lib/utils";
import { ChevronDown, Funnel, Grid2x2, List } from "lucide-react";
import React, { useState } from "react";

const Products = () => {
    // Sử dụng showHeader hook để lấy trạng thái hiển thị của header
    const showHead = showHeader();

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
                            <span className="text-md font-semibold text-gray-500">{106} products</span>
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
                            <FilterComponents
                                showHead={showHead}
                                title="Availability"
                            />
                            <FilterComponents
                                showHead={showHead}
                                title="Price"
                            />
                            <FilterComponents
                                showHead={showHead}
                                title="Availability"
                            />
                            <FilterComponents
                                showHead={showHead}
                                title="Brand"
                            />
                        </div>
                        {/* [4.2] Product List */}

                        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                            {NewArrivalsPicture.map((image, index) => (
                                <div key={index}>
                                    {image.info?.length > 0 ? (
                                        <img
                                            className={cn(`w-full rounded-md object-cover`, image.info?.length > 0 ? "aspect-square" : "h-full")}
                                            src={`/img/NewArrivals/${image.ImageURL}`}
                                            alt="asdsa"
                                        />
                                    ) : (
                                        <div className="relative grid h-full grid-cols-[1fr] overflow-hidden">
                                            <div className="block h-full w-full overflow-hidden">
                                                <img
                                                    className={cn(
                                                        `w-full rounded-md object-cover`,
                                                        image.info?.length > 0 ? "aspect-square" : "h-full",
                                                    )}
                                                    src={`/img/NewArrivals/${image.ImageURL}`}
                                                    alt="asdsa"
                                                />
                                            </div>
                                            <div className="content-overlay">
                                                <p className="mb-2 w-full text-left text-sm font-bold"> Promotion </p>
                                                <p className="w-full text-left text-xl font-bold"> Soft Stools Design </p>
                                                <div className="mt-8 flex w-full flex-1 items-end justify-start">
                                                    <p className="w-full">
                                                        <ButtonHov />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* pt-[12px] cho box title */}
                                    {Array.isArray(image.info) && image.info.length > 0 && (
                                        <div className="flex-1 pt-3">
                                            {image.info.map((info, idx) => (
                                                <div
                                                    className="flex h-full w-full flex-col justify-between"
                                                    key={idx}
                                                >
                                                    <p className="text-sm font-semibold text-gray-700">{info.type}</p>
                                                    <h3 className="text-[20px] font-bold">{info.proName}</h3>
                                                    <p className="font-bold">{info.price}</p>
                                                    <div className="flex gap-x-2">
                                                        <div className="mt-1 h-5 w-5 bg-gray-600 md:mt-2"></div>
                                                        <div className="mt-1 h-5 w-5 bg-gray-300 md:mt-2"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <AboutMaterial />
            </div>
        </>
    );
};

export default Products;

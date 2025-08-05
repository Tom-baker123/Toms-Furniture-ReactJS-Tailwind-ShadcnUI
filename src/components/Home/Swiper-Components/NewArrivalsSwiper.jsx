import React, { useState, useContext, useMemo } from "react";
import { cn } from "@/lib/utils";
import PaginationSwiper from "./PaginationSwiper";
import { APIContext } from "@/context/APIContext";
import { transformProductsToSwiperData, getHotItemsFromProducts } from "@/assets/FakeData";

const NewArrivalsSwiper = () => {
    const [activeTab, setActiveTab] = useState("NewArrivals"); // HotItems
    const { products, loading } = useContext(APIContext);

    // Transform products for different tabs
    const tabsData = useMemo(() => {
        // Only show loading if we haven't loaded any products yet
        const showLoading = loading && (!products || products.length === 0);

        const newArrivalsData = transformProductsToSwiperData(products, 8);
        const hotItemsData = getHotItemsFromProducts(products, 8);

        return {
            NewArrivals: {
                label: "New Arrivals",
                content: (
                    <PaginationSwiper
                        Picture={newArrivalsData}
                        loading={showLoading}
                    />
                ),
            },
            HotItems: {
                label: "Hot Items",
                content: (
                    <PaginationSwiper
                        Picture={hotItemsData}
                        loading={showLoading}
                    />
                ),
            },
        };
    }, [products, loading]);

    return (
        <section className="container-custom pt-6 md:pt-8">
            {/* 1. Section Header */}
            <div className="flex flex-col pb-6 md:flex-row md:gap-x-4 md:pb-8">
                <div className="flex-1">
                    <h2 className="block text-[22.4px] font-bold lg:text-[32px]">New Arrivals</h2>
                    <p className="pt-3 font-medium text-gray-500">Traditional divides between personal and professional space.</p>
                </div>
                <div className="flex flex-1 items-end pt-3 md:justify-end md:pt-0">
                    <div className="flex gap-x-6 font-semibold text-gray-500 md:gap-x-8">
                        {/* Object.entries() là một function có trong JS, để chuyển object thành mảng [key, value]. */}
                        {Object.entries(tabsData).map(([key, tab]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={cn(
                                    `flex cursor-pointer font-bold transition duration-75`,
                                    activeTab === key ? "flex font-extrabold text-black" : "hover:text-black",
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Section Content */}
            <div className="">{tabsData[activeTab].content}</div>
        </section>
    );
};

export default NewArrivalsSwiper;

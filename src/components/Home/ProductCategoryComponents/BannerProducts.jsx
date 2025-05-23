import React from "react";

const BannerProducts = ({ className, children }) => {
    return (
        <div className={className}>
            <div className="grid grid-cols-1 overflow-hidden rounded-lg md:grid-cols-2">
                <img
                    src="/img/ProductsCategory/collection-banner-1.png"
                    alt=""
                    className="order-last md:order-first"
                />
                <div className="flex items-center justify-center bg-red-100">
                    <div className="flex flex-col gap-2 px-5 py-5 md:w-3/4">
                        <h2 className="text-3xl font-bold">Shop All</h2>
                        <p className="text-sm font-semibold text-gray-500">
                            Browse our complete collection of furniture and decor to find everything you need for your perfect home.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerProducts;

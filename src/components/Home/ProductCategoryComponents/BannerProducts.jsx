import React from "react";

const BannerProducts = ({ className, children }) => {
    return (
        <div className={className}>
            <div className="grid grid-cols-2 overflow-hidden rounded-lg">
                <img
                    src="/img/ProductsCategory/collection-banner-1.png"
                    alt=""
                    className=""
                />
                <div className="bg-red-100 flex justify-center items-center">
                  <div className=" w-3/4 flex flex-col gap-2">
                    <h2 className="font-bold text-3xl">Shop All</h2>
                    <p className="font-semibold text-gray-500">Browse our complete collection of furniture and decor to find everything you need for your perfect home.</p>
                  </div>
                </div>
            </div>
        </div>
    );
};

export default BannerProducts;

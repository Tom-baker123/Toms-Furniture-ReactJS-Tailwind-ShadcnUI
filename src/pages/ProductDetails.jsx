import ProductImageGallery from "@/components/Home/ProductDetails/ProductImageGallery";
import React from "react";

const ProductDetails = () => {
    return (
        <div className="container-custom grid grid-cols-1 md:grid-cols-12">
            <div className="relative block w-full md:col-span-6">
                <div className="">
                    <ProductImageGallery />
                </div>
            </div>
            <div className="block w-full md:col-span-6">asdas</div>
        </div>
    );
};

export default ProductDetails;

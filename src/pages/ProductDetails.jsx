import ProductImageGallery from "@/components/Home/ProductDetails/ProductImageGallery";
import React from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
    const { slug } = useParams();

    return (
        <div className="container-custom">
            <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 lg:gap-x-12">
                {/* Left side - Product Images */}
                <div className="relative">
                    <ProductImageGallery />
                </div>

                {/* Right side - Product Information */}
                <div className="space-y-6">
                    {/* Product Title */}
                    <h1 className="text-2xl font-bold text-gray-900 max-md:whitespace-nowrap sm:text-3xl md:text-[40px]">Cross Chair Heritage</h1>

                    {/* Vendor and Product Type */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Vendor: FoxBazaar</span>
                        <span>|</span>
                        <span>Type: Chairs</span>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-red-600">$589.00</span>
                            <span className="text-lg text-gray-500 line-through">$800.00</span>
                        </div>
                    </div>

                    {/* Product Features */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                            <svg
                                className="h-4 w-4 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Modern</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg
                                className="h-4 w-4 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Eco-certified</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg
                                className="h-4 w-4 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Warranty</span>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                        <p className="text-sm font-medium text-green-800">Hurry up, only 8 items left in stock.</p>
                    </div>

                    {/* Color Options */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Color:</span>
                            <span className="text-sm text-gray-600">Light beige</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="h-8 w-8 rounded border-2 border-gray-300 bg-amber-100 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"></button>
                            <button className="h-8 w-8 rounded border-2 border-gray-300 bg-amber-800 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"></button>
                        </div>
                    </div>

                    {/* Material Options */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Material:</span>
                            <span className="text-sm text-gray-600">Oak</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none">
                                Oak
                            </button>
                            <button className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none">
                                Wood
                            </button>
                        </div>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center rounded border border-gray-300">
                                <button className="px-3 py-2 hover:bg-gray-50 focus:outline-none">-</button>
                                <span className="border-r border-l border-gray-300 px-4 py-2">1</span>
                                <button className="px-3 py-2 hover:bg-gray-50 focus:outline-none">+</button>
                            </div>
                            <button className="flex-1 rounded bg-gray-100 px-6 py-3 font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none">
                                Add To Cart
                            </button>
                        </div>

                        <button className="w-full rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none">
                            Buy It Now
                        </button>
                    </div>

                    {/* Shipping Information */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2 text-sm">
                            <svg
                                className="h-4 w-4 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <span className="text-gray-700">Free International Shipping over $600</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <svg
                                className="h-4 w-4 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                            </svg>
                            <span className="text-gray-700">Free Returns Within 30 days</span>
                        </div>
                    </div>

                    {/* Store Pickup */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <svg
                                    className="h-5 w-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 7h6m-6 4h6m-6 4h6"
                                    />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Pickup available at California Store</p>
                                    <p className="text-xs text-gray-600">Usually ready in 24 hours</p>
                                </div>
                            </div>
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Demo Notice */}
                    <div className="text-xs leading-relaxed text-gray-500">
                        This is a demonstration store by FoxBazaar. All images, videos, and other content belong exclusively to FoxBazaar and are not
                        authorized for reuse on any other stores.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

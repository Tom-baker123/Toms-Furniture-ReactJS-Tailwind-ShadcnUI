import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useHover } from "@/hooks/useHover";
import { navItem2Config } from "./megaMenuConfig";

const NavItem2 = () => {
    const { isHovered, handleMouseEnter, handleMouseLeave, forceShow } = useHover(100);
    const [activeTab, setActiveTab] = useState("Living Room");

    const getProductsForTab = (tabName) => {
        // Trả về sản phẩm theo tab được chọn
        return navItem2Config.roomProducts[tabName] || navItem2Config.productCategories;
    };

    return (
        <>
            {/* Shop By Room */}
            <li
                className="inline-flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <details
                    className="group lg:pb-4"
                    open
                >
                    <summary className="list-none appearance-none px-4 marker:hidden">
                        <span className="inline-block w-full py-1">
                            <p className="group underline-hover-text flex flex-wrap items-center gap-2">
                                Mua theo phòng {/* Shop By Room */}
                                <svg
                                    className="icon icon-caret-down icon--2xs icon--thick"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                        d="M16.25 7.5L10 13.75L3.75 7.5"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                            </p>
                        </span>
                    </summary>
                    {isHovered &&
                        createPortal(
                            <div className="fixed inset-0 top-11 z-40 bg-black/50 opacity-100 transition-all duration-300"></div>,
                            document.body,
                        )}
                    <div
                        className={`fixed left-0 z-50 mt-[17px] w-full bg-white shadow-2xl transition-all duration-300 ${
                            isHovered
                                ? "pointer-events-auto visible translate-y-0 opacity-100"
                                : "pointer-events-none invisible -translate-y-4 opacity-0"
                        }`}
                        onMouseEnter={() => forceShow()}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="mx-auto max-w-screen px-4 transition-all 2xl:max-w-7xl">
                            <div className="flex">
                                {/* Left Sidebar - Room Categories */}
                                <div className="w-80 border-r border-gray-200 px-6 py-8">
                                    <nav className="space-y-1">
                                        {navItem2Config.roomCategories.map((room, index) => (
                                            <div
                                                key={index}
                                                className="group"
                                            >
                                                <button
                                                    onMouseEnter={() => setActiveTab(room.title)}
                                                    className={`flex rounded-md font-bold w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 ${
                                                        activeTab === room.title
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                                    }`}
                                                >
                                                    <span>{room.title}</span>
                                                    {room.hasSubmenu && (
                                                        <svg
                                                            className="h-5 w-5 transform transition-transform group-hover:translate-x-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </nav>
                                </div>

                                {/* Right Content - Product Grid */}
                                <div className="flex-1 px-6 py-8">
                                    <div className="grid grid-cols-4 gap-6">
                                        {getProductsForTab(activeTab).map((category, index) => (
                                            <div
                                                key={index}
                                                className="group"
                                            >
                                                <a
                                                    href={category.href}
                                                    className="block"
                                                >
                                                    <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-50">
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <h3 className="text-left text-sm font-semibold text-gray-900">{category.name}</h3>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </details>
            </li>
        </>
    );
};

export default NavItem2;

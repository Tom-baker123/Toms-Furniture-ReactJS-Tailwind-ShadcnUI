import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavigationHelper from "@/utils/navigationHelper";

const NestedMenuColumn = ({ menuData, width = "w-80" }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const { handleNavigation, isActive } = NavigationHelper();

    const handleMenuHover = (item, index) => {
        if (item.submenu && item.submenu.length > 0) {
            setActiveMenu(index);
            setHoveredItem(index);
        } else {
            setActiveMenu(null);
            setHoveredItem(index);
        }
    };

    const handleMenuLeave = () => {
        setHoveredItem(null);
        // Không reset activeMenu để giữ submenu khi di chuyển chuột
    };

    const handleSubmenuLeave = () => {
        setActiveMenu(null);
        setHoveredItem(null);
    };

    return (
        <div className="">
            {/* Left Column - Main Menu */}
            <div className={`${width} border-r border-gray-200 bg-white`}>
                <div className="px-0 py-4">
                    {menuData.map((item, index) => (
                        <div
                            key={index}
                            className="relative"
                            onMouseEnter={() => handleMenuHover(item, index)}
                            onMouseLeave={handleMenuLeave}
                        >
                            <div
                                className={`flex cursor-pointer items-center justify-between px-4 py-2 transition-colors duration-200 ${
                                    hoveredItem === index ? "bg-gray-50" : ""
                                }`}
                                onClick={(e) => handleNavigation(item.href, e)}
                            >
                                <span className="text-sm font-medium text-gray-700">{item.title}</span>
                                {item.submenu && item.submenu.length > 0 && (
                                    <svg
                                        className="h-3 w-3 text-gray-400"
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column - Submenu */}
            {activeMenu !== null && menuData[activeMenu]?.submenu && (
                <div
                    className="absolute top-0 left-full w-64 bg-white"
                    onMouseEnter={() => setActiveMenu(activeMenu)}
                    onMouseLeave={handleSubmenuLeave}
                >
                    <div className="px-4 py-4">
                        {menuData[activeMenu].submenu.map((subItem, subIndex) => (
                            <div
                                key={subIndex}
                                className="mb-1"
                            >
                                {/* Sử dụng Link cho internal routes hoặc a tag cho external links */}
                                {subItem.href && (subItem.href.startsWith("http://") || subItem.href.startsWith("https://")) ? (
                                    <a
                                        href={subItem.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block rounded px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        {subItem.label}
                                        <svg
                                            className="ml-1 inline h-3 w-3"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                ) : subItem.href && subItem.href !== "#" ? (
                                    <Link
                                        to={subItem.href}
                                        className="block rounded px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        {subItem.label}
                                    </Link>
                                ) : (
                                    <div
                                        className="block cursor-pointer rounded px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
                                        onClick={(e) => handleNavigation(subItem.href, e)}
                                    >
                                        {subItem.label}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NestedMenuColumn;

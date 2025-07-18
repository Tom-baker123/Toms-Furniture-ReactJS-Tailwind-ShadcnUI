import React from "react";
import { createPortal } from "react-dom";
import { useHover } from "@/hooks/useHover";
import MegaMenuColumn from "./MegaMenuColumn";
import RecommendationPicture from "./RecommendationPicture";
import { navItem2Config } from "./megaMenuConfig";
import { getGridClass, filterValidColumns, getRecommendationWidth } from "./megaMenuUtils";

const NavItem2 = () => {
    const { isHovered, handleMouseEnter, handleMouseLeave, forceShow } = useHover(100);

    // Lọc các cột có dữ liệu và tính toán grid class
    const validColumns = filterValidColumns(navItem2Config.columns);
    const columnCount = validColumns.length;

    return (
        <>
            {/* Shop By Categories */}
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
                                Shop By Room
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
                    {/* // Trong component NavItem2: */}
                    {isHovered &&
                        createPortal(
                            <div className="fixed inset-0 top-11 z-40 bg-black/50 opacity-100 transition-all duration-300"></div>,
                            document.body,
                        )}
                    <div
                        className={`fixed left-0 z-10 mt-[17px] w-full bg-white shadow-2xl transition-all duration-300 ${
                            isHovered
                                ? "pointer-events-auto visible translate-y-0 opacity-100"
                                : "pointer-events-none invisible -translate-y-4 opacity-0"
                        }`}
                        onMouseEnter={() => forceShow()} // Giữ dropdown khi chuột vào
                        onMouseLeave={handleMouseLeave} // Ẩn dropdown khi chuột rời
                    >
                        <div className="custom-scrollbar z-50 mx-auto max-w-screen overflow-auto scroll-smooth px-4 transition-all 2xl:max-w-7xl">
                            <div className="flex flex-wrap">
                                <div className={`grid ${getGridClass(columnCount)} flex-1 gap-0`}>
                                    {validColumns.map((columnData, index) => (
                                        <MegaMenuColumn
                                            key={index}
                                            menuItems={columnData}
                                        />
                                    ))}
                                </div>
                                {/* -[RECOMMENDATION PICTURE]--------------------------------------*/}
                                <RecommendationPicture
                                    {...navItem2Config.recommendationPicture}
                                    className={getRecommendationWidth(columnCount)}
                                />
                                {/* -[RECOMMENDATION PICTURE]--------------------------------------*/}
                            </div>
                        </div>
                    </div>
                </details>
            </li>
        </>
    );
};

export default NavItem2;

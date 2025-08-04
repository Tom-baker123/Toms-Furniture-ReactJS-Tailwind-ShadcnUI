import React, { useContext, useMemo } from "react";
import { createPortal } from "react-dom";
import { useHover } from "@/hooks/useHover";
import MegaMenuColumn from "./MegaMenuColumn";
import RecommendationPicture from "./RecommendationPicture";
import { megaMenuConfig } from "./megaMenuConfig";
import { getGridClass, filterValidColumns, getRecommendationWidth } from "./megaMenuUtils";
import { APIContext } from "@/context/APIContext";
import { createMegaMenuFromCategories } from "./categoryUtils";

const NavItem1 = () => {
    const { isHovered, handleMouseEnter, handleMouseLeave, forceShow } = useHover(100);

    // Lấy dữ liệu categories từ APIContext
    const { categories, loading, error } = useContext(APIContext);

    // Tạo mega menu config từ categories API hoặc fallback về config tĩnh
    const currentMegaMenuConfig = useMemo(() => {
        if (categories && categories.length > 0) {
            return createMegaMenuFromCategories(categories);
        }
        return megaMenuConfig; // Fallback về config tĩnh nếu chưa có data
    }, [categories]);

    // Lọc các cột có dữ liệu và tính toán grid class
    const validColumns = filterValidColumns(currentMegaMenuConfig.columns);
    const columnCount = validColumns.length;

    // Nếu đang loading hoặc có lỗi, vẫn hiển thị menu với config tĩnh
    const shouldShowMenu = !loading && !error && validColumns.length > 0;

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
                                Mua theo danh mục {/* Shop By Categories */}
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
                    {/* // Trong component NavItem1: */}
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
                        onMouseEnter={() => forceShow()} // Giữ dropdown khi chuột vào
                        onMouseLeave={handleMouseLeave} // Ẩn dropdown khi chuột rời
                    >
                        <div className="custom-scrollbar mx-auto max-w-screen overflow-auto scroll-smooth px-4 transition-all 2xl:max-w-7xl">
                            <div className="flex flex-wrap">
                                <div className={`grid ${getGridClass(columnCount)} flex-1 gap-0`}>
                                    {shouldShowMenu ? (
                                        validColumns.map((columnData, index) => (
                                            <MegaMenuColumn
                                                key={index}
                                                menuItems={columnData}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full flex items-center justify-center py-8">
                                            {loading && <div className="text-gray-500">Đang tải danh mục...</div>}
                                            {error && <div className="text-red-500">Không thể tải danh mục</div>}
                                            {!loading && !error && validColumns.length === 0 && (
                                                <div className="text-gray-500">Không có danh mục nào</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* -[RECOMMENDATION PICTURE]--------------------------------------*/}
                                <RecommendationPicture
                                    {...currentMegaMenuConfig.recommendationPicture}
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

export default NavItem1;

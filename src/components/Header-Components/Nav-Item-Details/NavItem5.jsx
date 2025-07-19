import React from "react";
import { createPortal } from "react-dom";
import { useHover } from "@/hooks/useHover";
import NestedMenuColumn from "./NestedMenuColumn";
import { navItem5Config } from "./megaMenuConfig";

const NavItem5 = () => {
    const { isHovered, handleMouseEnter, handleMouseLeave, forceShow } = useHover(100);

    return (
        <>
            {/* Pages */}
            <li
                className="inline-flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <details
                    className="group relative lg:pb-4"
                    open
                >
                    <summary className="list-none appearance-none px-4 marker:hidden">
                        <span className="inline-block w-full py-1">
                            <p className="group underline-hover-text flex flex-wrap items-center gap-2">
                                Pages
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
                        className={`absolute top-full left-0 z-50 mt-[1px] transition-all duration-300 ${
                            isHovered
                                ? "pointer-events-auto visible translate-y-0 opacity-100"
                                : "pointer-events-none invisible -translate-y-4 opacity-0"
                        }`}
                        onMouseEnter={() => forceShow()} // Giữ dropdown khi chuột vào
                        onMouseLeave={handleMouseLeave} // Ẩn dropdown khi chuột rời
                    >
                        <NestedMenuColumn
                            menuData={navItem5Config.nestedMenuData}
                            width="w-48"
                        />
                    </div>
                </details>
            </li>
        </>
    );
};

export default NavItem5;

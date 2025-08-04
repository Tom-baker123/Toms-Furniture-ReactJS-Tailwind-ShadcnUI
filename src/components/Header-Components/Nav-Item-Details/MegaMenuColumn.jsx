import React from "react";

/**
 * Component hiển thị một cột trong mega menu
 * @param {object} props - Props của component
 * @param {Array} props.menuItems - Mảng các menu items
 * @param {string} props.className - Custom CSS class
 */
const MegaMenuColumn = ({ menuItems = [], className = "" }) => {
    return (
        <div className={`mega-menu__column flex flex-col gap-8 ${className}`}>
            {menuItems.map((section, sectionIndex) => (
                <div
                    key={sectionIndex}
                    className="mega-menu__item"
                >
                    <a
                        href={section.href || "#"}
                        className="mega-menu__link"
                    >
                        {section.title}
                    </a>
                    <ul className="mt-3.5 font-medium text-gray-500">
                        {section.items.map((item, itemIndex) => (
                            <li
                                key={itemIndex}
                                className="mb-3"
                            >
                                <a
                                    href={item.href}
                                    className={`mega-menu__link block ${item.isViewAll ? "font-semibold text-gray-800 hover:text-blue-600" : ""}`}
                                >
                                    <span className="reversed-link__text">{item.label}</span>
                                    {item.roomTypeName && <span className="ml-2 text-xs text-purple-500">({item.roomTypeName})</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MegaMenuColumn;

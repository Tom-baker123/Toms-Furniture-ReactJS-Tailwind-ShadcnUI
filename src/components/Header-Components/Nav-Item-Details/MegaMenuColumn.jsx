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
                    <ul className="font-medium text-gray-500">
                        {section.items.map((item, itemIndex) => (
                            <li
                                key={itemIndex}
                                className="gap-0.5"
                            >
                                <a
                                    href={item.href}
                                    className="mega-menu__link block"
                                >
                                    <span className="reversed-link__text">{item.label}</span>
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

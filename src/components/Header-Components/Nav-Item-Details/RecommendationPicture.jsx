import React from "react";
import ButtonHov from "@/components/tailwind-custom/ButtonHov";

/**
 * Component hiển thị hình ảnh khuyến mãi trong nav menu
 * @param {object} props - Props của component
 * @param {string} props.imageUrl - URL của hình ảnh
 * @param {string} props.imageAlt - Alt text cho hình ảnh
 * @param {string} props.title - Tiêu đề chính
 * @param {string} props.subtitle - Tiêu đề phụ
 * @param {string} props.href - Link khi click
 * @param {string} props.className - Custom CSS class
 * @param {object} props.customStyles - Custom styles cho các phần tử
 */
const RecommendationPicture = ({
    imageUrl = "https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100",
    imageAlt = "",
    title = "Home&Decor",
    subtitle = "Decoration From $10",
    href = "#",
    className = "",
    customStyles = {},
}) => {
    const {
        containerClass = "nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px] !border-l-[1px] !border-gray-300",
        imageClass = "rounded-md",
        titleClass = "mb-4 text-center text-xl",
        subtitleClass = "text-center text-3xl",
        overlayClass = "content-overlay",
    } = customStyles;

    return (
        <div className={`${containerClass} ${className}`}>
            <div>
                <a href={href}>
                    <div className="relative grid grid-cols-[1fr] overflow-hidden">
                        <div className="block h-full w-full overflow-hidden">
                            <img
                                className={imageClass}
                                src={imageUrl}
                                alt={imageAlt}
                            />
                        </div>
                        <div className={overlayClass}>
                            <p className={titleClass}>{title}</p>
                            <p className={subtitleClass}>{subtitle}</p>
                            <div className="mt-8 flex flex-1 items-end">
                                <p>
                                    <ButtonHov />
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default RecommendationPicture;

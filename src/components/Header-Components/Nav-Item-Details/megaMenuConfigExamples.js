// Ví dụ về cách tùy biến mega menu config

import { megaMenuConfig } from './megaMenuConfig';

// 1. Ví dụ tạo config cho mega menu khác (ví dụ: NavItem2)
export const megaMenuConfig2 = {
    columns: [
        // Cột 1 - Sale & Promotions
        [
            {
                title: "Sale",
                href: "/sale",
                items: [
                    { label: "Up to 50% Off", href: "/sale/50-off" },
                    { label: "Clearance", href: "/sale/clearance" },
                    { label: "Bundle Deals", href: "/sale/bundles" },
                    { label: "Daily Deals", href: "/sale/daily" }
                ]
            }
        ],
        // Cột 2 - Brands
        [
            {
                title: "Top Brands",
                href: "/brands",
                items: [
                    { label: "IKEA", href: "/brands/ikea" },
                    { label: "West Elm", href: "/brands/west-elm" },
                    { label: "CB2", href: "/brands/cb2" },
                    { label: "Design Within Reach", href: "/brands/dwr" }
                ]
            }
        ]
    ],
    recommendationPicture: {
        imageUrl: "https://example.com/sale-banner.jpg",
        imageAlt: "Sale Banner",
        title: "Summer Sale",
        subtitle: "Up to 70% Off",
        href: "/summer-sale",
        customStyles: {
            containerClass: "nav-promotion-custom nav-promotion-custom-grid pt-[20px] pb-[40px] pl-[20px]",
            imageClass: "rounded-lg shadow-lg",
            titleClass: "mb-2 text-center text-2xl font-bold text-red-600",
            subtitleClass: "text-center text-4xl font-extrabold",
            overlayClass: "content-overlay bg-gradient-to-t from-black/60 to-transparent"
        }
    }
};

// 2. Ví dụ override một phần config
export const customMegaMenuConfig = {
    ...megaMenuConfig,
    recommendationPicture: {
        ...megaMenuConfig.recommendationPicture,
        title: "New Collection",
        subtitle: "Furniture From $50",
        customStyles: {
            ...megaMenuConfig.recommendationPicture.customStyles,
            titleClass: "mb-4 text-center text-2xl font-bold text-blue-600",
            subtitleClass: "text-center text-4xl font-extrabold text-green-600"
        }
    }
};

// 3. Ví dụ config động dựa trên props
export const createDynamicMegaMenuConfig = (theme = 'default') => {
    const baseConfig = megaMenuConfig;

    if (theme === 'dark') {
        return {
            ...baseConfig,
            recommendationPicture: {
                ...baseConfig.recommendationPicture,
                customStyles: {
                    ...baseConfig.recommendationPicture.customStyles,
                    containerClass: "nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px] bg-gray-900",
                    titleClass: "mb-4 text-center text-xl text-white",
                    subtitleClass: "text-center text-3xl text-white",
                    overlayClass: "content-overlay bg-gray-900/80"
                }
            }
        };
    }

    return baseConfig;
};

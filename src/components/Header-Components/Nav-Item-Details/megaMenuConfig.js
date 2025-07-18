// Cấu hình dữ liệu cho tất cả mega menu
export const megaMenuConfig = {
    // Dữ liệu các cột menu
    columns: [
        // Cột 1
        [
            {
                title: "Furniture",
                href: "#",
                items: [
                    { label: "Sofas", href: "/collections/sofas" },
                    { label: "Tables & Desks", href: "/collections/tables-desk" },
                    { label: "Chair & Stools", href: "/collections/chairs-stool" },
                    { label: "Shelves", href: "/collections/shelves" },
                    { label: "Shop All", href: "/collections/all" }
                ]
            },
            // {
            //     title: "Lighting",
            //     href: "#",
            //     items: [
            //         { label: "Pendant Lights", href: "/collections/pendant-lights" },
            //         { label: "Table Lamps", href: "/collections/table-lamps" },
            //         { label: "Floor Lamps", href: "/collections/floor-lamps" },
            //         { label: "Ceiling Lights", href: "/collections/ceiling-lights" },
            //         { label: "Shop All", href: "/collections/lighting-all" }
            //     ]
            // }
        ],
        // Cột 2
        [
            {
                title: "Decor",
                href: "#",
                items: [
                    { label: "Vases", href: "/collections/vases" },
                    { label: "Mirrors", href: "/collections/mirrors" },
                    { label: "Artwork", href: "/collections/artwork" },
                    { label: "Cushions", href: "/collections/cushions" },
                    { label: "Shop All", href: "/collections/decor-all" }
                ]
            },
            // {
            //     title: "Storage",
            //     href: "#",
            //     items: [
            //         { label: "Wardrobes", href: "/collections/wardrobes" },
            //         { label: "Drawers", href: "/collections/drawers" },
            //         { label: "Bookcases", href: "/collections/bookcases" },
            //         { label: "Storage Boxes", href: "/collections/storage-boxes" },
            //         { label: "Shop All", href: "/collections/storage-all" }
            //     ]
            // }
        ],
        // Cột 3
        [
            {
                title: "Kitchen",
                href: "#",
                items: [
                    { label: "Kitchen Tables", href: "/collections/kitchen-tables" },
                    { label: "Bar Stools", href: "/collections/bar-stools" },
                    { label: "Kitchen Storage", href: "/collections/kitchen-storage" },
                    { label: "Accessories", href: "/collections/kitchen-accessories" },
                    { label: "Shop All", href: "/collections/kitchen-all" }
                ]
            },
            // {
            //     title: "Outdoor",
            //     href: "#",
            //     items: [
            //         { label: "Garden Furniture", href: "/collections/garden-furniture" },
            //         { label: "Outdoor Lighting", href: "/collections/outdoor-lighting" },
            //         { label: "Planters", href: "/collections/planters" },
            //         { label: "Parasols", href: "/collections/parasols" },
            //         { label: "Shop All", href: "/collections/outdoor-all" }
            //     ]
            // }
        ],
        // Cột 4
        // [
        //     {
        //         title: "Bedroom",
        //         href: "#",
        //         items: [
        //             { label: "Beds", href: "/collections/beds" },
        //             { label: "Mattresses", href: "/collections/mattresses" },
        //             { label: "Bedside Tables", href: "/collections/bedside-tables" },
        //             { label: "Wardrobes", href: "/collections/bedroom-wardrobes" },
        //             { label: "Shop All", href: "/collections/bedroom-all" }
        //         ]
        //     }
        // ]
    ],

    // Cấu hình cho recommendation picture
    recommendationPicture: {
        imageUrl: "https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100",
        imageAlt: "Home & Decor Collection",
        title: "Home&Decor",
        subtitle: "Decoration From $10",
        href: "#",
        customStyles: {
            containerClass: "nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px] border-l-[1px] border-gray-300",
            imageClass: "rounded-md",
            titleClass: "mb-4 text-center text-xl",
            subtitleClass: "text-center text-3xl",
            overlayClass: "content-overlay"
        }
    }
};

// NavItem2 Config - Shop By Room
export const navItem2Config = {
    columns: [
        // Cột 1 - Living Room
        [
            {
                title: "Living Room",
                href: "#",
                items: [
                    { label: "Sofas & Sectionals", href: "/collections/living-room-sofas" },
                    { label: "Coffee Tables", href: "/collections/living-room-coffee-tables" },
                    { label: "TV Stands", href: "/collections/living-room-tv-stands" },
                    { label: "Accent Chairs", href: "/collections/living-room-chairs" },
                    { label: "Shop All", href: "/collections/living-room-all" }
                ]
            }
        ],
        // Cột 2 - Bedroom
        [
            {
                title: "Bedroom",
                href: "#",
                items: [
                    { label: "Beds & Frames", href: "/collections/bedroom-beds" },
                    { label: "Dressers", href: "/collections/bedroom-dressers" },
                    { label: "Nightstands", href: "/collections/bedroom-nightstands" },
                    { label: "Wardrobes", href: "/collections/bedroom-wardrobes" },
                    { label: "Shop All", href: "/collections/bedroom-all" }
                ]
            }
        ],
        // Cột 3 - Dining Room
        [
            {
                title: "Dining Room",
                href: "#",
                items: [
                    { label: "Dining Tables", href: "/collections/dining-room-tables" },
                    { label: "Dining Chairs", href: "/collections/dining-room-chairs" },
                    { label: "Bar Stools", href: "/collections/dining-room-stools" },
                    { label: "Buffets & Sideboards", href: "/collections/dining-room-storage" },
                    { label: "Shop All", href: "/collections/dining-room-all" }
                ]
            }
        ]
    ],
    recommendationPicture: {
        imageUrl: "https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100",
        imageAlt: "Shop By Room Collection",
        title: "Room Sets",
        subtitle: "Complete Your Space",
        href: "#",
        customStyles: {
            containerClass: "nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px] border-l-[1px] border-gray-300",
            imageClass: "rounded-md",
            titleClass: "mb-4 text-center text-xl",
            subtitleClass: "text-center text-3xl",
            overlayClass: "content-overlay"
        }
    }
};

// NavItem3 Config - Table & Desk
export const navItem3Config = {
    columns: [
        // Cột 1 - Tables
        [
            {
                title: "Dining Tables",
                href: "#",
                items: [
                    { label: "Round Tables", href: "/collections/round-dining-tables" },
                    { label: "Rectangle Tables", href: "/collections/rectangle-dining-tables" },
                    { label: "Square Tables", href: "/collections/square-dining-tables" },
                    { label: "Extendable Tables", href: "/collections/extendable-dining-tables" },
                    { label: "Shop All", href: "/collections/dining-tables-all" }
                ]
            }
        ],
        // Cột 2 - Desks
        [
            {
                title: "Desks & Workstations",
                href: "#",
                items: [
                    { label: "Office Desks", href: "/collections/office-desks" },
                    { label: "Computer Desks", href: "/collections/computer-desks" },
                    { label: "Standing Desks", href: "/collections/standing-desks" },
                    { label: "Writing Desks", href: "/collections/writing-desks" },
                    { label: "Shop All", href: "/collections/desks-all" }
                ]
            }
        ]
    ],
    recommendationPicture: {
        imageUrl: "https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100",
        imageAlt: "Table & Desk Collection",
        title: "Workspace",
        subtitle: "Tables From $99",
        href: "#",
        customStyles: {
            containerClass: "nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px] border-l-[1px] border-gray-300",
            imageClass: "rounded-md",
            titleClass: "mb-4 text-center text-xl",
            subtitleClass: "text-center text-3xl",
            overlayClass: "content-overlay"
        }
    }
};

// NavItem4 Config - Chairs & Stools
export const navItem4Config = {
    columns: [
        // Cột 1 - Dining Chairs
        [
            {
                title: "Dining Chairs",
                href: "#",
                items: [
                    { label: "Upholstered Chairs", href: "/collections/upholstered-dining-chairs" },
                    { label: "Wooden Chairs", href: "/collections/wooden-dining-chairs" },
                    { label: "Metal Chairs", href: "/collections/metal-dining-chairs" },
                    { label: "Accent Chairs", href: "/collections/accent-dining-chairs" },
                    { label: "Shop All", href: "/collections/dining-chairs-all" }
                ]
            }
        ],
        // Cột 2 - Bar Stools
        [
            {
                title: "Bar Stools & Counter Stools",
                href: "#",
                items: [
                    { label: "Bar Height Stools", href: "/collections/bar-height-stools" },
                    { label: "Counter Height Stools", href: "/collections/counter-height-stools" },
                    { label: "Adjustable Stools", href: "/collections/adjustable-stools" },
                    { label: "Backless Stools", href: "/collections/backless-stools" },
                    { label: "Shop All", href: "/collections/stools-all" }
                ]
            }
        ]
    ],
    recommendationPicture: {
        imageUrl: "https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100",
        imageAlt: "Chairs & Stools Collection",
        title: "Seating",
        subtitle: "Chairs From $49",
        href: "#",
        customStyles: {
            containerClass: "nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px] border-l-[1px] border-gray-300",
            imageClass: "rounded-md",
            titleClass: "mb-4 text-center text-xl",
            subtitleClass: "text-center text-3xl",
            overlayClass: "content-overlay"
        }
    }
};

// NavItem5 Config - Pages
export const navItem5Config = {
    columns: [
        // Cột 1 - Page Links
        [
            {
                title: "Company",
                href: "#",
                items: [
                    { label: "About Us", href: "/about" },
                    { label: "Contact", href: "/contact" },
                    { label: "Find A Store", href: "/find-store" },
                    { label: "FAQ", href: "/faq" },
                    { label: "Blog", href: "/blog" }
                ]
            }
        ]
    ],
    recommendationPicture: {
        imageUrl: "https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100",
        imageAlt: "Company Information",
        title: "Support",
        subtitle: "We're Here to Help",
        href: "/contact",
        customStyles: {
            containerClass: "nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px] border-l-[1px] border-gray-300",
            imageClass: "rounded-md",
            titleClass: "mb-4 text-center text-xl",
            subtitleClass: "text-center text-3xl",
            overlayClass: "content-overlay"
        }
    }
};

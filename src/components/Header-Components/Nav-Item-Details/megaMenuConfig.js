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
    // Cấu hình hiển thị grid sản phẩm
    displayType: "productGrid",
    productCategories: [
        {
            id: "tables-desks",
            name: "Tables & Desks",
            image: "/img/category-menu/Turn-Table-Mono.png",
            href: "/collections/tables-desks"
        },
        {
            id: "sofas",
            name: "Sofas",
            image: "/img/category-menu/Spoke-Sofa-Basic.png",
            href: "/collections/sofas"
        },
        {
            id: "chairs-stools",
            name: "Chairs & Stools",
            image: "/img/category-menu/Arc-Chair-dark.png",
            href: "/collections/chairs-stools"
        },
        {
            id: "storages-cabinets",
            name: "Storages & Cabinets",
            image: "/img/category-menu/Curve-Coat-Rack-Shelf.png",
            href: "/collections/storages-cabinets"
        },
        {
            id: "bow-chairs",
            name: "Bow Chairs",
            image: "/img/category-menu/Turn-chair-colorful.png",
            href: "/collections/bow-chairs"
        },
        {
            id: "cross-bar-chairs",
            name: "Cross Bar Chairs",
            image: "/img/category-menu/Cross-Table-dark_b9e51138-56b9-45fa-a3a6-89b1f918425a.png",
            href: "/collections/cross-bar-chairs"
        },
        {
            id: "single-coffee-tables",
            name: "Single Coffee Tables",
            image: "/img/category-menu/Turn-chair-Warm.png",
            href: "/collections/single-coffee-tables"
        },
        {
            id: "soft-bench",
            name: "Soft Bench",
            image: "/img/category-menu/Curve-Coat-Rack.png",
            href: "/collections/soft-bench"
        }
    ],
    // Sidebar menu cho room navigation
    roomCategories: [
        {
            title: "Living Room",
            href: "/collections/living-room",
            hasSubmenu: true
        },
        {
            title: "Dining & Kitchen",
            href: "/collections/dining-kitchen",
            hasSubmenu: true
        },
        {
            title: "Bed Room",
            href: "/collections/bedroom",
            hasSubmenu: true
        },
        {
            title: "Work Room",
            href: "/collections/work-room",
            hasSubmenu: true
        },
        {
            title: "Outdoor",
            href: "/collections/outdoor",
            hasSubmenu: true
        }
    ],
    // Cấu hình sản phẩm theo từng room
    roomProducts: {
        "Living Room": [
            {
                id: "sofas",
                name: "Sofas",
                image: "/img/category-menu/Spoke-Sofa-Basic.png",
                href: "/collections/sofas"
            },
            {
                id: "chairs-stools",
                name: "Chairs & Stools",
                image: "/img/category-menu/Arc-Chair-dark.png",
                href: "/collections/chairs-stools"
            },
            {
                id: "single-coffee-tables",
                name: "Single Coffee Tables",
                image: "/img/category-menu/Turn-chair-Warm.png",
                href: "/collections/single-coffee-tables"
            },
            {
                id: "storages-cabinets",
                name: "Storages & Cabinets",
                image: "/img/category-menu/Curve-Coat-Rack-Shelf.png",
                href: "/collections/storages-cabinets"
            }
        ],
        "Dining & Kitchen": [
            {
                id: "tables-desks",
                name: "Tables & Desks",
                image: "/img/category-menu/Turn-Table-Mono.png",
                href: "/collections/tables-desks"
            },
            {
                id: "bow-chairs",
                name: "Bow Chairs",
                image: "/img/category-menu/Turn-chair-colorful.png",
                href: "/collections/bow-chairs"
            },
            {
                id: "cross-bar-chairs",
                name: "Cross Bar Chairs",
                image: "/img/category-menu/Cross-Table-dark_b9e51138-56b9-45fa-a3a6-89b1f918425a.png",
                href: "/collections/cross-bar-chairs"
            },
            {
                id: "storages-cabinets",
                name: "Storages & Cabinets",
                image: "/img/category-menu/Curve-Coat-Rack-Shelf.png",
                href: "/collections/storages-cabinets"
            }
        ],
        "Bed Room": [
            {
                id: "soft-bench",
                name: "Soft Bench",
                image: "/img/category-menu/Curve-Coat-Rack.png",
                href: "/collections/soft-bench"
            },
            {
                id: "storages-cabinets",
                name: "Storages & Cabinets",
                image: "/img/category-menu/Curve-Coat-Rack-Shelf.png",
                href: "/collections/storages-cabinets"
            },
            {
                id: "chairs-stools",
                name: "Chairs & Stools",
                image: "/img/category-menu/Arc-Chair-dark.png",
                href: "/collections/chairs-stools"
            },
            {
                id: "tables-desks",
                name: "Tables & Desks",
                image: "/img/category-menu/Turn-Table-Mono.png",
                href: "/collections/tables-desks"
            }
        ],
        "Work Room": [
            {
                id: "tables-desks",
                name: "Tables & Desks",
                image: "/img/category-menu/Turn-Table-Mono.png",
                href: "/collections/tables-desks"
            },
            {
                id: "chairs-stools",
                name: "Chairs & Stools",
                image: "/img/category-menu/Arc-Chair-dark.png",
                href: "/collections/chairs-stools"
            },
            {
                id: "storages-cabinets",
                name: "Storages & Cabinets",
                image: "/img/category-menu/Curve-Coat-Rack-Shelf.png",
                href: "/collections/storages-cabinets"
            },
            {
                id: "bow-chairs",
                name: "Bow Chairs",
                image: "/img/category-menu/Turn-chair-colorful.png",
                href: "/collections/bow-chairs"
            }
        ],
        "Outdoor": [
            {
                id: "soft-bench",
                name: "Soft Bench",
                image: "/img/category-menu/Curve-Coat-Rack.png",
                href: "/collections/soft-bench"
            },
            {
                id: "tables-desks",
                name: "Tables & Desks",
                image: "/img/category-menu/Turn-Table-Mono.png",
                href: "/collections/tables-desks"
            },
            {
                id: "chairs-stools",
                name: "Chairs & Stools",
                image: "/img/category-menu/Arc-Chair-dark.png",
                href: "/collections/chairs-stools"
            },
            {
                id: "cross-bar-chairs",
                name: "Cross Bar Chairs",
                image: "/img/category-menu/Cross-Table-dark_b9e51138-56b9-45fa-a3a6-89b1f918425a.png",
                href: "/collections/cross-bar-chairs"
            }
        ]
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

// NavItem5 Config - Pages (Nested Menu)
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
    // Nested menu data
    nestedMenuData: [
        {
            title: "Về chúng tôi",
            href: "/about",
            submenu: []
        },
        // {
        //     title: "Collections",
        //     href: "/collections",
        //     submenu: [
        //         { label: "Collections List", href: "/collections" },
        //         { label: "Left Banner", href: "/collections/left-banner" },
        //         { label: "Right Banner", href: "/collections/right-banner" },
        //         { label: "With Background", href: "/collections/with-background" },
        //         { label: "With Image Cards", href: "/collections/with-image-cards" },
        //         { label: "Without Banner", href: "/collections/without-banner" }
        //     ]
        // },
        // {
        //     title: "Product Gallery",
        //     href: "/product-gallery",
        //     submenu: [
        //         { label: "Product Grid", href: "/product-gallery/grid" },
        //         { label: "Product List", href: "/product-gallery/list" },
        //         { label: "Product Detail", href: "/product-gallery/detail" }
        //     ]
        // },
        // {
        //     title: "Customer Care",
        //     href: "/customer-care",
        //     submenu: []
        // },
        // {
        //     title: "FAQs",
        //     href: "/faq",
        //     submenu: []
        // },
        {
            title: "Liên hệ",
            href: "/contact",
            submenu: []
        },
        {
            title: "Tìm cửa hàng",
            href: "/find-store",
            submenu: []
        },
        {
            title: "Blog",
            href: "/blog",
            submenu: []
        }
    ],
    // recommendationPicture: {
    //     imageUrl: "https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100",
    //     imageAlt: "Company Information",
    //     title: "Support",
    //     subtitle: "We're Here to Help",
    //     href: "/contact",
    //     customStyles: {
    //         containerClass: "nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px] border-l-[1px] border-gray-300",
    //         imageClass: "rounded-md",
    //         titleClass: "mb-4 text-center text-xl",
    //         subtitleClass: "text-center text-3xl",
    //         overlayClass: "content-overlay"
    //     }
    // }
};

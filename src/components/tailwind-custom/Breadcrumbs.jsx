import React from "react";
import { Link, useLocation } from "react-router-dom";

const BreadcrumbsNameMap = {
    about: "About",
    contact: "Contact",
    faq: "FAQ",
    findastore: "Find a Store",
    profile: "Profile",
    products: "Products",
    admin: "Admin",
    category: "Category",
    product: "Product",
    order: "Order",
    analyticsReport: "Analytics Report",
    customer: "Customer",
    promotion: "Promotion",
};

const Breadcrumbs = () => {
    const location = useLocation();

    const pathnames = location.pathname.split("/").filter((x) => x);

    // Nếu đang ở trang home ("/") thì không render gì hết
    if (pathnames.length === 0) return null;

    return (
        <nav className="container-custom p-4 text-sm text-gray-500">
            <ul className="flex space-x-2">
                <li>
                    <Link
                        to="/"
                        className="font-bold text-black hover:underline"
                    >
                        Home
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = "/" + pathnames.slice(0, index + 1).join("/");
                    const isLast = index === pathnames.length - 1;

                    return (
                        <li
                            key={to}
                            className="flex items-center font-semibold"
                        >
                            <span className="mx-2">/</span>
                            {isLast ? (
                                <span className="text-gray-500">{BreadcrumbsNameMap[value] || decodeURIComponent(value)}</span>
                            ) : (
                                <Link
                                    to={to}
                                    className="font-bold text-black hover:underline"
                                >
                                    {BreadcrumbsNameMap[value] || decodeURIComponent(value)}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;

import React from "react";
import {
    // Main Page
    Home,
    About,
    PageNotFound,
    Contact,
    FindAStore,
    Products,
    ProductDetails,
    FAQ,
    Profile,
    Cart,
    // Admin Page
    Dashboard,
    CategoryManagement,
    ProductManagement,
    OrderManagement,
    DraftOrders,
    AnalyticsReport,
    CustomerManagement,
    PromotionManagement,
} from "../pages";
import { createBrowserRouter, RouterProvider, Outlet, redirect } from "react-router-dom";
import HomeLayout from "@/pages/layouts/HomeLayout";
import { isUserLoggedIn } from "@/api/api";
import AdminLayouts from "@/pages/layouts/AdminLayouts";

{
    /* -[Thiết lập url]------------------------------------ */
}
const router = createBrowserRouter([
    // [Router của HomePage]---------------------------
    {
        path: "/",
        element: <HomeLayout />,
        children: [
            // Home, About, PageNotFound, Contact,
            // FindAStore, Product, ProductDetails
            { index: true, element: <Home /> },
            { path: "about", element: <About /> },
            { path: "contact", element: <Contact /> },
            { path: "faq", element: <FAQ /> },
            { path: "findastore", element: <FindAStore /> },
            { path: "cart", element: <Cart /> },
            {
                path: "profile",
                element: <Profile />,
                loader: isUserLoggedIn,
            },
            {
                path: "products",
                loader: isUserLoggedIn,
                children: [
                    {
                        index: true,
                        element: <Products />, // Đây là trang danh sách sản phẩm
                    },
                    {
                        path: ":proid",
                        element: <ProductDetails />,
                    },
                ],
            },
            {
                path: "products/:proid",
                element: <ProductDetails />,
                loader: isUserLoggedIn,
            },
            // Không tìm thấy trang phù hợp
            { path: "*", element: <PageNotFound /> },
        ],
    },

    // [Router của Admin]------------------------------
    {
        path: "/admin",
        element: <AdminLayouts />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "category", element: <CategoryManagement /> },
            { path: "product", element: <ProductManagement /> },
            { path: "order", element: <OrderManagement /> },
            { path: "draft_orders", element: <DraftOrders/> },
            { path: "analyticsReport", element: <AnalyticsReport /> },
            { path: "customer", element: <CustomerManagement /> },
            { path: "promotion", element: <PromotionManagement /> },
            // Không tìm thấy trang phù hợp
            { path: "*", element: <PageNotFound /> },
        ],
    },
]);
{
    /* -[Thiết lập url - End]------------------------------ */
}

export default function RouterSetup() {
    return <RouterProvider router={router} />;
}

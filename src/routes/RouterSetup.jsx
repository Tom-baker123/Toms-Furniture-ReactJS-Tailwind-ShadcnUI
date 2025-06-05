import React, { useEffect, useState } from "react";
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
    ProductCollection,
    OrderManagement,
    DraftOrders,
    AnalyticsReport,
    CustomerManagement,
    PromotionManagement,
} from "../pages";
import { createBrowserRouter, RouterProvider, Outlet, redirect, useNavigate, Navigate } from "react-router-dom";
import HomeLayout from "@/pages/layouts/HomeLayout";
import AdminLayouts from "@/pages/layouts/AdminLayouts";
import { checkAuthStatus } from "@/api/api";

const AdminRoute = ({ children }) => {
    const [authStatus, setAuthStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthStatus = async () => {
            const result = await checkAuthStatus();
            setAuthStatus(result);
            if (!result.isAuthenticated || result.role !== "Admin") {
                navigate("/");
            }
        };
        fetchAuthStatus();
    }, [navigate]);

    if (!authStatus) return null;
    return authStatus.isAuthenticated && authStatus.role === "Admin" ? children : <Navigate to="/" />;
};

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
            },
            {
                path: "products",
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
            },
            // Không tìm thấy trang phù hợp
            { path: "*", element: <PageNotFound /> },
        ],
    },

    // [Router của Admin]------------------------------
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminLayouts />
            </AdminRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: "category", element: <CategoryManagement /> },
            { path: "products", element: <ProductManagement /> },
            {
                path: "product_collection",
                element: <ProductCollection />,
            },
            { path: "order", element: <OrderManagement /> },
            { path: "draft_orders", element: <DraftOrders /> },
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

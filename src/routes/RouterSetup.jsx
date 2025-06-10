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
import { checkAuthStatus, getAllCategories, getProductList } from "@/api/api";
import CategoryForm from "@/components/Admin/Form/CategoryForm";
import Payment from "@/pages/Payment";
import ProductForm from "@/components/Admin/Form/ProductForm";

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
            { path: "payment", element: <Payment /> },
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
            // [1.] Trang chủ admin
            { index: true, element: <Dashboard /> },
            // [2.] Trang sản phẩm
            {
                path: "products",
                children: [
                    {
                        index: true,
                        element: <ProductManagement />,
                        loader: async () => {
                            return await getProductList();
                        },
                    },
                    {
                        path: "New_Product",
                        element: <ProductForm />,
                    },
                ],
            },
            // [3.] Trang danh mục
            {
                path: "product_collection",
                children: [
                    {
                        index: true,
                        element: <ProductCollection />, // Đây là trang danh sách sản phẩm
                        loader: async () => {
                            return await getAllCategories();
                        },
                    },
                    {
                        path: "New_Collection",
                        element: <CategoryForm />,
                    },
                ],
            },
            // [4.]
            { path: "order", element: <OrderManagement /> },
            // [5.]
            // [6.]
            // [7.]
            // [8.]
            // [9.]
            // [10.]
            // [11.]
            // [12.]
            // [13.]
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

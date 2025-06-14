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
    AnalyticsReport,
    BrandManagement,
    CategoryManagement,
    CustomerManagement,
    Dashboard,
    DraftOrders,
    InventoryManagement,
    OrderManagement,
    ProductManagement,
    ProductCollection,
    PromotionManagement,
    CountryManagement,
    SupplierManagement, // Thêm mới
} from "../pages";
import { createBrowserRouter, RouterProvider, Outlet, redirect, useNavigate, Navigate } from "react-router-dom";
import HomeLayout from "@/pages/layouts/HomeLayout";
import AdminLayouts from "@/pages/layouts/AdminLayouts";
import {
    checkAuthStatus,
    getAllBrands,
    getAllCategories,
    getAllCountries,
    getAllSuppliers,
    getBrandById,
    getCountryById,
    getProductList,
    getSupplierById,
} from "@/api/api";
import CategoryForm from "@/components/Admin/Form/CategoryForm";
import Payment from "@/pages/Payment";
import ProductForm from "@/components/Admin/Form/ProductForm";
import BrandForm from "@/components/Admin/Form/BrandForm";
import CountryForm from "@/components/Admin/Form/CountryForm";
import SupplierForm from "@/components/Admin/Form/SupplierForm";

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
            { path: "inventory", element: <InventoryManagement />, loader: async () => await getProductList() },
            // [5.]
            { path: "materials", element: <OrderManagement /> },
            // [6.]
            { path: "units", element: <OrderManagement /> },
            // [7.]
            { path: "colors", element: <OrderManagement /> },
            // [8.]
            { path: "sizes", element: <OrderManagement /> },
            // [9.]
            {
                path: "suppliers",
                children: [
                    {
                        index: true,
                        element: <SupplierManagement />,
                        loader: async () => await getAllSuppliers(),
                    },
                    { path: "new_supplier", element: <SupplierForm /> },
                    {
                        path: "edit_supplier/:id",
                        element: <SupplierForm />,
                        loader: async ({ params }) => await getSupplierById(params.id),
                    },
                ],
            },

            // [10.] Trang thương hiệu
            {
                path: "brands",
                children: [
                    {
                        index: true,
                        element: <BrandManagement />,
                        loader: async () => {
                            return await getAllBrands();
                        },
                    },
                    { path: "new_brand", element: <BrandForm /> },
                    {
                        path: "edit_brand/:id",
                        element: <BrandForm />,
                        loader: async ({ params }) => await getBrandById(params.id),
                    },
                ],
            },
            // [11.] Xuất xứ
            {
                path: "countries",
                children: [
                    {
                        index: true,
                        element: <CountryManagement />,
                        loader: async () => await getAllCountries(),
                    },
                    { path: "new_country", element: <CountryForm /> },
                    {
                        path: "edit_country/:id",
                        element: <CountryForm />,
                        loader: async ({ params }) => await getCountryById(params.id),
                    },
                ],
            },
            // [12.]
            { path: "order", element: <OrderManagement /> },
            // [13.]
            { path: "draft_orders", element: <DraftOrders /> },
            // [14.]
            { path: "analyticsReport", element: <AnalyticsReport /> },
            // [15.]
            { path: "customer", element: <CustomerManagement /> },
            // [16.]
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
    return (
        <RouterProvider
            router={router}
            hydrateFallback={<div>Loading...</div>}
        />
    );
}

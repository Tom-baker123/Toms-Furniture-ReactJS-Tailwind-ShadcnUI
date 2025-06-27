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
    SizeManagement, // Thêm mới
    ColorManagement,
    MaterialManagement,
    UnitManagement, // Thêm mới
    UserManagement,
    PromotionTypeManagement,
    WebsiteManagement,
} from "../pages";
import { createBrowserRouter, RouterProvider, Outlet, redirect, useNavigate, Navigate } from "react-router-dom";
import HomeLayout from "@/pages/layouts/HomeLayout";
import AdminLayouts from "@/pages/layouts/AdminLayouts";
import {
    checkAuthStatus,
    getAllBrands,
    getAllCategories,
    getAllColors,
    getAllCountries,
    getAllMaterials,
    getAllSizes,
    getAllSuppliers,
    getAllUnits,
    getBrandById,
    getCategoryById,
    getColorById,
    getCountryById,
    getMaterialById,
    getProductById,
    getAllProducts,
    getSizeById,
    getSupplierById,
    getUnitById,
    getAllUsers, // Thêm import
    getUserById,
    getAllPromotions,
    getPromotionById, // Thêm import
    getAllPromotionTypes, // Thêm import
    getPromotionTypeById, // Thêm import
} from "@/api/api";
import CategoryForm from "@/components/Admin/Form/CategoryForm";
import Payment from "@/pages/Payment";
import ProductForm from "@/components/Admin/Form/ProductForm";
import BrandForm from "@/components/Admin/Form/BrandForm";
import CountryForm from "@/components/Admin/Form/CountryForm";
import SupplierForm from "@/components/Admin/Form/SupplierForm";
import SizeForm from "@/components/Admin/Form/SizeForm";
import ColorForm from "@/components/Admin/Form/ColorForm";
import MaterialForm from "@/components/Admin/Form/MaterialForm";
import UnitForm from "@/components/Admin/Form/UnitForm";
import UserForm from "@/components/Admin/Form/UserForm";
import PromotionForm from "@/components/Admin/Form/PromotionForm";
import PromotionTypeForm from "@/components/Admin/Form/PromotionTypeForm";
import { storeInformationLoader } from "@/components/Admin/Form/StoreInformationForm";

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
                        loader: async () => await getAllProducts(),
                    },
                    {
                        path: "New_Product",
                        element: <ProductForm />,
                    },
                    {
                        path: "Edit_Product/:id",
                        element: <ProductForm />,
                        loader: async ({ params }) => await getProductById(params.id),
                    },
                ],
            },
            // [3.] Trang danh mục
            {
                path: "categories",
                children: [
                    {
                        index: true,
                        element: <CategoryManagement />,
                        loader: async () => await getAllCategories(), // Loader để lấy danh sách danh mục
                    },
                    {
                        path: "New_Collection",
                        element: <CategoryForm />, // Form thêm danh mục
                    },
                    {
                        path: "Edit_Collection/:id",
                        element: <CategoryForm />, // Form sửa danh mục
                        loader: async ({ params }) => await getCategoryById(params.id), // Loader để lấy dữ liệu danh mục theo ID
                    },
                ],
            },
            // [4.]
            { path: "inventory", element: <InventoryManagement />, loader: async () => await getAllProducts() },
            // [5.] Vật liệu
            {
                path: "materials",
                children: [
                    {
                        index: true,
                        element: <MaterialManagement />,
                        loader: async () => await getAllMaterials(),
                    },
                    { path: "new_material", element: <MaterialForm /> },
                    {
                        path: "edit_material/:id",
                        element: <MaterialForm />,
                        loader: async ({ params }) => await getMaterialById(params.id),
                    },
                ],
            },
            // [6.] Đơn vị
            {
                path: "units",
                children: [
                    {
                        index: true,
                        element: <UnitManagement />,
                        loader: async () => await getAllUnits(),
                    },
                    { path: "new_unit", element: <UnitForm /> },
                    {
                        path: "edit_unit/:id",
                        element: <UnitForm />,
                        loader: async ({ params }) => await getUnitById(params.id),
                    },
                ],
            },
            // [7.] Màu sắc
            {
                path: "colors",
                children: [
                    {
                        index: true,
                        element: <ColorManagement />,
                        loader: async () => await getAllColors(),
                    },
                    { path: "new_color", element: <ColorForm /> },
                    {
                        path: "edit_color/:id",
                        element: <ColorForm />,
                        loader: async ({ params }) => await getColorById(params.id),
                    },
                ],
            },
            // [8.] Kích thước
            {
                path: "sizes", // Cập nhật route cho Size
                children: [
                    {
                        index: true,
                        element: <SizeManagement />,
                        loader: async () => await getAllSizes(),
                    },
                    { path: "new_size", element: <SizeForm /> },
                    {
                        path: "edit_size/:id",
                        element: <SizeForm />,
                        loader: async ({ params }) => await getSizeById(params.id),
                    },
                ],
            },
            // [9.] Nhà cung cấp
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
            // [15.] Tài khoản
            {
                path: "users",
                children: [
                    {
                        index: true,
                        element: <UserManagement />,
                        loader: async () => await getAllUsers(),
                    },
                    {
                        path: "New_User",
                        element: <UserForm />,
                    },
                    {
                        path: "Edit_User/:id",
                        element: <UserForm />,
                        loader: async ({ params }) => await getUserById(params.id),
                    },
                ],
            },
            // [16.] Giảm giá
            {
                path: "promotions",
                children: [
                    {
                        index: true,
                        element: <PromotionManagement />,
                        loader: async () => await getAllPromotions(),
                    },
                    { path: "new_promotion", element: <PromotionForm /> },
                    {
                        path: "edit_promotion/:id",
                        element: <PromotionForm />,
                        loader: async ({ params }) => await getPromotionById(params.id),
                    },
                ],
            },
            // [17.] Loại giảm giá
            {
                path: "promotiontypes",
                children: [
                    {
                        index: true,
                        element: <PromotionTypeManagement />,
                        loader: async () => await getAllPromotionTypes(),
                    },
                    { path: "new_promotiontype", element: <PromotionTypeForm /> },
                    {
                        path: "edit_promotiontype/:id",
                        element: <PromotionTypeForm />,
                        loader: async ({ params }) => await getPromotionTypeById(params.id),
                    },
                ],
            },
            // [18.] Thông tin cửa hàng
            {
                path: "store_information",
                children: [
                    {
                        index: true,
                        element: <WebsiteManagement />,
                        loader: storeInformationLoader,
                    },
                ],
            },

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

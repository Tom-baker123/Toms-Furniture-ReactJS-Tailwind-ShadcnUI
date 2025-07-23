import React, { useContext } from "react";
import showHeader from "../hooks/showHeader";
import Topbar from "./Header-Components/Topbar";
import SearchHeader from "./Header-Components/SearchHeader";
import Navbar from "./Header-Components/Navbar";
import { useModal } from "@/context/ModalContext";
import AuthSwitcher from "./Home/AuthComponents/AuthSwitcher";
import isSticky from "@/hooks/isSticky";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DropdownCT from "./tailwind-custom/DropdownCT";
import { CartIconSvgCT, FindLocationSvgCT, UserIconSvgCT } from "@/assets/SVG/svg";
import { useCart } from "@/context/CartContext";
import { APIContext } from "@/context/APIContext";

const Header = ({ onOpenCartModal }) => {
    const { openModal } = useModal(); // Gọi hàm modal
    const { authStatus, handleLogout } = useAuth(); // Kiểm tra trạng thái
    const { storeInformation, loading, error } = useContext(APIContext); // Lấy thông tin cửa hàng

    const showHead = showHeader();
    // [1.] Xử lý scroll xuống và scroll lên đầu
    const isScroll = isSticky();

    // [2.] Xử lý modal cho Authentication Button
    const handleOpenAuthModal = () => {
        openModal(<AuthSwitcher />, { className: "max-w-md" });
    };

    const { cart } = useCart();
    // Tính tổng số lượng sản phẩm trong giỏ hàng
    const cartCount = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
    return (
        <>
            {/* -[TOPBAR]-------------------------------------------------------------------------- */}
            <Topbar />
            {/* -[TOPBAR - END]-------------------------------------------------------------------- */}

            {/* -[HEADER]-------------------------------------------------------------------------- */}
            <header
                className={cn(
                    `sticky top-0 z-50 border-b-[0.5px] border-gray-300 bg-white transition-all duration-500`,
                    showHead ? "translate-y-0" : "-translate-y-full !shadow-none",
                    isScroll && "shadow-lg",
                )}
            >
                {/* Trên Desktop */}
                <div className="mx-auto grid grid-cols-[1fr_1fr] gap-2 px-3 pt-5 pb-3 max-md:grid-cols-[1fr_1.5fr] lg:grid-cols-[auto_auto_1fr] 2xl:max-w-7xl">
                    {/* Hambergur Menu & Main Logo  */}
                    <div className="flex flex-wrap items-center">
                        {/* Hambergur Menu CÓ RESPONSIVE */}
                        <button className="mr-2 lg:hidden">
                            <span>
                                <img
                                    className="w-7"
                                    src="../src/assets/sub-icon/burger-bar.png"
                                    alt=""
                                />
                            </span>
                        </button>
                        {/* Main Logo CÓ RESPONSIVE */}
                        <a
                            href="/"
                            className="relative flex w-full items-center gap-2 whitespace-nowrap"
                        >
                            <img
                                className="flex w-5 sm:w-5 lg:w-12 xl:w-9"
                                src={storeInformation?.logo || "/img/main-logo/T-Logo.png"}
                                alt=""
                            />
                            <span className="font-bold md:text-xl lg:hidden xl:block xl:text-xl">
                                {storeInformation?.storeName || "Tom's Furniture"}
                            </span>
                        </a>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="hidden md:px-5 lg:block lg:w-[44rem] xl:px-10">
                        <SearchHeader />
                    </div>

                    {/* Thanh Nav gồm: giỏ hàng, Login/ Register, Find a store*/}
                    <div className="w-full">
                        <div className="flex h-full items-center justify-end gap-4">
                            <button className="flex cursor-pointer gap-x-1 whitespace-nowrap">
                                <FindLocationSvgCT />
                                <p className="hidden max-xl:hidden min-sm:block min-lg:hidden xl:block">Tìm cửa hàng{/* Find a store */}</p>
                            </button>

                            {/* Login / Register */}
                            {authStatus.isAuthenticated ? (
                                <DropdownCT>
                                    <li className="cursor-pointer px-4 py-1.5 hover:bg-gray-100">
                                        <span className="text-sm font-semibold whitespace-nowrap">
                                            👋Hello <span className="text-primary font-bold whitespace-nowrap">{authStatus.userName}</span>
                                        </span>
                                    </li>
                                    <hr className="border-gray-300" />
                                    <li
                                        id="profile"
                                        className="cursor-pointer px-4 py-1 hover:bg-gray-100"
                                    >
                                        <Link
                                            to="/profile"
                                            className="hover:text-gray-600"
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    {authStatus.role === "Admin" && (
                                        <li
                                            id="profile"
                                            className="cursor-pointer px-4 py-1 hover:bg-gray-100"
                                        >
                                            <a
                                                href="/admin"
                                                target="_blank"
                                                className="hover:text-gray-600"
                                            >
                                                Admin
                                            </a>
                                        </li>
                                    )}

                                    <li
                                        className="cursor-pointer px-4 py-1 font-bold text-red-500 hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        <button className="hover:text-red-700">Logout</button>
                                    </li>
                                </DropdownCT>
                            ) : (
                                <button
                                    onClick={handleOpenAuthModal}
                                    className="flex cursor-pointer gap-x-1 whitespace-nowrap"
                                >
                                    <UserIconSvgCT />
                                    <p className="hidden max-xl:hidden min-sm:block min-lg:hidden xl:block">Đăng nhập/Đăng ký{/* Sign in/ Register */}</p>
                                </button>
                            )}

                            {/* Cart Icon */}
                            <button
                                onClick={onOpenCartModal}
                                className="relative cursor-pointer sm:rounded-full sm:bg-gray-200 sm:p-3"
                            >
                                <CartIconSvgCT />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 z-10 flex h-7 min-h-3 w-7 min-w-3 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white shadow-lg">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trên Mobile: Thanh tìm kiếm */}
                <div className="mx-auto w-full px-4 pt-2 pb-4 lg:hidden">
                    <SearchHeader id="categories-mobile" />
                </div>

                {/* Thanh Nav Menu */}
                <Navbar />
            </header>
            {/* -[HEADER - END]-------------------------------------------------------------------- */}

            {/* -[Product  END]-------------------------------------------------------------------- */}
        </>
    );
};

export default Header;

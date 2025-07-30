import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/Header-Components/ScrollToTop";
import CartModal from "@/components/Home/CartModal";
import ModalTemplate from "@/components/ModalTemplate";
import Breadcrumbs from "@/components/tailwind-custom/Breadcrumbs";
import ChatBotAi from "@/components/AI/Chatbot/ChatBotAi";
import { APIProvider } from "@/context/APIContext";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { GHNProvider } from "@/context/GHNContext";
import { PaymentMethodProvider } from "@/context/PaymentMethodContext";

const HomeLayout = () => {
    const [openCartModal, setOpenCartModal] = useState(false);

    return (
        <ModalProvider>
            <AuthProvider>
                <APIProvider>
                    <CartProvider>
                        <PaymentProvider>
                            <GHNProvider>
                                <PaymentMethodProvider>
                                    {/* 0. Thiết lập Scroll to top */}
                                    <ScrollToTop />
                                    {/* 1. Thiết lập header */}
                                    <Header onOpenCartModal={() => setOpenCartModal(true)} />
                                    {/* 1.1 Cart Modal */}
                                    <CartModal
                                        open={openCartModal}
                                        onClose={() => setOpenCartModal(false)}
                                    />
                                    <Breadcrumbs />
                                    <Outlet /> {/* 2. Thiết lập OUTLET */}
                                    <Footer /> {/* 3. Thiết lập footer */}
                                    {/* 4. Thiết lập ChatBot AI */}
                                    <ChatBotAi />
                                    <Toaster toastOptions={{ duration: 10000 }} /> {/* 5. Thiết lập thông báo Hot Toast Mặc định */}
                                    <ModalTemplate />
                                </PaymentMethodProvider>
                            </GHNProvider>
                        </PaymentProvider>
                    </CartProvider>
                </APIProvider>
            </AuthProvider>
        </ModalProvider>
    );
};

export default HomeLayout;

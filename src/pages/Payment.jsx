import React from "react";
import PaymentFormSection from "../components/Home/Payment/PaymentFormSection";
import PaymentSidebar from "../components/Home/Payment/PaymentSidebar";
import { useGHN } from "../context/GHNContext";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../context/PaymentContext";
import { useCart } from "../context/CartContext";
import usePaymentLogic from "../hooks/usePaymentLogic";

const Payment = () => {
    // Get contexts
    const ghn = useGHN();
    const auth = useAuth();
    const payment = usePayment();
    const cart = useCart();

    // Use payment logic hook
    const paymentLogic = usePaymentLogic({
        ghn,
        auth,
        payment,
        cart,
    });

    // Destructure needed values from logic hook
    const {
        user,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        customerInfo,
        userAddressForm,
        paymentMethod,
        setPaymentMethod,
        validationErrors,
        imageErrors,
        orderError,
        discountAmount,
        subtotal,
        total,
        provinces,
        districts,
        wards,
        shippingFee,
        ghnError,
        addresses,
        loading,
        cart: cartData,
        cartLoading,
        authStatus,
        handleSaveAddress,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        handleCustomerInfoChange,
        handleUserAddressFormChange,
        handleImageError,
        handlePlaceOrder,
        // Promotion props
        promotionList,
        selectedPromotion,
        setSelectedPromotion,
        promotionLoading,
        promotionError,
    } = paymentLogic;

    // Promotion props object for OrderSummary
    const promotionProps = {
        promotionList,
        selectedPromotion,
        setSelectedPromotion,
        promotionLoading,
        promotionError,
    };

    return (
        <div className="container-custom lg:px-10 lg:py-5">
            <h1 className="mb-6 text-2xl font-bold">Trang Thanh Toán</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Phần thông tin đặt hàng */}
                <PaymentFormSection
                    authStatus={authStatus}
                    user={user}
                    addresses={addresses}
                    customerInfo={customerInfo}
                    userAddressForm={userAddressForm}
                    validationErrors={validationErrors}
                    loading={loading}
                    handleSaveAddress={handleSaveAddress}
                    handleCustomerInfoChange={handleCustomerInfoChange}
                    handleUserAddressFormChange={handleUserAddressFormChange}
                    provinces={provinces}
                    districts={districts}
                    wards={wards}
                    selectedProvince={selectedProvince}
                    selectedDistrict={selectedDistrict}
                    selectedWard={selectedWard}
                    handleProvinceChange={handleProvinceChange}
                    handleDistrictChange={handleDistrictChange}
                    handleWardChange={handleWardChange}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />

                {/* Phần tổng kết đơn hàng */}
                <PaymentSidebar
                    cartData={cartData}
                    cartLoading={cartLoading}
                    imageErrors={imageErrors}
                    handleImageError={handleImageError}
                    subtotal={subtotal}
                    shippingFee={shippingFee}
                    discountAmount={discountAmount}
                    total={total}
                    promotionProps={promotionProps}
                    orderError={orderError}
                    ghnError={ghnError}
                    onPlaceOrder={handlePlaceOrder}
                />
            </div>
        </div>
    );
};

export default Payment;

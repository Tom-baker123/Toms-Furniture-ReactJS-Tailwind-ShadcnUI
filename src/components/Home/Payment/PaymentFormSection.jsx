import React from "react";
import UserguestForm from "./UserguestForm";
import ShippingAddressForm from "./ShippingAddressForm";
import SelectPaymentMethodForm from "./SelectPaymentMethodForm";
import UserInfoForm from "./UserInfoForm";

const PaymentFormSection = ({
    authStatus,
    user,
    addresses,
    customerInfo,
    userAddressForm,
    validationErrors,
    loading,
    handleSaveAddress,
    handleCustomerInfoChange,
    handleUserAddressFormChange,
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    paymentMethod,
    setPaymentMethod,
}) => {
    return (
        <div className="space-y-6">
            {/* Thông tin khách hàng */}
            {authStatus?.isAuthenticated ? (
                <UserInfoForm
                    user={user}
                    address={addresses && addresses.length > 0 ? addresses[0] : {}}
                    onSave={handleSaveAddress}
                    onFormChange={handleUserAddressFormChange}
                    validationErrors={validationErrors}
                    loading={loading}
                    disabled={addresses && addresses.length > 0}
                />
            ) : (
                <UserguestForm
                    customerInfo={customerInfo}
                    validationErrors={validationErrors}
                    handleCustomerInfoChange={handleCustomerInfoChange}
                />
            )}

            <ShippingAddressForm
                provinces={provinces}
                districts={districts}
                wards={wards}
                selectedProvince={selectedProvince}
                selectedDistrict={selectedDistrict}
                selectedWard={selectedWard}
                validationErrors={validationErrors}
                handleProvinceChange={handleProvinceChange}
                handleDistrictChange={handleDistrictChange}
                handleWardChange={handleWardChange}
                isAddressLocked={addresses && addresses.length > 0}
            />

            <SelectPaymentMethodForm
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                validationErrors={validationErrors}
            />
        </div>
    );
};

export default PaymentFormSection;

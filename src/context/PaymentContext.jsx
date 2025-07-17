import React, { createContext, useContext, useState } from "react";
import {
    getOrderAddresses,
    getOrderAddressById,
    createOrderAddress,
    updateOrderAddress,
    deleteOrderAddress,
} from "../api/service/OrderAddressService";
import useApiFetch from "../hooks/useApiFetch";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sử dụng useApiFetch cho các hàm gọi API
    const fetchData = useApiFetch(setLoading, setError, (data) => data);

    // Lấy danh sách địa chỉ
    const fetchAddresses = async (userId) => {
        const result = await fetchData(getOrderAddresses, "addresses", userId, (res) => res);
        setAddresses(Array.isArray(result) ? result : []);
        return result;
    };

    // Lấy chi tiết địa chỉ
    const fetchAddressById = async (id) => {
        const result = await fetchData(getOrderAddressById, "selectedAddress", id, (res) => res);
        setSelectedAddress(result);
        return result;
    };

    // Tạo mới địa chỉ
    const addAddress = async (addressData) => {
        const result = await fetchData(createOrderAddress, "addAddress", addressData, (res) => res);
        return result;
    };

    // Cập nhật địa chỉ
    const updateAddress = async (addressData) => {
        const result = await fetchData(updateOrderAddress, "updateAddress", addressData, (res) => res);
        return result;
    };

    // Xóa địa chỉ
    const removeAddress = async (id) => {
        const result = await fetchData(deleteOrderAddress, "removeAddress", id, (res) => res);
        return result;
    };

    return (
        <PaymentContext.Provider
            value={{
                addresses,
                selectedAddress,
                loading,
                error,
                fetchAddresses,
                fetchAddressById,
                addAddress,
                updateAddress,
                removeAddress,
                setAddresses,
                setSelectedAddress,
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);

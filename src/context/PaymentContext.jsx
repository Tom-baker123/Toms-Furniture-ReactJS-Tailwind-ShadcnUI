import React, { createContext, useContext, useState } from "react";
import {
    getOrderAddresses,
    getOrderAddressById,
    createOrderAddress,
    updateOrderAddress,
    deleteOrderAddress,
} from "../api/service/OrderAddressService";

import {
    processOrderPayment,
    getOrderById,
    getOrdersByUser,
    getAllOrders,
    createVnpayPaymentUrl,
    vnpayCallback,
} from "../api/service/PaymentService";
import useApiFetch from "../hooks/useApiFetch";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sử dụng useApiFetch cho các hàm gọi API
    const fetchData = useApiFetch(setLoading, setError, (data) => data);

    // Lấy danh sách địa chỉ, có thể lọc theo isDeafaultAddress
    const fetchAddresses = async (userId, isDeafaultAddress) => {
        const result = await fetchData(getOrderAddresses, "addresses", userId, isDeafaultAddress, (res) => res);
        setAddresses(Array.isArray(result) ? result : []);
        return result;
    };

    // Lấy chi tiết địa chỉ
    const fetchAddressById = async (id) => {
        const result = await fetchData(getOrderAddressById, "selectedAddress", id, (res) => res);
        setSelectedAddress(result);
        return result;
    };

    // Tạo mới địa chỉ: chỉ truyền city, district, ward là tên
    const addAddress = async (addressData) => {
        const payload = {
            ...addressData,
            city: addressData.city,
            district: addressData.district,
            ward: addressData.ward,
        };
        const result = await fetchData(createOrderAddress, "addAddress", payload, (res) => res);
        return result;
    };

    // Cập nhật địa chỉ: chỉ truyền city, district, ward là tên
    const updateAddress = async (addressData) => {
        const payload = {
            ...addressData,
            city: addressData.city,
            district: addressData.district,
            ward: addressData.ward,
        };
        const result = await fetchData(updateOrderAddress, "updateAddress", payload, (res) => res);
        return result;
    };

    // Xóa địa chỉ
    const removeAddress = async (id) => {
        const result = await fetchData(deleteOrderAddress, "removeAddress", id, (res) => res);
        return result;
    };

    // ================== API ĐƠN HÀNG & THANH TOÁN ==================
    // Gọi thanh toán đơn hàng
    const handleOrderPayment = async (orderData) => {
        return processOrderPayment(orderData);
    };

    // Lấy đơn hàng theo ID
    const fetchOrderById = async (orderId) => {
        return getOrderById(orderId);
    };

    // Lấy danh sách đơn hàng theo user
    const fetchOrdersByUser = async (userId) => {
        return getOrdersByUser(userId);
    };

    // Lấy tất cả đơn hàng (admin)
    const fetchAllOrders = async () => {
        return getAllOrders();
    };

    // Tạo URL thanh toán VNPAY
    const getVnpayPaymentUrl = async (orderId) => {
        return createVnpayPaymentUrl(orderId);
    };

    // Xử lý callback VNPAY (nếu cần)
    const handleVnpayCallback = async (queryParams) => {
        // Đảm bảo truyền đúng query string (không parse sang object)
        return vnpayCallback(queryParams);
    };

    // ----------------------------------------------------------------------------------------------------------------

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
                // Thêm các hàm API đơn hàng/thanh toán
                handleOrderPayment,
                fetchOrderById,
                fetchOrdersByUser,
                fetchAllOrders,
                getVnpayPaymentUrl,
                handleVnpayCallback,
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);

import React, { createContext, useContext, useState } from "react";
import {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
} from "../api/service/PaymentMethodService";
import useApiFetch from "../hooks/useApiFetch";

const PaymentMethodContext = createContext();

export const PaymentMethodProvider = ({ children }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sử dụng useApiFetch cho các hàm gọi API
    const fetchData = useApiFetch(setLoading, setError, (data) => data);

    // Lấy danh sách phương thức thanh toán
    const fetchPaymentMethods = async () => {
        const result = await fetchData(getPaymentMethods, "paymentMethods", undefined, (res) => res);
        setPaymentMethods(Array.isArray(result) ? result : []);
        return result;
    };

    // Lấy chi tiết phương thức thanh toán
    const fetchPaymentMethodById = async (id) => {
        const result = await fetchData(getPaymentMethodById, "selectedPaymentMethod", id, (res) => res);
        setSelectedPaymentMethod(result);
        return result;
    };

    // Tạo mới phương thức thanh toán
    const addPaymentMethod = async (paymentMethodData) => {
        const result = await fetchData(createPaymentMethod, "addPaymentMethod", paymentMethodData, (res) => res);
        return result;
    };

    // Cập nhật phương thức thanh toán
    const updatePaymentMethodData = async (paymentMethodData) => {
        const result = await fetchData(updatePaymentMethod, "updatePaymentMethod", paymentMethodData, (res) => res);
        return result;
    };

    // Xóa phương thức thanh toán
    const removePaymentMethod = async (id) => {
        const result = await fetchData(deletePaymentMethod, "removePaymentMethod", id, (res) => res);
        return result;
    };

    return (
        <PaymentMethodContext.Provider
            value={{
                paymentMethods,
                selectedPaymentMethod,
                loading,
                error,
                fetchPaymentMethods,
                fetchPaymentMethodById,
                addPaymentMethod,
                updatePaymentMethodData,
                removePaymentMethod,
                setPaymentMethods,
                setSelectedPaymentMethod,
            }}
        >
            {children}
        </PaymentMethodContext.Provider>
    );
};

export const usePaymentMethod = () => useContext(PaymentMethodContext);

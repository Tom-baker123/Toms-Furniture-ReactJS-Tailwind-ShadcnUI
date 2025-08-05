import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
    getOrderById,
    getOrdersByUser,
    getAllOrders,
    updateOrderStatus,
    getAllOrderStatuses,
    getOrderStatusById,
    cancelOrder,
} from "../api/service/PaymentService";
import useApiFetch from "../hooks/useApiFetch";

const APIOrderContext = createContext();

export const APIOrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderStatuses, setOrderStatuses] = useState([]); // Thêm state để lưu danh sách trạng thái
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sử dụng useApiFetch để quản lý các cuộc gọi API
    const fetchData = useApiFetch(setLoading, setError, (data) => data);

    // Xử lý thanh toán đơn hàng
    const handleOrderPayment = async (orderData) => {
        const result = await fetchData(processOrderPayment, "processOrderPayment", orderData, (res) => res);
        return result;
    };

    // Lấy thông tin đơn hàng theo ID
    const fetchOrderById = async (orderId) => {
        const result = await fetchData(getOrderById, "fetchOrderById", orderId, (res) => res);
        setSelectedOrder(result);
        return result;
    };

    // Lấy danh sách đơn hàng theo user
    const fetchOrdersByUser = async (userId) => {
        const result = await fetchData(getOrdersByUser, "fetchOrdersByUser", userId, (res) => res);
        setOrders(Array.isArray(result) ? result : []);
        return result;
    };

    // Lấy tất cả đơn hàng (dành cho admin)
    const fetchAllOrders = async () => {
        const result = await fetchData(getAllOrders, "fetchAllOrders", null, (res) => res);
        setOrders(Array.isArray(result) ? result : []);
        return result;
    };

    // Lấy tất cả trạng thái đơn hàng
    const fetchAllOrderStatuses = async () => {
        const result = await fetchData(getAllOrderStatuses, "fetchAllOrderStatuses", null, (res) => res);
        setOrderStatuses(Array.isArray(result) ? result : []);
        return result;
    };

    // Lấy trạng thái đơn hàng theo ID
    const fetchOrderStatusById = async (id) => {
        return await fetchData(getOrderStatusById, "fetchOrderStatusById", id, (res) => res);
    };

    // Cập nhật trạng thái đơn hàng
    const handleUpdateOrderStatus = async (orderId, newStatusId) => {
        // Đảm bảo truyền đúng tham số cho updateOrderStatus (orderId, newStatusId là primitive)
        const result = await fetchData(
            ({ orderId, newStatusId }) => updateOrderStatus(orderId, newStatusId),
            "updateOrderStatus",
            { orderId, newStatusId },
            (res) => res,
        );
        if (result && orders.length > 0) {
            setOrders(
                orders.map((order) =>
                    order.id === orderId
                        ? {
                              ...order,
                              orderStaId: newStatusId,
                              orderStatusName: orderStatuses.find((status) => status.id === newStatusId)?.orderStatusName || result.orderStatusName,
                          }
                        : order,
                ),
            );
        }
        return result;
    };

    // Hủy đơn hàng
    const handleCancelOrder = async (orderId) => {
        const result = await fetchData(cancelOrder, "cancelOrder", orderId, (res) => res);
        if (result && orders.length > 0) {
            // Cập nhật trạng thái đơn hàng trong danh sách sau khi hủy thành công
            setOrders(
                orders.map((order) =>
                    order.id === orderId
                        ? {
                              ...order,
                              isActive: false, // Đặt isActive = false khi hủy đơn
                          }
                        : order,
                ),
            );
        }
        return result;
    };

    return (
        <APIOrderContext.Provider
            value={{
                orders,
                selectedOrder,
                orderStatuses, // Thêm orderStatuses vào context
                loading,
                error,
                setOrders,
                setSelectedOrder,
                handleOrderPayment,
                fetchOrderById,
                fetchOrdersByUser,
                fetchAllOrders,
                fetchAllOrderStatuses,
                fetchOrderStatusById,
                handleUpdateOrderStatus,
                handleCancelOrder,
            }}
        >
            {children}
        </APIOrderContext.Provider>
    );
};

export const useAPIOrder = () => useContext(APIOrderContext);

import { getAllOrders, getOrderById } from "@/api/service/PaymentService";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BarChartTemplate = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState("");
    const [chartData, setChartData] = useState([]);

    // Fetch all orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                setOrders(response);
                if (response.length > 0) {
                    setSelectedOrderId(response[0].id); // Set default to first order
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    // Fetch order details when selectedOrderId changes
    useEffect(() => {
        if (selectedOrderId) {
            const fetchOrderDetails = async () => {
                try {
                    const order = await getOrderById(selectedOrderId);
                    // Transform order details into chart data with fallback for null values
                    const data = order.orderDetails.map((detail) => ({
                        name: (() => {
                            const attrs = [];
                            if (detail.productVariant.colorName) attrs.push(detail.productVariant.colorName);
                            if (detail.productVariant.sizeName) attrs.push(detail.productVariant.sizeName);
                            if (detail.productVariant.materialName) attrs.push(detail.productVariant.materialName);
                            return attrs.length > 0 ? `Variant ${detail.proVarId} (${attrs.join(", ")})` : `Variant ${detail.proVarId}`;
                        })(),
                        quantity: detail.quantity,
                    }));
                    setChartData(data);
                } catch (error) {
                    console.error("Error fetching order details:", error);
                }
            };
            fetchOrderDetails();
        }
    }, [selectedOrderId]);

    // Handle dropdown change
    const handleOrderChange = (event) => {
        setSelectedOrderId(event.target.value);
    };

    return (
        <div className="card">
            <div className="mx-auto">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Order Variant Quantity Chart</h2>

                {/* Dropdown for selecting orders */}
                <div className="mb-6">
                    <label
                        htmlFor="orderSelect"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Select Order
                    </label>
                    <select
                        id="orderSelect"
                        value={selectedOrderId}
                        onChange={handleOrderChange}
                        className="block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        {orders.map((order) => (
                            <option
                                key={order.id}
                                value={order.id}
                            >
                                Order #{order.id} - {order.orderStatusName} ({new Date(order.createdDate).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bar Chart */}
                <div className="rounded-lg bg-white p-4">
                    <ResponsiveContainer
                        width="100%"
                        height={400}
                    >
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={100}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis label={{ value: "Quantity", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend
                                verticalAlign="top"
                                height={36}
                            />
                            <Bar
                                dataKey="quantity"
                                fill="#3b82f6"
                                name="Quantity Sold"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default BarChartTemplate;

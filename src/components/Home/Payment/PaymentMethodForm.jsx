import React from "react";

const PaymentMethodForm = ({ paymentMethod, setPaymentMethod }) => {
    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Phương thức thanh toán</h2>
            <div className="space-y-3">
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                    />
                    <label
                        htmlFor="cod"
                        className="ml-2 text-sm font-medium"
                    >
                        Thanh toán khi nhận hàng (COD)
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="bank"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                    />
                    <label
                        htmlFor="bank"
                        className="ml-2 text-sm font-medium"
                    >
                        Chuyển khoản ngân hàng
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="momo"
                        name="paymentMethod"
                        value="momo"
                        checked={paymentMethod === "momo"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                    />
                    <label
                        htmlFor="momo"
                        className="ml-2 text-sm font-medium"
                    >
                        Ví MoMo
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodForm;

import React, { useEffect } from "react";
import { usePaymentMethod } from "../../../context/PaymentMethodContext";

const SelectPaymentMethodForm = ({ paymentMethod, setPaymentMethod }) => {
    const { paymentMethods, fetchPaymentMethods, loading, error } = usePaymentMethod();

    useEffect(() => {
        fetchPaymentMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Phương thức thanh toán</h2>
            <div className="space-y-3">
                {loading && <div>Đang tải phương thức thanh toán...</div>}
                {error && <div className="text-sm text-red-500">{error}</div>}
                {!loading && !error && paymentMethods && paymentMethods.length > 0
                    ? paymentMethods.map((method) => (
                          <div
                              className="flex items-center"
                              key={method.id}
                          >
                              <input
                                  type="radio"
                                  id={method.id}
                                  name="paymentMethod"
                                  value={method.id}
                                  checked={paymentMethod === String(method.id)}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                  className="h-4 w-4 text-blue-600"
                              />
                              <label
                                  htmlFor={method.id}
                                  className="ml-2 text-sm font-medium"
                              >
                                  {method.namePaymentMethod}
                              </label>
                          </div>
                      ))
                    : null}
            </div>
        </div>
    );
};

export default SelectPaymentMethodForm;

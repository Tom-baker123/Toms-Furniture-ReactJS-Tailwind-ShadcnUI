import React from "react";
import { normalizePhoneNumber } from "@/utils/phoneUtils";

const UserguestForm = ({ customerInfo, validationErrors, handleCustomerInfoChange }) => {
    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Thông tin khách vãng lai</h2>
            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Họ và tên *</label>
                    <input
                        type="text"
                        name="fullName"
                        value={customerInfo.fullName}
                        onChange={handleCustomerInfoChange}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.fullName ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Nhập họ và tên"
                    />
                    {validationErrors.fullName && <span className="text-sm text-red-500">{validationErrors.fullName}</span>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Số điện thoại *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={(e) => {
                            // Chuẩn hóa số điện thoại khi người dùng nhập
                            const normalized = normalizePhoneNumber(e.target.value);
                            const syntheticEvent = {
                                target: {
                                    name: e.target.name,
                                    value: normalized,
                                },
                            };
                            handleCustomerInfoChange(syntheticEvent);
                        }}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.phone ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Nhập số điện thoại (VD: 0901234567, +84901234567)"
                    />
                    {validationErrors.phone && <span className="text-sm text-red-500">{validationErrors.phone}</span>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.email ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Nhập email"
                    />
                    {validationErrors.email && <span className="text-sm text-red-500">{validationErrors.email}</span>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Địa chỉ cụ thể *</label>
                    <input
                        type="text"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleCustomerInfoChange}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.address ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Số nhà, tên đường..."
                    />
                    {validationErrors.address && <span className="text-sm text-red-500">{validationErrors.address}</span>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Ghi chú</label>
                    <textarea
                        name="note"
                        value={customerInfo.note}
                        onChange={handleCustomerInfoChange}
                        className="w-full rounded border border-gray-300 px-3 py-2"
                        rows="3"
                        placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    />
                </div>
            </div>
        </div>
    );
};

export default UserguestForm;

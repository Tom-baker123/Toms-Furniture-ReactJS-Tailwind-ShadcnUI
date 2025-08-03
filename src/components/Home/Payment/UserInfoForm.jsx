import React, { useState, useEffect } from "react";
import { normalizePhoneNumber } from "@/utils/phoneUtils";

const UserInfoForm = ({ user, address, onSave, validationErrors = {}, loading = false, disabled = false, onFormChange }) => {
    const [form, setForm] = useState({
        recipient: user?.userName || "",
        phoneNumber: user?.phoneNumber || "",
        addressDetailRecipient: user?.userAddress || address?.addressDetailRecipient || "",
        isDefaultAddress: address?.isDefaultAddress ?? true,
    });

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            recipient: user?.userName || "",
            phoneNumber: user?.phoneNumber || "",
            addressDetailRecipient: user?.userAddress || address?.addressDetailRecipient || "",
        }));
    }, [user, address]);

    // Gọi onFormChange khi form được khởi tạo hoặc cập nhật
    useEffect(() => {
        if (onFormChange) {
            onFormChange(form);
        }
    }, [form, onFormChange]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let processedValue = value;

        // Chuẩn hóa số điện thoại khi nhập
        if (name === "phoneNumber") {
            processedValue = normalizePhoneNumber(value);
        }

        setForm((prev) => {
            const newForm = {
                ...prev,
                [name]: type === "checkbox" ? checked : processedValue,
            };

            // Gọi callback để parent component biết form đã thay đổi
            if (onFormChange) {
                onFormChange(newForm);
            }

            return newForm;
        });
    };

    // Không submit form ở đây nữa, chỉ trả về form và setForm cho parent
    // Nút lưu địa chỉ sẽ bị ẩn, parent sẽ lấy form qua ref hoặc prop

    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Thông tin giao hàng</h2>
            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Họ và tên *</label>
                    <input
                        type="text"
                        name="recipient"
                        value={form.recipient}
                        onChange={handleChange}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.recipient ? "border-red-500" : "border-gray-300"} ${loading || disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
                        placeholder="Nhập họ và tên"
                        disabled={loading || disabled}
                    />
                    {validationErrors.recipient && <span className="text-sm text-red-500">{validationErrors.recipient}</span>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Số điện thoại *</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.phoneNumber ? "border-red-500" : "border-gray-300"} ${loading || disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
                        placeholder="Nhập số điện thoại (VD: 0901234567, +84901234567)"
                        disabled={loading || disabled}
                    />
                    {validationErrors.phoneNumber && <span className="text-sm text-red-500">{validationErrors.phoneNumber}</span>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Địa chỉ cụ thể *</label>
                    <input
                        type="text"
                        name="addressDetailRecipient"
                        value={form.addressDetailRecipient}
                        onChange={handleChange}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.addressDetailRecipient ? "border-red-500" : "border-gray-300"} ${loading || disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
                        placeholder="Số nhà, tên đường..."
                        disabled={loading || disabled}
                    />
                    {validationErrors.addressDetailRecipient && (
                        <span className="text-sm text-red-500">{validationErrors.addressDetailRecipient}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInfoForm;

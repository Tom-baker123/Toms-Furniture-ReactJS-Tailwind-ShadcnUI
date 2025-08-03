import React, { useState, useEffect, useCallback } from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { Edit3, Save, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useApiFetch from "@/hooks/useApiFetch";
import { getUserById } from "@/api/api";
import { normalizePhoneNumber, validatePhoneNumber } from "@/utils/phoneUtils";

const ProfileInfoTab = ({ isEditing, handleEdit, handleSubmit, register, errors, reset, setIsEditing }) => {
    const { authStatus, handleUpdateProfile } = useAuth();
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchData = useApiFetch(setLoading, setError, setUserDetail);

    // Hàm lấy user và reset form
    const fetchUserAndReset = useCallback(async () => {
        if (authStatus && authStatus.userId) {
            try {
                const user = await fetchData(getUserById, "userDetail", authStatus.userId, (res) => res.user || res);
                setUserDetail(user); // Đảm bảo userDetail luôn cập nhật
                reset({
                    name: user.userName || "",
                    email: user.email || "",
                    phone: user.phoneNumber || "",
                    address: user.userAddress || "",
                });
            } catch {
                setUserDetail(null);
            }
        }
    }, [authStatus, fetchData, reset]);

    useEffect(() => {
        fetchUserAndReset();
    }, [fetchUserAndReset]);

    // Hàm xử lý submit cập nhật thông tin
    const handleProfileSubmit = async (data) => {
        let roleId = userDetail?.roleName === "Admin" ? 1 : 2;

        // Chuẩn hóa số điện thoại trước khi gửi
        const phoneNumber = data.phone ? normalizePhoneNumber(data.phone) : null;

        const success = await handleUpdateProfile({
            UserName: data.name,
            Email: data.email,
            PhoneNumber: phoneNumber,
            UserAddress: data.address,
            RoleId: roleId,
        });
        if (success) {
            setIsEditing(false);
            await fetchUserAndReset();
        }
    };

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">Thông tin cá nhân</h2>
                <ButtonHovCT
                    onClick={handleEdit}
                    bgColor={isEditing ? "bg-red-500" : "bg-black"}
                    hoverBgColor={isEditing ? "bg-red-600" : "bg-white"}
                    textColor="text-white"
                    hoverTextColor={isEditing ? "text-white" : "text-black"}
                >
                    <div className="flex items-center space-x-2">
                        {isEditing ? (
                            <>
                                <X className="h-4 w-4" />
                                <span>Hủy</span>
                            </>
                        ) : (
                            <>
                                <Edit3 className="h-4 w-4" />
                                <span>Chỉnh sửa</span>
                            </>
                        )}
                    </div>
                </ButtonHovCT>
            </div>

            {loading && <div className="text-blue-500">Đang tải thông tin người dùng...</div>}
            {error && <div className="text-red-500">{error}</div>}

            <form
                onSubmit={handleSubmit(handleProfileSubmit)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input
                            {...register("name", { required: "Tên là bắt buộc" })}
                            disabled={!isEditing}
                            className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
                                isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "border-gray-200 bg-gray-50"
                            }`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Địa chỉ Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email là bắt buộc" })}
                            disabled={!isEditing}
                            className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
                                isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "border-gray-200 bg-gray-50"
                            }`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                            {...register("phone", {
                                validate: (value) => {
                                    if (!value) return true; // Cho phép để trống
                                    const error = validatePhoneNumber(value);
                                    return error ? error : true;
                                },
                            })}
                            disabled={!isEditing}
                            placeholder="VD: 0901234567"
                            onChange={(e) => {
                                if (isEditing) {
                                    // Chuẩn hóa số điện thoại khi người dùng nhập
                                    const normalized = normalizePhoneNumber(e.target.value);
                                    e.target.value = normalized;
                                }
                            }}
                            className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
                                isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "border-gray-200 bg-gray-50"
                            }`}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                            {...register("address", { required: "Địa chỉ là bắt buộc" })}
                            disabled={!isEditing}
                            className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
                                isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "border-gray-200 bg-gray-50"
                            }`}
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                    </div>
                </div>
                {isEditing && (
                    <div className="flex justify-end space-x-4">
                        <ButtonHovCT
                            type="button"
                            onClick={() => setIsEditing(false)}
                            bgColor="bg-gray-100"
                            hoverBgColor="bg-gray-200"
                            textColor="text-gray-700"
                            hoverTextColor="text-gray-900"
                            border={false}
                        >
                            Hủy
                        </ButtonHovCT>
                        <ButtonHovCT
                            type="submit"
                            bgColor="bg-black"
                            hoverBgColor="bg-gray-800"
                            textColor="text-white"
                            hoverTextColor="text-white"
                            border={false}
                        >
                            <div className="flex items-center space-x-2">
                                <Save className="h-4 w-4" />
                                <span>Lưu thay đổi</span>
                            </div>
                        </ButtonHovCT>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProfileInfoTab;

import React, { useState } from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { Eye, EyeOff } from "lucide-react";

const ProfileSecurityTab = ({ showPassword, setShowPassword, handlePasswordSubmit, onPasswordSubmit, registerPassword, passwordErrors }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await handlePasswordSubmit(onPasswordSubmit)(e);
        setIsLoading(false);
    };
    return (
        <div>
            <h2 className="mb-3 text-2xl font-bold text-black">Đặt lại mật khẩu</h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...registerPassword("currentPassword", { required: "Mật khẩu hiện tại là bắt buộc" })}
                            className="w-full rounded-full border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword.message}</p>}
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <input
                        type="password"
                        {...registerPassword("newPassword", { required: "Mật khẩu mới là bắt buộc" })}
                        className="w-full rounded-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>}
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        {...registerPassword("confirmPassword", { required: "Vui lòng xác nhận mật khẩu của bạn" })}
                        className="w-full rounded-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>}
                </div>
                <div className="flex justify-end">
                    <ButtonHovCT
                        type="submit"
                        bgColor="bg-black"
                        hoverBgColor="bg-gray-800"
                        textColor="text-white"
                        hoverTextColor="text-white"
                        border={false}
                    >
                        {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                    </ButtonHovCT>
                </div>
            </form>
        </div>
    );
};

export default ProfileSecurityTab;

import React from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { Eye, EyeOff } from "lucide-react";

const ProfileSecurityTab = ({ showPassword, setShowPassword, handlePasswordSubmit, onPasswordSubmit, registerPassword, passwordErrors }) => (
    <div>
        <h2 className="mb-3 text-2xl font-bold text-black">Security Settings</h2>
        <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-6"
        >
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        {...registerPassword("currentPassword", { required: "Current password is required" })}
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
                <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    {...registerPassword("newPassword", { required: "New password is required" })}
                    className="w-full rounded-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                    type="password"
                    {...registerPassword("confirmPassword", { required: "Please confirm your password" })}
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
                    Update Password
                </ButtonHovCT>
            </div>
        </form>
    </div>
);

export default ProfileSecurityTab;

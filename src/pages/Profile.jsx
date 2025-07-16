import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Settings, ShoppingBag, MapPin, Edit3, Save, X, Eye, EyeOff, Package } from "lucide-react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: "John Doe",
            email: "john@example.com",
            phone: "0123456789",
            address: "123 Main St, City",
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm();

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Settings },
        { id: "orders", label: "Orders", icon: ShoppingBag },
        { id: "addresses", label: "Addresses", icon: MapPin },
    ];

    const onSubmit = (data) => {
        console.log("Profile data:", data);
        setIsEditing(false);
    };

    const onPasswordSubmit = (data) => {
        console.log("Password data:", data);
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            reset();
        }
    };

    return (
        <div className="container-custom py-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 rounded-md bg-white">
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? "border border-black bg-black text-white"
                                                : "border border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div>
                                <div className="mb-8 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-black">Profile Information</h2>
                                    <ButtonHovCT
                                        onClick={handleEdit}
                                        bgColor={isEditing ? "bg-red-500" : "bg-black"}
                                        hoverBgColor={isEditing ? "bg-red-600" : "bg-gray-800"}
                                        textColor="text-white"
                                        hoverTextColor="text-white"
                                        border={false}
                                    >
                                        <div className="flex items-center space-x-2">
                                            {isEditing ? (
                                                <>
                                                    <X className="h-4 w-4" />
                                                    <span>Cancel</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Edit3 className="h-4 w-4" />
                                                    <span>Edit</span>
                                                </>
                                            )}
                                        </div>
                                    </ButtonHovCT>
                                </div>

                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                {...register("name", { required: "Name is required" })}
                                                disabled={!isEditing}
                                                className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                                                    isEditing
                                                        ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                        : "border-gray-200 bg-gray-50"
                                                }`}
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                                            <input
                                                type="email"
                                                {...register("email", { required: "Email is required" })}
                                                disabled={!isEditing}
                                                className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                                                    isEditing
                                                        ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                        : "border-gray-200 bg-gray-50"
                                                }`}
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                                            <input
                                                {...register("phone", { required: "Phone is required" })}
                                                disabled={!isEditing}
                                                className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                                                    isEditing
                                                        ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                        : "border-gray-200 bg-gray-50"
                                                }`}
                                            />
                                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                {...register("address", { required: "Address is required" })}
                                                disabled={!isEditing}
                                                className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                                                    isEditing
                                                        ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                        : "border-gray-200 bg-gray-50"
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
                                                Cancel
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
                                                    <span>Save Changes</span>
                                                </div>
                                            </ButtonHovCT>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div>
                                <h2 className="mb-8 text-xl font-semibold text-gray-900">Security Settings</h2>
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
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {passwordErrors.currentPassword && (
                                            <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                                        <input
                                            type="password"
                                            {...registerPassword("newPassword", { required: "New password is required" })}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        />
                                        {passwordErrors.newPassword && (
                                            <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Confirm New Password</label>
                                        <input
                                            type="password"
                                            {...registerPassword("confirmPassword", { required: "Please confirm your password" })}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                                        )}
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
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div>
                                <h2 className="mb-8 text-xl font-semibold text-gray-900">Order History</h2>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((order) => (
                                        <div
                                            key={order}
                                            className="rounded-xl border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                                        <Package className="h-6 w-6 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Order #00{order}</h3>
                                                        <p className="text-sm text-gray-500">Placed on Jan {order}0, 2024</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">$299.99</p>
                                                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
                                                        Delivered
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="border-t pt-4">
                                                <p className="text-gray-600">2 items • Modern Chair, Coffee Table</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === "addresses" && (
                            <div>
                                <h2 className="mb-8 text-xl font-semibold text-gray-900">Saved Addresses</h2>
                                <div className="space-y-4">
                                    {["Home", "Office", "Parent's House"].map((address, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="flex items-center font-semibold text-gray-900">
                                                        <MapPin className="mr-2 h-4 w-4 text-gray-600" />
                                                        {address}
                                                        {index === 0 && (
                                                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                                                                Default
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="mt-1 text-gray-500">123 Main St, City, State 12345</p>
                                                </div>
                                                <ButtonHovCT
                                                    bgColor="bg-gray-100"
                                                    hoverBgColor="bg-gray-200"
                                                    textColor="text-gray-700"
                                                    hoverTextColor="text-gray-900"
                                                    border={false}
                                                >
                                                    Edit
                                                </ButtonHovCT>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

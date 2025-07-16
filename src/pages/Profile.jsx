import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Settings, ShoppingBag, MapPin, Edit3, Save, X, Eye, EyeOff, Package, Plus } from "lucide-react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import AddressModal from "@/components/Home/AddressModal";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([
        {
            id: 1,
            label: "Home",
            fullName: "John Doe",
            phone: "0123456789",
            address: "123 Main St, Apartment 4B",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            isDefault: true,
        },
        {
            id: 2,
            label: "Office",
            fullName: "John Doe",
            phone: "0123456789",
            address: "456 Business Ave, Suite 200",
            city: "New York",
            state: "NY",
            zipCode: "10002",
            isDefault: false,
        },
        {
            id: 3,
            label: "Parent's House",
            fullName: "John Doe",
            phone: "0123456789",
            address: "789 Family Street",
            city: "Brooklyn",
            state: "NY",
            zipCode: "11201",
            isDefault: false,
        },
    ]);

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

    const handleSaveAddress = (addressData) => {
        if (editingAddress) {
            // Cập nhật địa chỉ có sẵn
            setSavedAddresses((prev) => prev.map((addr) => (addr.id === editingAddress.id ? { ...addr, ...addressData } : addr)));
            setEditingAddress(null);
        } else {
            // Thêm địa chỉ mới
            const newAddress = {
                id: Date.now(),
                ...addressData,
            };
            setSavedAddresses((prev) => [...prev, newAddress]);
        }
        setShowAddressModal(false);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setShowAddressModal(true);
    };

    const handleDeleteAddress = (id) => {
        setSavedAddresses((prev) => prev.filter((addr) => addr.id !== id));
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
                                <div className="mb-3 flex items-center justify-between">
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
                                                className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
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
                                                className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
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
                                                className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
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
                                                className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
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
                                        {passwordErrors.currentPassword && (
                                            <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                                        <input
                                            type="password"
                                            {...registerPassword("newPassword", { required: "New password is required" })}
                                            className="w-full rounded-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                                            className="w-full rounded-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                                <h2 className="mb-3 text-2xl font-bold text-black">Order History</h2>
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
                                <div className="mb-8 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-black">Saved Addresses</h2>
                                    <ButtonHovCT
                                        onClick={() => {
                                            setEditingAddress(null);
                                            setShowAddressModal(true);
                                        }}
                                        bgColor="bg-black"
                                        hoverBgColor="bg-gray-800"
                                        textColor="text-white"
                                        hoverTextColor="text-white"
                                        border={false}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Plus className="h-4 w-4" />
                                            <span>Add New Address</span>
                                        </div>
                                    </ButtonHovCT>
                                </div>
                                <div className="space-y-4">
                                    {savedAddresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className="rounded-xl border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="flex items-center font-semibold text-gray-900">
                                                        <MapPin className="mr-2 h-4 w-4 text-gray-600" />
                                                        {address.label}
                                                        {address.isDefault && (
                                                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                                                                Default
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="font-medium text-gray-900">{address.fullName}</p>
                                                        <p className="text-gray-600">{address.phone}</p>
                                                        <p className="text-gray-600">{address.address}</p>
                                                        <p className="text-gray-600">
                                                            {address.city}, {address.state} {address.zipCode}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <ButtonHovCT
                                                        onClick={() => handleEditAddress(address)}
                                                        bgColor="bg-gray-100"
                                                        hoverBgColor="bg-gray-200"
                                                        textColor="text-gray-700"
                                                        hoverTextColor="text-gray-900"
                                                        border={false}
                                                        className="!px-3 !py-2"
                                                    >
                                                        Edit
                                                    </ButtonHovCT>
                                                    <ButtonHovCT
                                                        onClick={() => handleDeleteAddress(address.id)}
                                                        bgColor="bg-red-100"
                                                        hoverBgColor="bg-red-200"
                                                        textColor="text-red-700"
                                                        hoverTextColor="text-red-900"
                                                        border={false}
                                                        className="!px-3 !py-2"
                                                    >
                                                        Delete
                                                    </ButtonHovCT>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Address Modal */}
                                <AddressModal
                                    open={showAddressModal}
                                    onClose={() => {
                                        setShowAddressModal(false);
                                        setEditingAddress(null);
                                    }}
                                    onSave={handleSaveAddress}
                                    editingAddress={editingAddress}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

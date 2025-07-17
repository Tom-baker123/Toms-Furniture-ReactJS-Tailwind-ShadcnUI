import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { User, Settings, ShoppingBag, MapPin, Edit3, Save, X, Eye, EyeOff, Package, Plus } from "lucide-react";
import ProfileSidebar from "../components/Home/Profile/ProfileSidebar";
import ProfileInfoTab from "../components/Home/Profile/ProfileInfoTab";
import ProfileSecurityTab from "../components/Home/Profile/ProfileSecurityTab";
import ProfileOrdersTab from "../components/Home/Profile/ProfileOrdersTab";
import ProfileAddressesTab from "../components/Home/Profile/ProfileAddressesTab";

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

    const { handleUpdatePassword } = useAuth();

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
        // Gọi hàm cập nhật mật khẩu từ AuthContext
        handleUpdatePassword(data.currentPassword, data.newPassword, data.confirmPassword);
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
                    <ProfileSidebar
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <ProfileInfoTab
                                isEditing={isEditing}
                                handleEdit={handleEdit}
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                register={register}
                                errors={errors}
                                reset={reset}
                                setIsEditing={setIsEditing}
                            />
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <ProfileSecurityTab
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                handlePasswordSubmit={handlePasswordSubmit}
                                onPasswordSubmit={onPasswordSubmit}
                                registerPassword={registerPassword}
                                passwordErrors={passwordErrors}
                            />
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && <ProfileOrdersTab />}

                        {/* Addresses Tab */}
                        {activeTab === "addresses" && (
                            <ProfileAddressesTab
                                savedAddresses={savedAddresses}
                                handleEditAddress={handleEditAddress}
                                handleDeleteAddress={handleDeleteAddress}
                                showAddressModal={showAddressModal}
                                setShowAddressModal={setShowAddressModal}
                                setEditingAddress={setEditingAddress}
                                handleSaveAddress={handleSaveAddress}
                                editingAddress={editingAddress}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

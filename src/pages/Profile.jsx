import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../context/PaymentContext";
import { useForm } from "react-hook-form";
import { User, Settings, ShoppingBag, MapPin, Edit3, Save, X, Eye, EyeOff, Package, Plus } from "lucide-react";
import ProfileSidebar from "../components/Home/Profile/ProfileSidebar";
import ProfileInfoTab from "../components/Home/Profile/ProfileInfoTab";
import ProfileSecurityTab from "../components/Home/Profile/ProfileSecurityTab";
import ProfileOrdersTab from "../components/Home/Profile/ProfileOrdersTab";
import ProfileAddressesTab from "../components/Home/Profile/ProfileAddressesTab";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const { addresses, fetchAddresses, addAddress, updateAddress, removeAddress, loading } = usePayment();

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
        { id: "profile", label: "Thông Tin Cá Nhân", icon: User },
        { id: "security", label: "Bảo Mật", icon: Settings },
        { id: "orders", label: "Đơn Hàng", icon: ShoppingBag },
        { id: "addresses", label: "Sổ Địa Chỉ", icon: MapPin },
    ];

    // Lấy tab từ URL
    const getActiveTab = () => {
        const match = location.pathname.match(/\/profile\/?(\w+)?/);
        return match && match[1] ? match[1] : "profile";
    };
    const activeTab = getActiveTab();

    // Khi click tab, chuyển router
    const handleTabClick = (tabId) => {
        navigate(tabId === "profile" ? "/profile" : `/profile/${tabId}`);
    };

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

    const handleSaveAddress = async (addressData) => {
        try {
            let result;
            if (editingAddress) {
                result = await updateAddress({ ...editingAddress, ...addressData });
                if (result && result.success === false) {
                    toast.error(result.message || "Cập nhật địa chỉ thất bại!");
                    return;
                } else {
                    toast.success("Cập nhật địa chỉ thành công!");
                }
            } else {
                result = await addAddress(addressData);
                if (result && result.success === false) {
                    toast.error(result.message || "Thêm địa chỉ thất bại!");
                    return;
                } else {
                    toast.success("Thêm địa chỉ thành công!");
                }
            }
            setEditingAddress(null);
            setShowAddressModal(false);
            fetchAddresses();
        } catch (error) {
            const errorMessage = error?.message || "Có lỗi xảy ra khi lưu địa chỉ!";
            toast.error(errorMessage);
            console.error("Error saving address:", error);
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setShowAddressModal(true);
    };

    const handleDeleteAddress = async (id) => {
        try {
            const result = await removeAddress(id);
            if (result && result.success === false) {
                // Hiển thị thông báo lỗi cụ thể từ API
                toast.error(result.message || "Xóa địa chỉ thất bại!");
            } else {
                toast.success("Xóa địa chỉ thành công!");
                fetchAddresses();
            }
        } catch (error) {
            // Xử lý lỗi từ network hoặc lỗi khác
            const errorMessage = error?.message || "Có lỗi xảy ra khi xóa địa chỉ!";
            toast.error(errorMessage);
            console.error("Error deleting address:", error);
        }
    };

    useEffect(() => {
        if (activeTab === "addresses") {
            fetchAddresses();
        }
    }, [activeTab]);

    return (
        <div className="container-custom py-3">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <ProfileSidebar
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={handleTabClick}
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
                                savedAddresses={addresses}
                                handleEditAddress={handleEditAddress}
                                handleDeleteAddress={handleDeleteAddress}
                                showAddressModal={showAddressModal}
                                setShowAddressModal={setShowAddressModal}
                                setEditingAddress={setEditingAddress}
                                handleSaveAddress={handleSaveAddress}
                                editingAddress={editingAddress}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

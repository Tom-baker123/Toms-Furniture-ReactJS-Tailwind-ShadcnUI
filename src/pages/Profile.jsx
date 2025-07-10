import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Edit, Save, X, Lock, Eye, EyeOff, ShoppingBag, Settings, LogOut, Calendar, CreditCard } from "lucide-react";

const Profile = () => {
    const { authStatus, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userProfile, setUserProfile] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        userAddress: "",
        gender: "",
        joinDate: "",
        avatar: "",
    });
    const [orderHistory, setOrderHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPassword,
        watch: watchPassword,
    } = useForm();

    // Redirect if not authenticated
    useEffect(() => {
        if (!authStatus.isAuthenticated) {
            navigate("/");
            return;
        }

        // Load user profile data
        loadUserProfile();
        loadOrderHistory();
    }, [authStatus, navigate]);

    const loadUserProfile = async () => {
        try {
            // Simulate API call to get user profile
            setUserProfile({
                userName: authStatus.userName || "John Doe",
                email: authStatus.email || "john@example.com",
                phoneNumber: "0123456789",
                userAddress: "123 Main St, City, Country",
                gender: "male",
                joinDate: "2024-01-15",
                avatar: "https://github.com/shadcn.png",
            });
            setIsLoading(false);
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error("Failed to load profile data");
            setIsLoading(false);
        }
    };

    const loadOrderHistory = async () => {
        try {
            // Simulate API call to get order history
            setOrderHistory([
                {
                    id: "ORD001",
                    date: "2024-01-15",
                    total: 1299.99,
                    status: "delivered",
                    items: [
                        { name: "Modern Sofa", price: 899.99, quantity: 1 },
                        { name: "Coffee Table", price: 399.99, quantity: 1 },
                    ],
                },
                {
                    id: "ORD002",
                    date: "2024-01-10",
                    total: 599.99,
                    status: "processing",
                    items: [{ name: "Dining Chair", price: 199.99, quantity: 3 }],
                },
            ]);
        } catch (error) {
            console.error("Error loading order history:", error);
            toast.error("Failed to load order history");
        }
    };

    const onSubmitProfile = async (data) => {
        try {
            // Simulate API call to update profile
            setUserProfile((prev) => ({ ...prev, ...data }));
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const onSubmitPassword = async (data) => {
        try {
            // Simulate API call to change password
            toast.success("Password changed successfully");
            resetPassword();
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("Failed to change password");
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setIsEditing(false);
            reset(userProfile);
        } else {
            setIsEditing(true);
            reset(userProfile);
        }
    };

    const handleLogoutClick = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            handleLogout();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "text-green-600 bg-green-50";
            case "processing":
                return "text-yellow-600 bg-yellow-50";
            case "cancelled":
                return "text-red-600 bg-red-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={userProfile.avatar}
                                    alt={userProfile.userName}
                                />
                                <AvatarFallback className="text-lg">
                                    {userProfile.userName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{userProfile.userName}</h1>
                                <p className="text-gray-500">{userProfile.email}</p>
                                <p className="text-sm text-gray-400">Member since {formatDate(userProfile.joinDate)}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleLogoutClick}
                            className="flex items-center space-x-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                                        activeTab === "profile" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <User className="h-5 w-5" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                                        activeTab === "security" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <Lock className="h-5 w-5" />
                                    <span>Security</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                                        activeTab === "orders" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    <span>Order History</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                    <Button
                                        variant="outline"
                                        onClick={handleEditToggle}
                                        className="flex items-center space-x-2"
                                    >
                                        {isEditing ? (
                                            <>
                                                <X className="h-4 w-4" />
                                                <span>Cancel</span>
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="h-4 w-4" />
                                                <span>Edit</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <form
                                    onSubmit={handleSubmit(onSubmitProfile)}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="userName">Full Name</Label>
                                            <Input
                                                id="userName"
                                                type="text"
                                                disabled={!isEditing}
                                                {...register("userName", {
                                                    required: "Full name is required",
                                                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                                                })}
                                                defaultValue={userProfile.userName}
                                                className="mt-1"
                                            />
                                            {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                disabled={!isEditing}
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: "Invalid email address",
                                                    },
                                                })}
                                                defaultValue={userProfile.email}
                                                className="mt-1"
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                type="tel"
                                                disabled={!isEditing}
                                                {...register("phoneNumber", {
                                                    required: "Phone number is required",
                                                    pattern: {
                                                        value: /^[0-9]{10}$/,
                                                        message: "Invalid phone number",
                                                    },
                                                })}
                                                defaultValue={userProfile.phoneNumber}
                                                className="mt-1"
                                            />
                                            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="gender">Gender</Label>
                                            <select
                                                id="gender"
                                                disabled={!isEditing}
                                                {...register("gender", { required: "Gender is required" })}
                                                defaultValue={userProfile.gender}
                                                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="userAddress">Address</Label>
                                        <Input
                                            id="userAddress"
                                            type="text"
                                            disabled={!isEditing}
                                            {...register("userAddress", {
                                                required: "Address is required",
                                                minLength: { value: 10, message: "Address must be at least 10 characters" },
                                            })}
                                            defaultValue={userProfile.userAddress}
                                            className="mt-1"
                                        />
                                        {errors.userAddress && <p className="mt-1 text-sm text-red-600">{errors.userAddress.message}</p>}
                                    </div>

                                    {isEditing && (
                                        <div className="flex justify-end space-x-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleEditToggle}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex items-center space-x-2"
                                            >
                                                <Save className="h-4 w-4" />
                                                <span>Save Changes</span>
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-xl font-semibold text-gray-900">Security Settings</h2>

                                <form
                                    onSubmit={handlePasswordSubmit(onSubmitPassword)}
                                    className="space-y-6"
                                >
                                    <div>
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <div className="relative mt-1">
                                            <Input
                                                id="currentPassword"
                                                type={showPassword ? "text" : "password"}
                                                {...registerPassword("currentPassword", {
                                                    required: "Current password is required",
                                                })}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordErrors.currentPassword && (
                                            <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            {...registerPassword("newPassword", {
                                                required: "New password is required",
                                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                                            })}
                                            className="mt-1"
                                        />
                                        {passwordErrors.newPassword && (
                                            <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <div className="relative mt-1">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                {...registerPassword("confirmPassword", {
                                                    required: "Please confirm your password",
                                                    validate: (value) => value === watchPassword("newPassword") || "Passwords do not match",
                                                })}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordErrors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            className="flex items-center space-x-2"
                                        >
                                            <Lock className="h-4 w-4" />
                                            <span>Change Password</span>
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-xl font-semibold text-gray-900">Order History</h2>

                                {orderHistory.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                        <p className="text-gray-500">No orders found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orderHistory.map((order) => (
                                            <div
                                                key={order.id}
                                                className="rounded-lg border p-6"
                                            >
                                                <div className="mb-4 flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">Order #{order.id}</p>
                                                            <p className="flex items-center text-sm text-gray-500">
                                                                <Calendar className="mr-1 h-4 w-4" />
                                                                {formatDate(order.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                                                        >
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Separator className="my-4" />

                                                <div className="space-y-3">
                                                    {order.items.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                                                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                            <p className="font-medium text-gray-900">{formatCurrency(item.price)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

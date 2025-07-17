// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    checkAuthStatus,
    login,
    logout,
    register,
    forgotPassword,
    verifyOtp,
    resendOtp,
    resetPassword,
    updatePassword,
} from "@/api/service/AuthService";
import toast from "react-hot-toast";
import { VerifyOtpForm } from "@/components/Home/AuthComponents/VerifyOtpForm";
import ResetPasswordForm from "@/components/Home/Form/ResetPasswordForm";
import { useModal } from "./ModalContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Khởi tạo trạng thái xác thực
    const [authStatus, setAuthStatus] = useState({ isAuthenticated: false });
    const [currentForm, setCurrentForm] = useState("login");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { openModal, closeModal } = useModal();

    // Kiểm tra trạng thái đăng nhập khi component mount
    useEffect(() => {
        const fetchAuthStatus = async () => {
            const result = await checkAuthStatus();
            setAuthStatus(result);
        };
        fetchAuthStatus();
    }, []);

    // Hàm chuyển đổi form
    const switchForm = (form) => {
        setCurrentForm(form);
    };

    // Hàm xử lý đăng nhập
    const handleLogin = async (data) => {
        // Gửi yêu cầu đăng nhập
        const result = await login(data.email, data.password);
        console.log(result.message);
        if (result?.message === "Login successful.") {
            // Hiển thị thông báo thành công
            toast.success(result.message);
            // Cập nhật trạng thái xác thực
            const authStatus = await checkAuthStatus();
            setAuthStatus(authStatus);
            // Điều hướng dựa trên vai trò
            if (authStatus.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
            closeModal();
            window.location.reload();
        } else {
            // Hiển thị thông báo lỗi
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý đăng ký
    const handleRegister = async (data) => {
        // Gửi yêu cầu đăng ký
        const result = await register({
            userName: data.userName,
            email: data.email,
            password: data.password,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
            userAddress: data.userAddress,
        });
        if (result.success) {
            // Hiển thị thông báo thành công
            toast.success(result.message);
            setEmail(data.email);
            // Mở form xác thực OTP
            openModal(<VerifyOtpForm email={data.email} />, { className: "max-w-md" });
        } else {
            // Hiển thị thông báo lỗi
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý quên mật khẩu
    const handleForgotPassword = async (data) => {
        // Gửi yêu cầu quên mật khẩu
        const result = await forgotPassword(data.email);
        if (result?.success) {
            // Hiển thị thông báo thành công
            toast.success(result.message);
            setEmail(data.email);
            // Mở form xác thực OTP cho quên mật khẩu
            openModal(
                <VerifyOtpForm
                    email={data.email}
                    context="forgot-password"
                />,
                { className: "max-w-md" },
            );
        } else {
            // Hiển thị thông báo lỗi
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý xác minh OTP
    const handleVerifyOtp = async (email, otp, context) => {
        // Gửi yêu cầu xác thực OTP
        const result = await verifyOtp(email, otp);
        if (result.success) {
            // Hiển thị thông báo thành công
            toast.success(result.message);
            if (context === "forgot-password") {
                // Mở form đặt lại mật khẩu
                openModal(<ResetPasswordForm email={email} />, { className: "max-w-md" });
            } else {
                closeModal();
                window.location.reload();
            }
        } else {
            // Hiển thị thông báo lỗi
            toast.error(result.message);
        }
        return result;
    };

    // Hàm gửi lại OTP
    const handleResendOtp = async (email) => {
        // Gửi yêu cầu gửi lại OTP
        const result = await resendOtp(email);
        if (result.success) {
            // Hiển thị thông báo thành công
            toast.success(result.message);
        } else {
            // Hiển thị thông báo lỗi
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý đặt lại mật khẩu
    const handleResetPassword = async (email, newPassword) => {
        // Gửi yêu cầu đặt lại mật khẩu
        const result = await resetPassword(email, newPassword);
        if (result.success) {
            // Hiển thị thông báo thành công
            toast.success(result.message);
            closeModal();
            setCurrentForm("login");
        } else {
            // Hiển thị thông báo lỗi
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý cập nhật mật khẩu khi đã đăng nhập
    const handleUpdatePassword = async (currentPassword, newPassword, confirmNewPassword) => {
        const result = await updatePassword(currentPassword, newPassword, confirmNewPassword);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý đăng xuất
    const handleLogout = async () => {
        // Gửi yêu cầu đăng xuất
        const result = await logout();
        if (result.success) {
            // Hiển thị thông báo thành công
            toast.success(result.message);
            setAuthStatus({ isAuthenticated: false });
            navigate("/");
            window.location.reload();
        } else {
            // Hiển thị thông báo lỗi
            toast.error(result.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                authStatus,
                currentForm,
                email,
                switchForm,
                setEmail,
                handleLogin,
                handleRegister,
                handleForgotPassword,
                handleVerifyOtp,
                handleResendOtp,
                handleResetPassword,
                handleLogout,
                handleUpdatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus, login, logout, register as registerAPI, forgotPassword, verifyOtp, resendOtp, resetPassword } from "@/api/api";
import toast from "react-hot-toast";

import { VerifyOtpForm } from "@/components/Home/AuthComponents/VerifyOtpForm";
import ResetPasswordForm from "@/components/Home/Form/ResetPasswordForm";
import { useModal } from "./ModalContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
        const result = await login(data.email, data.password);
        if (result.message === "Đăng nhập thành công.") {
            toast.success("Login successful!");
            const authStatus = await checkAuthStatus();
            setAuthStatus(authStatus);
            if (authStatus.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
            closeModal();
            window.location.reload();
        } else {
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý đăng ký
    const handleRegister = async (data) => {
        const result = await registerAPI({
            userName: data.userName,
            email: data.email,
            password: data.password,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
            userAddress: data.userAddress,
        });
        if (result?.message === "Đăng ký thành công. Vui lòng kiểm tra email để nhận mã OTP.") {
            toast.success("Registration successful! Please check your email for the OTP code.");
            setEmail(data.email);
            openModal(<VerifyOtpForm email={data.email} />, { className: "max-w-md" });
        } else {
            toast.error(result?.message || "Registration failed.");
        }
        return result;
    };

    // Hàm xử lý quên mật khẩu
    const handleForgotPassword = async (data) => {
        const result = await forgotPassword(data.email);
        if (result.message === "OTP code sent successfully. Please check your email.") {
            toast.success("OTP sent successfully! Please check your email.");
            setEmail(data.email);
            openModal(
                <VerifyOtpForm
                    email={data.email}
                    context="forgot-password"
                />,
                { className: "max-w-md" },
            );
        } else {
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý xác minh OTP
    const handleVerifyOtp = async (email, otp, context) => {
        const result = await verifyOtp(email, otp);
        if (result.message === "Kích hoạt tài khoản thành công.") {
            toast.success("Account activated successfully!");
            if (context === "forgot-password") {
                openModal(<ResetPasswordForm email={email} />, { className: "max-w-md" });
            } else {
                closeModal();
                window.location.reload();
            }
        } else {
            toast.error(result.message);
        }
        return result;
    };

    // Hàm gửi lại OTP
    const handleResendOtp = async (email) => {
        const result = await resendOtp(email);
        if (result.message === "Gửi mã OTP mới thành công. Vui lòng kiểm tra email của bạn.") {
            toast.success("A new OTP has been sent to your email.");
        } else {
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý đặt lại mật khẩu
    const handleResetPassword = async (email, newPassword) => {
        const result = await resetPassword(email, newPassword);
        if (result.message === "Password has been reset successfully.") {
            toast.success("Password reset successfully! Please login.");
            closeModal();
            setCurrentForm("login");
        } else {
            toast.error(result.message);
        }
        return result;
    };

    // Hàm xử lý đăng xuất
    const handleLogout = async () => {
        const result = await logout();
        if (result.message === "Đăng xuất thành công.") {
            toast.success("Logout successfully!");
            setAuthStatus({ isAuthenticated: false });
            navigate("/");
        } else {
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

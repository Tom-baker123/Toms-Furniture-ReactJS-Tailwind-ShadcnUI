import { useCallback } from "react";
import {
    login,
    register as registerAPI,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp,
    checkAuthStatus
} from "@/api/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuthApi = () => {
    const { updateAuthStatus } = useAuth();
    const navigate = useNavigate();

    const handleLogin = useCallback(async (email, password) => {
        try {
            const result = await login(email, password);
            if (result.message === "Đăng nhập thành công.") {
                toast.success("Đăng nhập thành công!");
                const authStatus = await checkAuthStatus();
                updateAuthStatus(authStatus);
                navigate(authStatus.role === "Admin" ? "/admin" : "/");
                return true;
            } else {
                toast.error(result.message);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi đăng nhập");
            return false;
        }
    }, [updateAuthStatus, navigate]);

    const handleRegister = useCallback(async (data) => {
        try {
            const result = await registerAPI(data);
            if (result.message === "Đăng ký thành công. Vui lòng kiểm tra email để nhận mã OTP.") {
                toast.success("Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.");
                return { success: true, email: data.email };
            } else {
                toast.error(result.message);
                return { success: false };
            }
        } catch (error) {
            toast.error("Lỗi đăng ký");
            return { success: false };
        }
    }, []);

    const handleForgotPassword = useCallback(async (email) => {
        try {
            const result = await forgotPassword(email);
            if (result.message === "OTP code sent successfully. Please check your email.") {
                toast.success("OTP đã được gửi! Vui lòng kiểm tra email.");
                return true;
            } else {
                toast.error(result.message);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi gửi OTP");
            return false;
        }
    }, []);

    const handleVerifyOtp = useCallback(async (email, otp) => {
        try {
            const result = await verifyOtp(email, otp);
            if (result.message === "Kích hoạt tài khoản thành công.") {
                toast.success("Xác minh OTP thành công!");
                return true;
            } else {
                toast.error(result.message);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi xác minh OTP");
            return false;
        }
    }, []);

    const handleResetPassword = useCallback(async (email, newPassword) => {
        try {
            const result = await resetPassword(email, newPassword);
            if (result.message === "Password has been reset successfully.") {
                toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
                return true;
            } else {
                toast.error(result.message);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi đặt lại mật khẩu");
            return false;
        }
    }, []);

    const handleResendOtp = useCallback(async (email) => {
        try {
            const result = await resendOtp(email);
            if (result.message === "Gửi mã OTP mới thành công. Vui lòng kiểm tra email của bạn.") {
                toast.success("OTP mới đã được gửi!");
                return true;
            } else {
                toast.error(result.message);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi gửi lại OTP");
            return false;
        }
    }, []);

    return {
        handleLogin,
        handleRegister,
        handleForgotPassword,
        handleVerifyOtp,
        handleResetPassword,
        handleResendOtp,
    };
};
import { API_BASE_URL } from "../apiConfig";

// [1.] Kiểm tra trạng thái đăng nhập của người dùng
export const checkAuthStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/status`, {
            method: "GET",
            credentials: "include",
        });
        console.log("Auth status response:", response);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to check auth status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Auth status data:", data);
        return {
            isAuthenticated: data.isAuthenticated,
            userName: data.userName || null,
            email: data.email || null,
            role: data.role || null,
            message: data.message || null,
            redirectUrl: data.redirectUrl || "/",
        };
    } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái xác thực:", error);
        return { isAuthenticated: false, message: "Unable to check authentication status." };
    }
};

// [2.] Đăng nhập
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }
        return {
            success: data.success || false,
            message: data.message || "Login successful.",
            userName: data.userName,
            role: data.role,
            redirectUrl: data.redirectUrl,
        };
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        return { success: false, message: error.message || "An error occurred during login." };
    }
};

// [3.] Đăng ký
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                userName: userData.userName,
                email: userData.email,
                password: userData.password,
                gender: userData.gender === "true",
                phoneNumber: userData.phoneNumber || null,
                userAddress: userData.userAddress || null,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Registration failed.");
        }
        return {
            success: data.success || false,
            message: data.message || "Registration successful.",
        };
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        return { success: false, message: error.message || "An error occurred during registration." };
    }
};

// [4.] Xác thực OTP
export const verifyOtp = async (email, otp) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "OTP verification failed.");
        }
        return {
            success: data.success || false,
            message: data.message || "OTP verification successful.",
        };
    } catch (error) {
        console.error("Lỗi khi xác thực OTP:", error);
        return { success: false, message: error.message || "An error occurred during OTP verification." };
    }
};

// [5.] Gửi lại mã OTP
export const resendOtp = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "OTP resend failed.");
        }
        return {
            success: data.success || false,
            message: data.message || "New OTP sent successfully.",
        };
    } catch (error) {
        console.error("Lỗi khi gửi lại OTP:", error);
        return { success: false, message: error.message || "An error occurred during OTP resend." };
    }
};

// [6.] Đăng xuất
export const logout = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Logout failed.");
        }
        return {
            success: data.success || false,
            message: data.message || "Logout successful.",
        };
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        return { success: false, message: error.message || "An error occurred during logout." };
    }
};

// [7.] Yêu cầu quên mật khẩu
export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Forgot password request failed.");
        }
        return {
            success: data.success || false,
            message: data.message || "OTP sent successfully.",
        };
    } catch (error) {
        console.error("Lỗi khi yêu cầu quên mật khẩu:", error);
        return { success: false, message: error.message || "An error occurred during forgot password request." };
    }
};

// [8.] Đặt lại mật khẩu
export const resetPassword = async (email, newPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Password reset failed.");
        }
        return {
            success: data.success || false,
            message: data.message || "Password reset successfully.",
        };
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        return { success: false, message: error.message || "An error occurred during password reset." };
    }
};

export default {
    checkAuthStatus,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
    forgotPassword,
    resetPassword,
};
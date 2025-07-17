import { API_BASE_URL } from "../apiConfig";

// Hàm gọi API dùng chung
const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: "include",
            ...options,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Request failed: ${response.status}`);
        }
        return data;
    } catch (error) {
        return { error: true, message: error.message || "An error occurred." };
    }
};

// [1.] Kiểm tra trạng thái đăng nhập của người dùng
export const checkAuthStatus = async () => {
    const data = await apiRequest("/Auth/status", { method: "GET" });
    if (data.error) {
        return { isAuthenticated: false, message: "Unable to check authentication status." };
    }
    console.log(data);
    return data;
};

// [2.] Đăng nhập
export const login = async (email, password) => {
    const data = await apiRequest("/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return {
        success: data.success || false,
        message: data.message || "Login successful.",
        userName: data.userName,
        role: data.role,
        redirectUrl: data.redirectUrl,
    };
};

// [3.] Đăng ký
export const register = async (userData) => {
    const data = await apiRequest("/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userName: userData.userName,
            email: userData.email,
            password: userData.password,
            gender: userData.gender === "true",
            phoneNumber: userData.phoneNumber || null,
            userAddress: userData.userAddress || null,
        }),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return {
        success: data.success || false,
        message: data.message || "Registration successful.",
    };
};

// [4.] Xác thực OTP
export const verifyOtp = async (email, otp) => {
    const data = await apiRequest("/Auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return {
        success: data.success || false,
        message: data.message || "OTP verification successful.",
    };
};

// [5.] Gửi lại mã OTP
export const resendOtp = async (email) => {
    const data = await apiRequest("/Auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return {
        success: data.success || false,
        message: data.message || "New OTP sent successfully.",
    };
};

// [6.] Đăng xuất
export const logout = async () => {
    const data = await apiRequest("/Auth/logout", { method: "POST" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return {
        success: data.success || false,
        message: data.message || "Logout successful.",
    };
};

// [7.] Yêu cầu quên mật khẩu
export const forgotPassword = async (email) => {
    const data = await apiRequest("/Auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return {
        success: data.success || false,
        message: data.message || "OTP sent successfully.",
    };
};

// [8.] Đặt lại mật khẩu
export const resetPassword = async (email, newPassword) => {
    const data = await apiRequest("/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return {
        success: data.success || false,
        message: data.message || "Password reset successfully.",
    };
};

// [9.] Cập nhật mật khẩu khi đã đăng nhập
export const updatePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    const data = await apiRequest("/Auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return {
        success: data.success || false,
        message: data.message || "Password updated successfully.",
    };
};


//#region [Global API🌐]-----------------------------------------------
// [0.] Các đường dẫn API
const API_BASE_URL = "https://localhost:7030/api";
//[1.] Kiểm tra trạng thái đăng nhập của người dùng
export const checkAuthStatus = async () => {
    try {
        // Gửi yêu cầu đến API để kiểm tra trạng thái đăng nhập + cookie
        const response = await fetch(`${API_BASE_URL}/Auth/status`, {
            method: "GET",
            credentials: "include",
        });
        console.log("Auth status response:", response);
        // Kiểm tra phản hồi từ server
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to check auth status: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Auth status data:", data);
        return data;
    } catch (error) {
        console.log("Error checking authentication status: ", error);
        return { isAuthenticated: false, message: "Can't check authentication status!" };
    }
}
//[2.] Đăng nhập.
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        return await response.json();
    }
    catch (error) {
        console.log("Error during Login:", error);
        return { message: "Error Logging" };
    }
};
//[3.] Đăng ký.
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(userData),
        });

        return await response.json();
    }
    catch (error) {
        console.log("Error during Login:", error);
        return { message: "Error when Register!" };
    }
};
//[4.] Xác thực OTP.
export const verifyOtp = async (email, otp) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, otp }),
        });

        return await response.json();
    }
    catch (error) {
        console.log("Error during OTP verification:", error);
        return { message: "Error when verification OTP!" };
    }
};
//[5.] Gửi lại mã OTP.
export const resendOtp = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email }),
        });

        return await response.json();
    }
    catch (error) {
        console.log("Error during OTP resend:", error);
        return { message: "Error when resending OTP!" };
    }
};
//[6.] Đăng xuất 
export const logout = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        return await response.json();
    }
    catch (error) {
        console.log("Error during logout:", error);
        return { message: "Error when logout!" };
    }
};
//#endregion [Global API🌐 - End]--------------------------------------


//#region [Home Page 🏠]-----------------------------------------------
export const getProductList = () => {
    return true;
};
export const getProductDetail = () => {
    return true;
};
//#endregion [Home Page 🏠 - End]--------------------------------------


//#region [ADMIN Page 🪪]----------------------------------------------
// [1.] API lấy tất cả danh sách danh mục sản phẩm
export const getAllCategories = async () => {
    try {
        const response = await fetch("https://localhost:7030/api/Category");
        // Kiểm tra xem response có thành công hay không?
        if (!response.ok) {
            throw new Error("Failed to fetch categories!");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`Can't get all categories with an error: ${error}`);
        return []
    }
}
// [2.] API lấy tất cả user
export const getAllUsers = async () => {
    try {
        // Gửi yêu cầu đến API để kiểm tra trạng thái đăng nhập + cookie
        const response = await fetch(`${API_BASE_URL}/Auth/users`, {
            credentials: "include",
        });
        // Kiểm tra phản hồi từ server
        if (!response.ok) {
            throw new Error("Failed to fetch users!");
        }

        return await response.json();
    } catch (error) {
        console.log("Error fetching users: ", error);
        return { message: "Can't get all users!" };
    }
}
//#endregion [ADMIN Page 🪪 - End]-------------------------------------


// ----- [NOTE] --------------------------------------------------------
// - 'credentials': 'include' để gửi cookie xác thực.
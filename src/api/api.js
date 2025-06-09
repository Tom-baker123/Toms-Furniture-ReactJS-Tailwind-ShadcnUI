import axios from "axios";

const TOKEN = "8ed1bdc4-4501-11f0-9b81-222185cb68c8"; // Replace with valid token
const GHN_BASE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api";
export const SHOP_ID = 196808; // Replace with valid ShopID
export const YOUR_SHOP_DISTRICT_ID = 1450; // Replace with valid district ID
export const YOUR_SHOP_WARD_CODE = "20804"; // Replace with valid ward code

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

export const getProvinces = async () => {
    try {
        const response = await axios.get(`${GHN_BASE_URL}/master-data/province`, {
            headers: { Token: TOKEN },
        });
        return response.data.data || [];
    } catch (error) {
        console.error("Lỗi lấy tỉnh:", error);
        return [];
    }
};

export const getDistricts = async (provinceId) => {
    try {
        const response = await axios.get(`${GHN_BASE_URL}/master-data/district`, {
            params: { province_id: provinceId },
            headers: { Token: TOKEN },
        });
        return response.data.data || [];
    } catch (error) {
        console.error("Lỗi lấy quận:", error);
        return [];
    }
};

export const getWards = async (districtId) => {
    try {
        const response = await axios.get(`${GHN_BASE_URL}/master-data/ward`, {
            params: { district_id: districtId },
            headers: { Token: TOKEN },
        });
        return response.data.data || [];
    } catch (error) {
        console.error("Lỗi lấy phường:", error);
        return [];
    }
};

export const getAvailableServices = async (fromDistrictId, toDistrictId) => {
    try {
        const response = await axios.get(`${GHN_BASE_URL}/v2/shipping-order/available-services`, {
            params: {
                shop_id: SHOP_ID,
                from_district: fromDistrictId,
                to_district: toDistrictId,
            },
            headers: { Token: TOKEN },
        });
        return response.data.data || [];
    } catch (error) {
        console.error("Lỗi lấy dịch vụ khả dụng:", error);
        return [];
    }
};

export const calculateShippingFee = async (toDistrictId, toWardCode, items = [], serviceTypeId = 2) => {
    try {
        if (!items.length) throw new Error("Cart items trống");
        if (!Number(toDistrictId) || !toWardCode) throw new Error("Invalid district or ward code");

        const totalWeight = items.reduce(
            (sum, item) => sum + (item.sanPham.weight || 1000) * item.soLuong,
            0
        );
        const maxLength = Math.max(...items.map((item) => item.sanPham.length || 20));
        const maxWidth = Math.max(...items.map((item) => item.sanPham.width || 20));
        const totalHeight = items.reduce(
            (sum, item) => sum + (item.sanPham.height || 10) * item.soLuong,
            0
        );

        if (totalWeight <= 0 || totalHeight <= 0 || maxLength <= 0 || maxWidth <= 0) {
            throw new Error("Invalid package dimensions or weight");
        }

        const payload = {
            service_type_id: serviceTypeId,
            insurance_value: 0,
            coupon: null,
            from_district_id: YOUR_SHOP_DISTRICT_ID,
            from_ward_code: YOUR_SHOP_WARD_CODE,
            to_district_id: Number(toDistrictId),
            to_ward_code: toWardCode,
            height: totalHeight,
            length: maxLength,
            weight: totalWeight,
            width: maxWidth,
        };

        const response = await axios.post(`${GHN_BASE_URL}/v2/shipping-order/fee`, payload, {
            headers: {
                Token: TOKEN,
                ShopId: SHOP_ID,
                "Content-Type": "application/json",
            },
        });

        if (response.data.code === 200) {
            return response.data.data.total;
        } else {
            throw new Error(response.data.message || "API returned non-200 status");
        }
    } catch (error) {
        console.error("❌ Lỗi khi tính phí vận chuyển:", {
            message: error.message,
            response: error.response?.data,
            payload,
        });
        return 0;
    }
};
//#endregion [Home Page 🏠 - End]--------------------------------------


//#region [ADMIN Page 🪪]----------------------------------------------
// [1.1] API lấy tất cả danh sách danh mục sản phẩm
export const getAllCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Category`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        });
        // Kiểm tra xem response có thành công hay không?
        if (!response.ok) {
            throw new Error("Failed to fetch categories!");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`Can't get all categories with an error: ${error}`);
        return [];
    }
}
// [1.2] API thêm danh mục sản phẩm
export const createCategory = async (categoryData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("categoryVModel.CategoryName", categoryData.CategoryName);
        formData.append("categoryVModel.Descriptions", categoryData.Descriptions || "");
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Category`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create category");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

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
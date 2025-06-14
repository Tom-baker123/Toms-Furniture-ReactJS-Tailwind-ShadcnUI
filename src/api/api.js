import axios from "axios";

const TOKEN = "8ed1bdc4-4501-11f0-9b81-222185cb68c8"; // Replace with valid token
const GHN_BASE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api";
export const SHOP_ID = 196808; // Replace with valid ShopID
export const YOUR_SHOP_DISTRICT_ID = 1450; // Replace with valid district ID
export const YOUR_SHOP_WARD_CODE = "20804"; // Replace with valid ward code

// [0.] Các đường dẫn API
// const API_BASE_URL = "https://localhost:7030/api";
// const API_BASE_URL = "http://tom11357-001-site1.qtempurl.com/api";
const API_BASE_URL = "https://tomsfurniturebackend.onrender.com/api";


//#region [Global API🌐]-----------------------------------------------
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
        console.error("Error lấy tỉnh:", error);
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
        console.error("Error lấy quận:", error);
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
        console.error("Error lấy phường:", error);
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
        console.error("Error lấy dịch vụ khả dụng:", error);
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
        console.error("❌ Error khi tính phí vận chuyển:", {
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

// [1.1] API lấy tất cả danh sách danh mục sản phẩm


// [2.1] API lấy tất cả danh sách sản phẩm 
export const getProductList = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch products: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data; // Trả về danh sách sản phẩm
    } catch (error) {
        console.log("You have an error while fetching product: ", error);
        return [];
    }
}


// ------------------------------------------------------------------
// [2.2] API thêm sản phẩm 
// [2.3] API cập nhật sản phẩm 
export const updateProduct = async (productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update product: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.log("Error updating product: ", error);
        throw error;
    }
};
// [2.4] API xóa sản phẩm 
export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete product: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.log("Error deleting product: ", error);
        throw error;
    }
};


// ------------------------------------------------------------------
// [3.] API lấy tất cả user
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


// ------------------------------------------------------------------
// [4.1] API lấy tất cả danh sách thương hiệu
export const getAllBrands = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Brand`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to fetch brands';
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching brands: ${error.message}`);
        throw error;
    }
};

// [4.2] API lấy thương hiệu theo ID
export const getBrandById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Brand/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to fetch brand with ID ${id}`;
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching brand with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [4.3] API thêm thương hiệu
export const createBrand = async (brandData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("brandVModel.BrandName", brandData.BrandName);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Brand`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        console.log("Create brand response status:", response.status); // Debug
        console.log("Create brand response headers:", response.headers.get('content-type')); // Debug

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to create brand';
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.log("Error data (JSON):", errorData); // Debug
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
                console.log("Error data (text):", errorMessage); // Debug
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating brand:", error.message);
        throw error;
    }
};

// [4.4] API cập nhật thương hiệu
export const updateBrand = async (brandData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("brandVModel.Id", brandData.Id);
        formData.append("brandVModel.BrandName", brandData.BrandName);
        formData.append("brandVModel.IsActive", brandData.IsActive);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Brand`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to update brand';
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating brand:", error.message);
        throw error;
    }
};

// [4.5] API xóa thương hiệu
export const deleteBrand = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Brand?id=${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to delete brand with ID ${id}`;
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting brand:", error.message);
        throw error;
    }
};


// ------------------------------------------------------------------
// [5.1] Lấy tất cả danh sách xuất xứ
export const getAllCountries = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Country`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Không thể lấy danh sách xuất xứ';
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error khi lấy danh sách xuất xứ: ${error.message}`);
        throw error;
    }
};

// [5.2] Lấy xuất xứ theo ID
export const getCountryById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Country/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Không thể lấy xuất xứ với ID ${id}`;
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error khi lấy xuất xứ với ID ${id}: ${error.message}`);
        throw error;
    }
};

// [5.3] Thêm xuất xứ mới
export const createCountry = async (countryData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("countryVModel.CountryName", countryData.CountryName);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Country`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Không thể tạo xuất xứ';
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error khi tạo xuất xứ:", error.message);
        throw error;
    }
};

// [5.4] Cập nhật xuất xứ
export const updateCountry = async (countryData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("countryVModel.Id", countryData.Id);
        formData.append("countryVModel.CountryName", countryData.CountryName);
        formData.append("countryVModel.IsActive", countryData.IsActive);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Country`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Không thể cập nhật xuất xứ';
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error khi cập nhật xuất xứ:", error.message);
        throw error;
    }
};

// [5.5] Xóa xuất xứ
export const deleteCountry = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Country/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Không thể xóa xuất xứ với ID ${id}`;
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error khi xóa xuất xứ:", error.message);
        throw error;
    }
};


// [6.1] API lấy tất cả danh sách nhà cung cấp
export const getAllSuppliers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Supplier`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to fetch suppliers'; // Thông báo lỗi bằng tiếng Anh
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching suppliers: ${error.message}`); // Thông báo lỗi bằng tiếng Anh
        throw error;
    }
};

// [6.2] API lấy nhà cung cấp theo ID
export const getSupplierById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Supplier/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to fetch supplier with ID ${id}`; // Thông báo lỗi bằng tiếng Anh
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching supplier with ID ${id}: ${error.message}`); // Thông báo lỗi bằng tiếng Anh
        throw error;
    }
};

// [6.3] API thêm nhà cung cấp
export const createSupplier = async (supplierData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("supplierVModel.SupplierName", supplierData.SupplierName || "");
        formData.append("supplierVModel.ContactName", supplierData.ContactName || "");
        formData.append("supplierVModel.Email", supplierData.Email);
        formData.append("supplierVModel.PhoneNumber", supplierData.PhoneNumber || "");
        formData.append("supplierVModel.Notes", supplierData.Notes || "");
        formData.append("supplierVModel.TaxId", supplierData.TaxId);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Supplier`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to create supplier'; // Thông báo lỗi bằng tiếng Anh
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating supplier:", error.message); // Thông báo lỗi bằng tiếng Anh
        throw error;
    }
};

// [6.4] API cập nhật nhà cung cấp
export const updateSupplier = async (supplierData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("supplierVModel.Id", supplierData.Id);
        formData.append("supplierVModel.SupplierName", supplierData.SupplierName || "");
        formData.append("supplierVModel.ContactName", supplierData.ContactName || "");
        formData.append("supplierVModel.Email", supplierData.Email);
        formData.append("supplierVModel.PhoneNumber", supplierData.PhoneNumber || "");
        formData.append("supplierVModel.Notes", supplierData.Notes || "");
        formData.append("supplierVModel.TaxId", supplierData.TaxId);
        formData.append("supplierVModel.IsActive", supplierData.IsActive);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Supplier`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to update supplier'; // Thông báo lỗi bằng tiếng Anh
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating supplier:", error.message); // Thông báo lỗi bằng tiếng Anh
        throw error;
    }
};

// [6.5] API xóa nhà cung cấp
export const deleteSupplier = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Supplier/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to delete supplier with ID ${id}`; // Thông báo lỗi bằng tiếng Anh
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting supplier:", error.message); // Thông báo lỗi bằng tiếng Anh
        throw error;
    }
};


//#endregion [ADMIN Page 🪪 - End]-------------------------------------


// ----- [NOTE] --------------------------------------------------------
// - 'credentials': 'include' để gửi cookie xác thực.
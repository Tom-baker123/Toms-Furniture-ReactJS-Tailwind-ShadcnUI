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
// - Gọi API GET /api/Category để lấy toàn bộ danh sách danh mục
// - Trả về danh sách các danh mục dưới dạng JSON
export const getAllCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Category`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Gửi cookie xác thực
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch categories";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching categories: ${error.message}`);
        throw error;
    }
};

// [1.2] API lấy danh mục theo ID
// - Gọi API GET /api/Category/{id} để lấy thông tin chi tiết của một danh mục
// - Trả về thông tin danh mục hoặc null nếu không tìm thấy
export const getCategoryById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Category/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch category with ID ${id}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching category with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [1.3] API thêm danh mục sản phẩm
// - Gọi API POST /api/Category để tạo mới một danh mục
// - Dữ liệu được gửi dưới dạng FormData vì backend yêu cầu [FromForm]
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create category";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating category:", error.message);
        throw error;
    }
};

// [1.4] API cập nhật danh mục
// - Gọi API PUT /api/Category để cập nhật thông tin danh mục
// - Dữ liệu được gửi dưới dạng FormData vì backend yêu cầu [FromForm]
export const updateCategory = async (categoryData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("categoryVModel.Id", categoryData.Id);
        formData.append("categoryVModel.CategoryName", categoryData.CategoryName);
        formData.append("categoryVModel.Descriptions", categoryData.Descriptions || "");
        formData.append("categoryVModel.IsActive", categoryData.IsActive.toString());
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Category`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update category";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating category:", error.message);
        throw error;
    }
};

// [1.5] API xóa danh mục
// - Gọi API DELETE /api/Category/{id} để xóa một danh mục
export const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Category/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete category with ID ${id}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting category:", error.message);
        throw error;
    }
};



// ------------------------------------------------------------------
// [2.1] API lấy tất cả danh sách sản phẩm
// - Gọi API GET /api/Product để lấy toàn bộ danh sách sản phẩm
// - Trả về danh sách sản phẩm dưới dạng JSON
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch products";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error.message);
        throw error;
    }
};

// [2.2] API lấy sản phẩm theo ID
// - Gọi API GET /api/Product/{id} để lấy thông tin chi tiết của một sản phẩm
// - Trả về thông tin sản phẩm hoặc null nếu không tìm thấy
export const getProductById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch product with ID ${id}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching product with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [2.3] API thêm sản phẩm
// - Gọi API POST /api/Product để tạo mới một sản phẩm
// - Dữ liệu được gửi dưới dạng JSON, bao gồm ProductVariants và Sliders
export const createProduct = async (productData, sliders) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create product";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        const createdProduct = await response.json();
        // Kiểm tra cấu trúc phản hồi để lấy productId
        let productId;

        if (createdProduct && createdProduct.productId) {
            productId = createdProduct?.productId;
            console.log(productId);
        } else {
            throw new Error("Unable to retrieve product ID from response");
        }

        // Tạo các Slider cho sản phẩm
        for (const slider of sliders) {
            if (slider.imageFile) {
                const formData = new FormData();
                formData.append("slidervModel.Title", slider.title || productData.ProductName);
                formData.append("slidervModel.LinkUrl", slider.linkUrl || `/products/${productId}`);
                formData.append("slidervModel.StartDate", new Date().toISOString());
                formData.append("slidervModel.EndDate", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
                formData.append("slidervModel.IsPoster", "true");
                formData.append("slidervModel.Position", "product_page");
                formData.append("slidervModel.DisplayOrder", slider.displayOrder || 0);
                formData.append("slidervModel.ProductId", productId.toString());
                formData.append("ImageFile", slider.imageFile);

                console.log(formData);

                const sliderResponse = await fetch(`${API_BASE_URL}/Slider`, {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });

                if (!sliderResponse.ok) {
                    const contentType = sliderResponse.headers.get("content-type");
                    let errorMessage = "Failed to create slider";
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await sliderResponse.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        errorMessage = await sliderResponse.text();
                    }
                    console.warn(`Warning: ${errorMessage}`);
                }
            }
        }

        return createdProduct;
    } catch (error) {
        console.error("Error creating product:", error.message);
        throw error;
    }
};

// [2.4] API cập nhật sản phẩm
// - Gọi API PUT /api/Product để cập nhật thông tin sản phẩm
// - Dữ liệu được gửi dưới dạng JSON, bao gồm ProductVariants và Sliders
export const updateProduct = async (productData, sliders) => {
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update product";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        const updatedProduct = await response.json();
        // Cập nhật hoặc tạo mới Sliders
        for (const slider of sliders) {
            if (slider.imageFile) {
                const formData = new FormData();
                formData.append("slidervModel.Title", slider.title || productData.ProductName);
                formData.append("slidervModel.LinkUrl", slider.linkUrl || `/products/${productData.Id}`);
                formData.append("slidervModel.StartDate", new Date().toISOString());
                formData.append("slidervModel.EndDate", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
                formData.append("slidervModel.IsPoster", "true");
                formData.append("slidervModel.Position", "product_page");
                formData.append("slidervModel.DisplayOrder", slider.displayOrder || 0);
                formData.append("slidervModel.ProductId", productData.Id);
                formData.append("ImageFile", slider.imageFile);

                const sliderResponse = await fetch(`${API_BASE_URL}/Slider`, {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });

                if (!sliderResponse.ok) {
                    const contentType = sliderResponse.headers.get("content-type");
                    let errorMessage = "Failed to create slider";
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await sliderResponse.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        errorMessage = await sliderResponse.text();
                    }
                    console.warn(`Warning: ${errorMessage}`);
                }
            }
        }

        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error.message);
        throw error;
    }
};

// [2.5] API xóa sản phẩm
// - Gọi API DELETE /api/Product/{id} để xóa một sản phẩm
export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete product with ID ${id}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting product:", error.message);
        throw error;
    }
};

// [2.6] API cập nhật biến thể sản phẩm
// - Gọi API PUT /api/Product/variant để cập nhật biến thể sản phẩm
export const updateProductVariant = async (variantData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product/variant`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(variantData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update product variant";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating product variant:", error.message);
        throw error;
    }
};
// #endregion [Product APIs 🛒 - End] ---------------------------------------

// #region [Slider APIs 🖼️] -----------------------------------------------
// [2.6] API xóa Slider
// - Gọi API DELETE /api/Slider/{id} để xóa một Slider
export const deleteSlider = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Slider/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete slider with ID ${id}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting slider:", error.message);
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


// ------------------------------------------------------------------
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


// ------------------------------------------------------------------
// [7.1] API lấy tất cả danh sách kích thước
export const getAllSizes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Size`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to fetch sizes';
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
        console.error(`Error fetching sizes: ${error.message}`);
        throw error;
    }
};

// [7.2] API lấy kích thước theo ID
export const getSizeById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Size/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to fetch size with ID ${id}`;
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
        console.error(`Error fetching size with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [7.3] API thêm kích thước
export const createSize = async (sizeData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Size`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(sizeData),
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to create size';
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
        console.error("Error creating size:", error.message);
        throw error;
    }
};

// [7.4] API cập nhật kích thước
export const updateSize = async (sizeData) => {
    try {
        const formData = new FormData();
        formData.append('Id', sizeData.Id);
        formData.append('SizeName', sizeData.SizeName);
        if (sizeData.IsActive !== undefined) {
            formData.append('IsActive', sizeData.IsActive.toString());
        }

        const response = await fetch(`${API_BASE_URL}/Size`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to update size';
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
        console.error("Error updating size:", error.message);
        throw error;
    }
};

// [7.5] API xóa kích thước
export const deleteSize = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Size/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to delete size with ID ${id}`;
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
        console.error("Error deleting size:", error.message);
        throw error;
    }
};


// ------------------------------------------------------------------
// [8.1] API lấy tất cả danh sách màu sắc
// - Gọi API GET /api/Color để lấy toàn bộ danh sách màu sắc
// - Trả về danh sách các màu sắc dưới dạng JSON
export const getAllColors = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Color`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to fetch colors';
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
        console.error(`Error fetching colors: ${error.message}`);
        throw error;
    }
};

// [8.2] API lấy màu sắc theo ID
// - Gọi API GET /api/Color/{id} để lấy thông tin chi tiết của một màu sắc
// - Trả về thông tin màu sắc hoặc null nếu không tìm thấy
export const getColorById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Color/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to fetch color with ID ${id}`;
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
        console.error(`Error fetching color with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [8.3] API thêm màu sắc
// - Gọi API POST /api/Color để tạo mới một màu sắc
// - Nhận dữ liệu từ form (ColorCreateVModel) và gửi dưới dạng JSON
export const createColor = async (colorData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Color`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(colorData),
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to create color';
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
        console.error("Error creating color:", error.message);
        throw error;
    }
};

// [8.4] API cập nhật màu sắc
// - Gọi API PUT /api/Color để cập nhật thông tin màu sắc
// - Dữ liệu được gửi dưới dạng FormData vì backend yêu cầu [FromForm]
export const updateColor = async (colorData) => {
    try {
        const formData = new FormData();
        formData.append('Id', colorData.Id);
        formData.append('ColorName', colorData.ColorName);
        formData.append('ColorCode', colorData.ColorCode || '');
        if (colorData.IsActive !== undefined) {
            formData.append('IsActive', colorData.IsActive.toString());
        }

        const response = await fetch(`${API_BASE_URL}/Color`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to update color';
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
        console.error("Error updating color:", error.message);
        throw error;
    }
};

// [8.5] API xóa màu sắc
// - Gọi API DELETE /api/Color/{id} để xóa một màu sắc
export const deleteColor = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Color/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to delete color with ID ${id}`;
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
        console.error("Error deleting color:", error.message);
        throw error;
    }
};


// ------------------------------------------------------------------
// [9.1] API lấy tất cả danh sách vật liệu
// - Gọi API GET /api/Material để lấy toàn bộ danh sách vật liệu
// - Trả về danh sách các vật liệu dưới dạng JSON
export const getAllMaterials = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Material`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to fetch materials';
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
        console.error(`Error fetching materials: ${error.message}`);
        throw error;
    }
};

// [9.2] API lấy vật liệu theo ID
// - Gọi API GET /api/Material/{id} để lấy thông tin chi tiết của một vật liệu
// - Trả về thông tin vật liệu hoặc null nếu không tìm thấy
export const getMaterialById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Material/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to fetch material with ID ${id}`;
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
        console.error(`Error fetching material with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [9.3] API thêm vật liệu
// - Gọi API POST /api/Material để tạo mới một vật liệu
// - Nhận dữ liệu từ form (MaterialCreateVModel) và gửi dưới dạng JSON
export const createMaterial = async (materialData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Material`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(materialData),
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to create material';
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
        console.error("Error creating material:", error.message);
        throw error;
    }
};

// [9.4] API cập nhật vật liệu
// - Gọi API PUT /api/Material để cập nhật thông tin vật liệu
// - Dữ liệu được gửi dưới dạng FormData vì backend yêu cầu [FromForm]
export const updateMaterial = async (materialData) => {
    try {
        const formData = new FormData();
        formData.append('Id', materialData.Id);
        formData.append('MaterialName', materialData.MaterialName);
        if (materialData.IsActive !== undefined) {
            formData.append('IsActive', materialData.IsActive.toString());
        }

        const response = await fetch(`${API_BASE_URL}/Material`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Failed to update material';
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
        console.error("Error updating material:", error.message);
        throw error;
    }
};

// [9.5] API xóa vật liệu
// - Gọi API DELETE /api/Material/{id} để xóa một vật liệu
export const deleteMaterial = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Material/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `Failed to delete material with ID ${id}`;
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
        console.error("Error deleting material:", error.message);
        throw error;
    }
};


// ------------------------------------------------------------------
// [10.1] API lấy tất cả danh sách đơn vị
// - Gọi API GET /api/Unit để lấy toàn bộ danh sách đơn vị
// - Trả về danh sách các đơn vị dưới dạng JSON
export const getAllUnits = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Unit`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch units";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching units: ${error.message}`);
        throw error;
    }
};

// [10.2] API lấy đơn vị theo ID
// - Gọi API GET /api/Unit/{id} để lấy thông tin chi tiết của một đơn vị
// - Trả về thông tin đơn vị hoặc null nếu không tìm thấy
export const getUnitById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Unit/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch unit with ID ${id}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching unit with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [10.3] API thêm đơn vị
// - Gọi API POST /api/Unit để tạo mới một đơn vị
// - Nhận dữ liệu từ form (UnitCreateVModel) và gửi dưới dạng JSON
export const createUnit = async (unitData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Unit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(unitData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create unit";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating unit:", error.message);
        throw error;
    }
};

// [10.4] API cập nhật đơn vị
// - Gọi API PUT /api/Unit để cập nhật thông tin đơn vị
// - Dữ liệu được gửi dưới dạng FormData vì backend yêu cầu [FromForm]
export const updateUnit = async (unitData) => {
    try {
        const formData = new FormData();
        formData.append("Id", unitData.Id);
        formData.append("UnitName", unitData.UnitName);
        if (unitData.Description) {
            formData.append("Description", unitData.Description);
        }
        if (unitData.IsActive !== undefined) {
            formData.append("IsActive", unitData.IsActive.toString());
        }

        const response = await fetch(`${API_BASE_URL}/Unit`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update unit";
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating unit:", error.message);
        throw error;
    }
};

// [10.5] API xóa đơn vị
// - Gọi API DELETE /api/Unit/{id} để xóa một đơn vị
export const deleteUnit = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Unit/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete unit with ID ${id}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting unit:", error.message);
        throw error;
    }
};
//#endregion [ADMIN Page 🪪 - End]-------------------------------------


// ----- [NOTE] --------------------------------------------------------
// - 'credentials': 'include' để gửi cookie xác thực.
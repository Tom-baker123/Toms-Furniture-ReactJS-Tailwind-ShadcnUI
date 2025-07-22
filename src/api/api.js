import axios from "axios";
import {
    TOKEN,
    GHN_BASE_URL,
    SHOP_ID,
    YOUR_SHOP_DISTRICT_ID,
    YOUR_SHOP_WARD_CODE,
    API_BASE_URL,
} from "./apiConfig";
export {
    TOKEN,
    GHN_BASE_URL,
    SHOP_ID,
    YOUR_SHOP_DISTRICT_ID,
    YOUR_SHOP_WARD_CODE,
    API_BASE_URL,
};

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
export const getAllProducts = async ({
    pageNumber = 1,
    pageSize = 150,
    search = "",
    productName = "",
    categoryNames = [],
    colorNames = [],
    materialNames = [],
    sizeNames = [],
    brandNames = [],
    countryNames = [],
    sortBy = "",
    sortOrder = "",
    minPrice = null, // Thêm tham số minPrice để lọc giá tối thiểu
    maxPrice = null, // Thêm tham số maxPrice để lọc giá tối đa
    inStock = null, // Thêm tham số inStock để lọc trạng thái tồn kho
} = {}) => {
    try {
        // Tạo URLSearchParams để xây dựng query string
        const params = new URLSearchParams();
        params.append("pageNumber", pageNumber);
        params.append("pageSize", pageSize);
        if (search) params.append("search", encodeURIComponent(search));
        if (productName) params.append("productName", encodeURIComponent(productName));

        // Thêm các tham số danh sách
        categoryNames.forEach((name) => params.append("CategoryNames", encodeURIComponent(name)));
        colorNames.forEach((name) => params.append("ColorNames", encodeURIComponent(name)));
        materialNames.forEach((name) => params.append("MaterialNames", encodeURIComponent(name)));
        sizeNames.forEach((name) => params.append("SizeNames", encodeURIComponent(name)));
        brandNames.forEach((name) => params.append("BrandNames", encodeURIComponent(name)));
        countryNames.forEach((name) => params.append("CountryNames", encodeURIComponent(name)));

        if (sortBy) params.append("sortBy", encodeURIComponent(sortBy));
        if (sortOrder) params.append("sortOrder", encodeURIComponent(sortOrder));
        if (minPrice !== null) params.append("minPrice", minPrice); // Thêm tham số minPrice nếu có giá trị
        if (maxPrice !== null) params.append("maxPrice", maxPrice); // Thêm tham số maxPrice nếu có giá trị
        if (inStock !== null) params.append("inStock", inStock); // Thêm tham số inStock nếu có giá trị

        const response = await fetch(`${API_BASE_URL}/Product?${params.toString()}`, {
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

        const data = await response.json();
        return data; // Trả về đối tượng PaginationModel
    } catch (error) {
        console.error("Error fetching products:", error.message);
        throw error;
    }
};

// [2.2] API lấy sản phẩm theo ID
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

        return await response.json(); // Trả về ProductGetVModel
    } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error.message);
        throw error;
    }
};

// [2.3] API thêm sản phẩm
export const createProduct = async (productData, sliders) => {
    try {
        // Bước 1: Kiểm tra dữ liệu sản phẩm
        if (!productData.ProductName) {
            throw new Error("Product name is required");
        }

        // Bước 2: Gửi request tạo sản phẩm
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
                errorMessage = errorData.Message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        const createdProduct = await response.json();
        const productId = createdProduct?.productId;
        if (!productId) {
            throw new Error("Unable to retrieve product ID from response");
        }

        // Bước 3: Tạo sliders tuần tự cho sản phẩm
        const sliderResults = [];
        let sliderIndex = 1; // Biến đếm tự tăng của slider

        // Hàm định dạng số thứ tự thành 3 chuỗi số (ví dụ: 1 -> "001")
        const formatSliderIndex = (index) => String(index).padStart(3, "0");

        for (const slider of sliders || []) {
            if (slider.imageFile) {
                const formData = new FormData();
                formData.append("slidervModel.Title", slider.title || `${productData.ProductName} ${formatSliderIndex(sliderIndex)}`);
                formData.append("slidervModel.Description", slider.description || "");
                if (slider.linkUrl) {
                    formData.append("slidervModel.LinkUrl", slider.linkUrl);
                }
                formData.append("slidervModel.IsPoster", slider.isPoster?.toString() || "true");
                if (slider.position) {
                    formData.append("slidervModel.Position", slider.position);
                }
                formData.append("slidervModel.DisplayOrder", slider.displayOrder?.toString() || "0");
                formData.append("slidervModel.ProductId", productId.toString());
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
                        errorMessage = errorData.Message || errorMessage;
                    } else {
                        errorMessage = await sliderResponse.text();
                    }
                    console.warn(`Warning: ${errorMessage}`);
                    sliderResults.push({ success: false, message: errorMessage });
                    continue; // Tiếp tục với slider tiếp theo thay vì dừng
                }

                const sliderData = await sliderResponse.json();
                sliderResults.push({ success: true, data: sliderData });
                sliderIndex++; // Tăng biến đếm lên sau khi tạo thành công slider
            }
        }

        // Bước 4: Trả về kết quả tạo sản phẩm và trạng thái sliders
        return {
            product: createdProduct,
            sliders: sliderResults,
        };
    } catch (error) {
        console.error("Error creating product:", error.message);
        throw error;
    }
};

// [2.4] API cập nhật sản phẩm
export const updateProduct = async (productData, sliders) => {
    try {
        // Bước 1: Kiểm tra dữ liệu sản phẩm
        if (!productData.Id || productData.Id <= 0) {
            throw new Error("Valid product ID is required");
        }
        if (!productData.ProductName) {
            throw new Error("Product name is required");
        }

        // Bước 2: Kiểm tra và chuẩn hóa ProductVariants
        if (productData.ProductVariants && Array.isArray(productData.ProductVariants)) {
            productData.ProductVariants = productData.ProductVariants.map((variant, index) => {
                // Kiểm tra Id của biến thể (từ API hoặc form)
                const variantId = variant.Id !== undefined ? variant.Id : variant.id || 0;

                if (variantId !== 0 && !Number.isInteger(variantId)) {
                    throw new Error(`Invalid variant Id at index ${index}`);
                }

                // Validation cho biến thể
                if (variantId === 0) {
                    // Biến thể mới
                    if (variant.OriginalPrice === undefined || variant.OriginalPrice < 0) {
                        throw new Error(`Original price is required and cannot be negative for variant at index ${index}`);
                    }
                    if (variant.DiscountedPrice && variant.DiscountedPrice < 0) {
                        throw new Error(`Discounted price cannot be negative for variant at index ${index}`);
                    }
                    if (variant.StockQty === undefined || variant.StockQty < 0) {
                        throw new Error(`Stock quantity is required and cannot be negative for variant at index ${index}`);
                    }
                    if (!variant.ColorId || !Number.isInteger(variant.ColorId) || variant.ColorId <= 0) {
                        throw new Error(`Valid ColorId is required for variant at index ${index}`);
                    }
                    if (!variant.SizeId || !Number.isInteger(variant.SizeId) || variant.SizeId <= 0) {
                        throw new Error(`Valid SizeId is required for variant at index ${index}`);
                    }
                    if (!variant.MaterialId || !Number.isInteger(variant.MaterialId) || variant.MaterialId <= 0) {
                        throw new Error(`Valid MaterialId is required for variant at index ${index}`);
                    }
                    if (!variant.UnitId || !Number.isInteger(variant.UnitId) || variant.UnitId <= 0) {
                        throw new Error(`Valid UnitId is required for variant at index ${index}`);
                    }
                }

                return {
                    Id: variantId, // Sử dụng variantId (từ Id hoặc id)
                    OriginalPrice: Number(variant.OriginalPrice),
                    DiscountedPrice: variant.DiscountedPrice ? Number(variant.DiscountedPrice) : null,
                    StockQty: Number(variant.StockQty),
                    ColorId: Number(variant.ColorId),
                    SizeId: Number(variant.SizeId),
                    MaterialId: Number(variant.MaterialId),
                    UnitId: Number(variant.UnitId),
                    IsActive: variant.IsActive !== undefined ? variant.IsActive : true,
                };
            });
        }

        // Bước 3: Gửi request cập nhật sản phẩm
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
                errorMessage = errorData.Message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        const updatedProduct = await response.json();

        // Bước 4: Cập nhật hoặc tạo mới sliders tuần tự
        const sliderResults = [];
        for (const slider of sliders || []) {
            const formData = new FormData();
            formData.append("slidervModel.Title", slider.title || productData.ProductName);
            formData.append("slidervModel.Description", slider.description || "");
            if (slider.linkUrl) {
                formData.append("slidervModel.LinkUrl", slider.linkUrl);
            }
            formData.append("slidervModel.IsPoster", slider.isPoster?.toString() || "true");
            if (slider.position) {
                formData.append("slidervModel.Position", slider.position);
            }
            formData.append("slidervModel.DisplayOrder", slider.displayOrder?.toString() || "0");
            formData.append("slidervModel.ProductId", productData.Id.toString());

            if (slider.id) {
                // Bước 5: Cập nhật slider hiện có
                formData.append("slidervModel.Id", slider.id.toString());
                formData.append("slidervModel.IsActive", slider.isActive?.toString() || "true");
                if (slider.imageFile) {
                    formData.append("ImageFile", slider.imageFile);
                }

                const sliderResponse = await fetch(`${API_BASE_URL}/Slider`, {
                    method: "PUT",
                    credentials: "include",
                    body: formData,
                });

                if (!sliderResponse.ok) {
                    const contentType = sliderResponse.headers.get("content-type");
                    let errorMessage = `Failed to update slider with ID ${slider.id}`;
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await sliderResponse.json();
                        errorMessage = errorData.Message || errorMessage;
                    } else {
                        errorMessage = await sliderResponse.text();
                    }
                    console.warn(`Warning: ${errorMessage}`);
                    sliderResults.push({ success: false, message: errorMessage });
                    continue;
                }

                const sliderData = await sliderResponse.json();
                sliderResults.push({ success: true, data: sliderData });
            } else if (slider.imageFile) {
                // Bước 6: Tạo mới slider
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
                        errorMessage = errorData.Message || errorMessage;
                    } else {
                        errorMessage = await sliderResponse.text();
                    }
                    console.warn(`Warning: ${errorMessage}`);
                    sliderResults.push({ success: false, message: errorMessage });
                    continue;
                }

                const sliderData = await sliderResponse.json();
                sliderResults.push({ success: true, data: sliderData });
            }
        }

        // Bước 7: Trả về kết quả cập nhật sản phẩm và trạng thái sliders
        return {
            product: updatedProduct,
            sliders: sliderResults,
        };
    } catch (error) {
        console.error("Error updating product:", error.message);
        throw error;
    }
};

// [2.5] API xóa sản phẩm
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
export const updateProductVariant = async (variantData) => {
    try {
        // Validation dữ liệu biến thể
        if (!variantData.Id || variantData.Id <= 0) {
            throw new Error("Valid variant ID is required");
        }
        if (variantData.OriginalPrice < 0) {
            throw new Error("Original price cannot be negative");
        }
        if (variantData.DiscountedPrice && variantData.DiscountedPrice < 0) {
            throw new Error("Discounted price cannot be negative");
        }
        if (variantData.StockQty < 0) {
            throw new Error("Stock quantity cannot be negative");
        }

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

// [2.7] API lấy tất cả slider
export const getAllSliders = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Slider`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch sliders";
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
        console.error("Error fetching sliders:", error.message);
        throw error;
    }
};

// [2.8] API lấy slider theo ID
export const getSliderById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Slider/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch slider with ID ${id}`;
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
        console.error(`Error fetching slider with ID ${id}:`, error.message);
        throw error;
    }
};

// [2.9] API tạo slider
export const createSlider = async (sliderData, imageFile) => {
    try {
        // Validation dữ liệu slider
        if (!sliderData.Title) {
            throw new Error("Slider title is required");
        }
        if (!imageFile) {
            throw new Error("Image file is required");
        }

        const formData = new FormData();
        formData.append("slidervModel.Title", sliderData.title || "");
        formData.append("slidervModel.Description", sliderData.description || "");
        formData.append("slidervModel.LinkUrl", sliderData.linkUrl || "/");
        formData.append("slidervModel.IsPoster", sliderData.isPoster?.toString() || "true");
        formData.append("slidervModel.Position", sliderData.position || "Home Page");
        formData.append("slidervModel.DisplayOrder", sliderData.displayOrder?.toString() || "0");
        formData.append("slidervModel.ProductId", sliderData.productId?.toString() || "");
        formData.append("ImageFile", imageFile);

        const response = await fetch(`${API_BASE_URL}/Slider`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create slider";
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
        console.error("Error creating slider:", error.message);
        throw error;
    }
};

// [2.10] API cập nhật slider
export const updateSlider = async (sliderData, imageFile) => {
    try {
        // Validation dữ liệu slider
        if (!sliderData.Id || sliderData.Id <= 0) {
            throw new Error("Valid slider ID is required");
        }
        if (!sliderData.Title) {
            throw new Error("Slider title is required");
        }

        const formData = new FormData();
        formData.append("slidervModel.Id", sliderData.id.toString());
        formData.append("slidervModel.Title", sliderData.title || "");
        formData.append("slidervModel.Description", sliderData.description || "");
        formData.append("slidervModel.LinkUrl", sliderData.linkUrl || "/");
        formData.append("slidervModel.IsPoster", sliderData.isPoster?.toString() || "true");
        formData.append("slidervModel.Position", sliderData.position || "Home Page");
        formData.append("slidervModel.DisplayOrder", sliderData.displayOrder?.toString() || "0");
        formData.append("slidervModel.ProductId", sliderData.productId?.toString() || "");
        formData.append("slidervModel.IsActive", sliderData.isActive?.toString() || "true");
        if (imageFile) {
            formData.append("ImageFile", imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/Slider`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update slider";
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
        console.error("Error updating slider:", error.message);
        throw error;
    }
};

// [2.11] API xóa slider
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
                errorMessage = errorData.Message || errorMessage;
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

// [2.12] API xóa product variant theo id
export const deleteProductVariant = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product/variant/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete Product Variant with ID ${id}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.Message || errorMessage;
            } else {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting Product Variant:", error.message);
        throw error;
    }
};

// [2.13] API kiếm Productvariant theo id
export const getProductVariantById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Product/variant/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch Product variant with ID ${id}`;
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
        console.error(`Error fetching Product Variant with ID ${id}:`, error.message);
        throw error;
    }
};

// [2.14] API lấy ProductVariantId theo thuộc tính
export const getProductVariantIdByAttributes = async (productIdentifier, colorId, sizeId, materialId) => {
    try {
        const params = new URLSearchParams({
            productIdentifier,
            colorId,
            sizeId,
            materialId,
        });
        const response = await fetch(`${API_BASE_URL}/Product/variant/check?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to get product variant by attributes.");
        }
        return data; // { Message, Success, VariantId }
    } catch (error) {
        console.error("Error fetching product variant by attributes:", error.message);
        throw error;
    }
};

// ------------------------------------------------------------------
// [3.1] API lấy tất cả user
export const getAllUsers = async () => {
    try {
        // Gửi yêu cầu đến API để kiểm tra trạng thái đăng nhập + cookie
        const response = await fetch(`${API_BASE_URL}/Auth/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Gửi cookie xác thực
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
};

// [3.2] Lấy thông tin người dùng theo ID
export const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch user with ID ${id}`;
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
        console.error(`Error fetching user with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [3.3] Thêm người dùng
export const createUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/users/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create user";
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
        console.error("Error creating user:", error.message);
        throw error;
    }
};

// [3.4] Cập nhật người dùng
export const updateUser = async (id, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/users/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update user";
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
        console.error("Error updating user:", error.message);
        throw error;
    }
};

// [3.5] Xóa người dùng
export const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/users/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete user with ID ${id}`;
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
        console.error("Error deleting user:", error.message);
        throw error;
    }
};

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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch brands";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch brand with ID ${id}`;
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
        console.log("Create brand response headers:", response.headers.get("content-type")); // Debug

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create brand";
            if (contentType && contentType.includes("application/json")) {
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update brand";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete brand with ID ${id}`;
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Không thể lấy danh sách xuất xứ";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Không thể lấy xuất xứ với ID ${id}`;
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Không thể tạo xuất xứ";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Không thể cập nhật xuất xứ";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Không thể xóa xuất xứ với ID ${id}`;
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch suppliers"; // Thông báo lỗi bằng tiếng Anh
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch supplier with ID ${id}`; // Thông báo lỗi bằng tiếng Anh
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create supplier"; // Thông báo lỗi bằng tiếng Anh
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update supplier"; // Thông báo lỗi bằng tiếng Anh
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete supplier with ID ${id}`; // Thông báo lỗi bằng tiếng Anh
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch sizes";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch size with ID ${id}`;
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create size";
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
        console.error("Error creating size:", error.message);
        throw error;
    }
};

// [7.4] API cập nhật kích thước
export const updateSize = async (sizeData) => {
    try {
        const formData = new FormData();
        formData.append("Id", sizeData.Id);
        formData.append("SizeName", sizeData.SizeName);
        if (sizeData.IsActive !== undefined) {
            formData.append("IsActive", sizeData.IsActive.toString());
        }

        const response = await fetch(`${API_BASE_URL}/Size`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update size";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete size with ID ${id}`;
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch colors";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch color with ID ${id}`;
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create color";
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
        formData.append("Id", colorData.Id);
        formData.append("ColorName", colorData.ColorName);
        formData.append("ColorCode", colorData.ColorCode || "");
        if (colorData.IsActive !== undefined) {
            formData.append("IsActive", colorData.IsActive.toString());
        }

        const response = await fetch(`${API_BASE_URL}/Color`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update color";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete color with ID ${id}`;
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch materials";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch material with ID ${id}`;
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
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create material";
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
        formData.append("Id", materialData.Id);
        formData.append("MaterialName", materialData.MaterialName);
        if (materialData.IsActive !== undefined) {
            formData.append("IsActive", materialData.IsActive.toString());
        }

        const response = await fetch(`${API_BASE_URL}/Material`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update material";
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
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete material with ID ${id}`;
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

// ------------------------------------------------------------------
// [11.1] API lấy tất cả danh sách khuyến mãi
// Lấy tất cả khuyến mãi, có thể truyền vào tổng tiền để lọc theo điều kiện orderMinimum
export const getAllPromotions = async (total) => {
    try {
        let url = `${API_BASE_URL}/Promotion`;
        if (typeof total !== 'undefined' && total !== null) {
            url += `?total=${encodeURIComponent(total)}`;
        }
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch promotions";
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
        console.error(`Error fetching promotions: ${error.message}`);
        throw error;
    }
};

// [11.2] API lấy khuyến mãi theo ID
export const getPromotionById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Promotion/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch promotion with ID ${id}`;
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
        console.error(`Error fetching promotion with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [11.3] API thêm khuyến mãi
export const createPromotion = async (promotionData) => {
    try {
        const formData = new FormData();
        formData.append("PromotionCode", promotionData.PromotionCode);
        formData.append("DiscountValue", promotionData.DiscountValue);
        formData.append("OrderMinimum", promotionData.OrderMinimum);
        formData.append("MaximumDiscountAmount", promotionData.MaximumDiscountAmount);
        formData.append("StartDate", promotionData.StartDate);
        formData.append("EndDate", promotionData.EndDate);
        formData.append("CouponUsage", promotionData.CouponUsage);
        if (promotionData.PromotionTypeId) {
            formData.append("PromotionTypeId", promotionData.PromotionTypeId);
        }

        const response = await fetch(`${API_BASE_URL}/Promotion`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create promotion";
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
        console.error("Error creating promotion:", error.message);
        throw error;
    }
};

// [11.4] API cập nhật khuyến mãi
export const updatePromotion = async (promotionData) => {
    try {
        const formData = new FormData();
        formData.append("Id", promotionData.Id);
        formData.append("PromotionCode", promotionData.PromotionCode);
        formData.append("DiscountValue", promotionData.DiscountValue);
        formData.append("OrderMinimum", promotionData.OrderMinimum);
        formData.append("MaximumDiscountAmount", promotionData.MaximumDiscountAmount);
        formData.append("StartDate", promotionData.StartDate);
        formData.append("EndDate", promotionData.EndDate);
        formData.append("CouponUsage", promotionData.CouponUsage);
        formData.append("IsActive", promotionData.IsActive);
        if (promotionData.PromotionTypeId) {
            formData.append("PromotionTypeId", promotionData.PromotionTypeId);
        }

        const response = await fetch(`${API_BASE_URL}/Promotion`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update promotion";
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
        console.error("Error updating promotion:", error.message);
        throw error;
    }
};

// [11.5] API xóa khuyến mãi
export const deletePromotion = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Promotion/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete promotion with ID ${id}`;
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
        console.error("Error deleting promotion:", error.message);
        throw error;
    }
};

// ------------------------------------------------------------------
// [12.1] API lấy tất cả danh sách loại khuyến mãi
export const getAllPromotionTypes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/PromotionType`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch promotion types";
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
        console.error(`Error fetching promotion types: ${error.message}`);
        throw error;
    }
};

// [12.2] API lấy loại khuyến mãi theo ID
export const getPromotionTypeById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/PromotionType/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch promotion type with ID ${id}`;
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
        console.error(`Error fetching promotion type with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [12.3] API thêm loại khuyến mãi
export const createPromotionType = async (promotionTypeData) => {
    try {
        const formData = new FormData();
        formData.append("PromotionTypeName", promotionTypeData.PromotionTypeName);
        formData.append("PromotionUnit", promotionTypeData.PromotionUnit);
        if (promotionTypeData.Description) {
            formData.append("Description", promotionTypeData.Description);
        }

        const response = await fetch(`${API_BASE_URL}/PromotionType`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create promotion type";
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
        console.error("Error creating promotion type:", error.message);
        throw error;
    }
};

// [12.4] API cập nhật loại khuyến mãi
export const updatePromotionType = async (promotionTypeData) => {
    try {
        const formData = new FormData();
        formData.append("Id", promotionTypeData.Id);
        formData.append("PromotionTypeName", promotionTypeData.PromotionTypeName);
        formData.append("PromotionUnit", promotionTypeData.PromotionUnit);
        formData.append("IsActive", promotionTypeData.IsActive);
        if (promotionTypeData.Description) {
            formData.append("Description", promotionTypeData.Description);
        }

        const response = await fetch(`${API_BASE_URL}/PromotionType`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update promotion type";
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
        console.error("Error updating promotion type:", error.message);
        throw error;
    }
};

// [12.5] API xóa loại khuyến mãi
export const deletePromotionType = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/PromotionType/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete promotion type with ID ${id}`;
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
        console.error("Error deleting promotion type:", error.message);
        throw error;
    }
};

// [13.1] API lấy tất cả thông tin cửa hàng
export const getAllStoreInformations = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/StoreInformation`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Gửi cookie xác thực
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Không thể lấy danh sách thông tin cửa hàng";
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
        console.error(`Lỗi khi lấy danh sách thông tin cửa hàng: ${error.message}`);
        throw error;
    }
};

// [13.2] API lấy thông tin cửa hàng theo ID
export const getStoreInformationById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/StoreInformation/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Không thể lấy thông tin cửa hàng với ID ${id}`;
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
        console.error(`Lỗi khi lấy thông tin cửa hàng với ID ${id}: ${error.message}`);
        throw error;
    }
};

// [13.3] API tạo mới thông tin cửa hàng
export const createStoreInformation = async (storeData, logoFile) => {
    try {
        const formData = new FormData();
        // Thêm các trường của storeData vào FormData
        Object.keys(storeData).forEach((key) => {
            if (storeData[key] !== null && storeData[key] !== undefined) {
                formData.append(`storeInformationVModel.${key}`, storeData[key]);
            }
        });
        if (logoFile) {
            formData.append("logoFile", logoFile);
        }

        const response = await fetch(`${API_BASE_URL}/StoreInformation`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Không thể tạo thông tin cửa hàng";
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
        console.error("Lỗi khi tạo thông tin cửa hàng:", error.message);
        throw error;
    }
};

// [13.4] API cập nhật thông tin cửa hàng
export const updateStoreInformation = async (storeData, logoFile) => {
    try {
        const formData = new FormData();
        // Thêm các trường của storeData vào FormData
        Object.keys(storeData).forEach((key) => {
            if (storeData[key] !== null && storeData[key] !== undefined) {
                formData.append(`storeInformationVModel.${key}`, storeData[key]);
            }
        });
        if (logoFile) {
            formData.append("logoFile", logoFile);
        }

        const response = await fetch(`${API_BASE_URL}/StoreInformation/${storeData.Id}`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Không thể cập nhật thông tin cửa hàng";
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
        console.error("Lỗi khi cập nhật thông tin cửa hàng:", error.message);
        throw error;
    }
};

// [13.5] API xóa thông tin cửa hàng
export const deleteStoreInformation = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/StoreInformation/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Không thể xóa thông tin cửa hàng với ID ${id}`;
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
        console.error(`Lỗi khi xóa thông tin cửa hàng với ID ${id}: ${error.message}`);
        throw error;
    }
};

// [Order Status API] - Thêm vào cuối file trước dòng NOTE
// [14.1] API lấy tất cả danh sách trạng thái đơn hàng
export const getAllOrderStatuses = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/OrderStatus`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to fetch order statuses";
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
        console.error(`Error fetching order statuses: ${error.message}`);
        throw error;
    }
};

// [14.2] API lấy trạng thái đơn hàng theo ID
export const getOrderStatusById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/OrderStatus/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to fetch order status with ID ${id}`;
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
        console.error(`Error fetching order status with ID ${id}: ${error.message}`);
        throw error;
    }
};

// [14.3] API thêm trạng thái đơn hàng
export const createOrderStatus = async (orderStatusData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/OrderStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
            credentials: "include",
            body: JSON.stringify(orderStatusData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to create order status";
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
        console.error("Error creating order status:", error.message);
        throw error;
    }
};

// [14.4] API cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderStatusData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/OrderStatus`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
            credentials: "include",
            body: JSON.stringify(orderStatusData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Failed to update order status";
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
        console.error("Error updating order status:", error.message);
        throw error;
    }
};

// [14.5] API xóa trạng thái đơn hàng
export const deleteOrderStatus = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/OrderStatus/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `Failed to delete order status with ID ${id}`;
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
        console.error("Error deleting order status:", error.message);
        throw error;
    }
};
//#endregion [ADMIN Page 🪪 - End]-------------------------------------

// ----- [NOTE] --------------------------------------------------------
// - 'credentials': 'include' để gửi cookie xác thực.

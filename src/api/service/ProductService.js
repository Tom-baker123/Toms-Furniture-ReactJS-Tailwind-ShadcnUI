import { API_BASE_URL } from "../apiConfig.js";

// Debug: Log API base URL to make sure it's correct
console.log("🌐 [API CONFIG] API_BASE_URL:", API_BASE_URL);

// ===== UTILITY FUNCTIONS =====

// Utility function để xử lý lỗi API response
const handleApiError = async (response, defaultMessage) => {
    const contentType = response.headers.get("content-type");
    let errorMessage = defaultMessage;

    if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.Message || errorMessage;
        // Handle validation errors
        if (errorData.errors) {
            const validationMessages = Object.entries(errorData.errors)
                .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
                .join("; ");
            errorMessage = `Validation errors: ${validationMessages}`;
        }
    } else {
        errorMessage = await response.text();
    }

    throw new Error(errorMessage);
};

// Utility function để tạo fetch request với cấu hình mặc định
const createApiRequest = (url, options = {}) => {
    const defaultOptions = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    };

    return fetch(url, defaultOptions);
};

// Utility function để tạo FormData cho slider
const createSliderFormData = (sliderData, productId, imageFile) => {
    const formData = new FormData();

    formData.append("slidervModel.Title", sliderData.title || "");
    formData.append("slidervModel.Description", sliderData.description || "");
    if (sliderData.linkUrl) {
        formData.append("slidervModel.LinkUrl", sliderData.linkUrl);
    }
    formData.append("slidervModel.IsPoster", sliderData.isPoster?.toString() || "true");
    if (sliderData.position) {
        formData.append("slidervModel.Position", sliderData.position);
    }
    formData.append("slidervModel.DisplayOrder", sliderData.displayOrder?.toString() || "0");
    if (productId) {
        formData.append("slidervModel.ProductId", productId.toString());
    }
    if (sliderData.id) {
        formData.append("slidervModel.Id", sliderData.id.toString());
        formData.append("slidervModel.IsActive", sliderData.isActive?.toString() || "true");
    }
    if (imageFile) {
        formData.append("ImageFile", imageFile);
    }

    return formData;
};

// Utility function để xử lý slider operations
const processSliderOperation = async (slider, productId, method = "POST") => {
    const formData = createSliderFormData(slider, productId, slider.imageFile);

    const response = await fetch(`${API_BASE_URL}/Slider`, {
        method,
        credentials: "include",
        body: formData,
    });

    if (!response.ok) {
        const errorMessage = method === "PUT"
            ? `Failed to update slider with ID ${slider.id}`
            : "Failed to create slider";
        await handleApiError(response, errorMessage);
    }

    return await response.json();
};

// Utility function để tạo FormData cho ProductVariantImage
const createProductVariantImageFormData = (imageData, imageFile) => {
    console.log("🔧 [FormData] Creating ProductVariantImage FormData...");
    console.log("📝 Input imageData:", imageData);
    console.log("📁 Input imageFile:", imageFile ? { name: imageFile.name, size: imageFile.size, type: imageFile.type } : null);

    const formData = new FormData();

    // Thêm các trường dữ liệu bắt buộc
    formData.append("ProVarId", imageData.ProVarId?.toString() || "");
    console.log("✅ Added ProVarId:", imageData.ProVarId?.toString() || "");

    // Thêm các trường tùy chọn
    if (imageData.Id) {
        formData.append("Id", imageData.Id.toString());
        console.log("✅ Added Id:", imageData.Id.toString());
    }
    if (imageData.Attribute) {
        formData.append("Attribute", imageData.Attribute);
        console.log("✅ Added Attribute:", imageData.Attribute);
    }
    if (imageData.DisplayOrder !== undefined) {
        formData.append("DisplayOrder", imageData.DisplayOrder.toString());
        console.log("✅ Added DisplayOrder:", imageData.DisplayOrder.toString());
    }
    if (imageData.IsActive !== undefined) {
        formData.append("IsActive", imageData.IsActive.toString());
        console.log("✅ Added IsActive:", imageData.IsActive.toString());
    }

    // Thêm file ảnh nếu có
    if (imageFile) {
        formData.append("imageFile", imageFile);
        console.log("✅ Added imageFile:", imageFile.name);
    } else {
        console.log("⚠️ No imageFile provided");
    }

    console.log("🔧 FormData creation completed");
    return formData;
};// [2.1] API lấy tất cả danh sách sản phẩm
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

        const response = await createApiRequest(`${API_BASE_URL}/Product?${params.toString()}`, {
            method: "GET",
        });

        if (!response.ok) {
            await handleApiError(response, "Failed to fetch products");
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
        const response = await createApiRequest(`${API_BASE_URL}/Product/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            await handleApiError(response, `Failed to fetch product with ID ${id}`);
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

        // Bước 1.5: Kiểm tra và chuẩn hóa ProductVariants (tương tự updateProduct)
        if (productData.ProductVariants && Array.isArray(productData.ProductVariants)) {
            productData.ProductVariants = productData.ProductVariants.map((variant, index) => {
                // Validation cho biến thể mới
                if (variant.OriginalPrice === undefined || variant.OriginalPrice < 0) {
                    throw new Error(`Original price is required and cannot be negative for variant at index ${index}`);
                }
                if (variant.DiscountedPrice && variant.DiscountedPrice < 0) {
                    throw new Error(`Discounted price cannot be negative for variant at index ${index}`);
                }
                if (variant.StockQty === undefined || variant.StockQty < 0) {
                    throw new Error(`Stock quantity is required and cannot be negative for variant at index ${index}`);
                }
                if (variant.ColorId && (!Number.isInteger(variant.ColorId) || variant.ColorId <= 0)) {
                    throw new Error(`Valid ColorId is required for variant at index ${index}`);
                }
                if (variant.SizeId && (!Number.isInteger(variant.SizeId) || variant.SizeId <= 0)) {
                    throw new Error(`Valid SizeId is required for variant at index ${index}`);
                }
                if (variant.MaterialId && (!Number.isInteger(variant.MaterialId) || variant.MaterialId <= 0)) {
                    throw new Error(`Valid MaterialId is required for variant at index ${index}`);
                }
                if (variant.UnitId && (!Number.isInteger(variant.UnitId) || variant.UnitId <= 0)) {
                    throw new Error(`Valid UnitId is required for variant at index ${index}`);
                }

                return {
                    OriginalPrice: Number(variant.OriginalPrice),
                    DiscountedPrice: variant.DiscountedPrice ? Number(variant.DiscountedPrice) : null,
                    StockQty: Number(variant.StockQty),
                    ColorId: variant.ColorId ? Number(variant.ColorId) : null,
                    SizeId: variant.SizeId ? Number(variant.SizeId) : null,
                    MaterialId: variant.MaterialId ? Number(variant.MaterialId) : null,
                    UnitId: variant.UnitId ? Number(variant.UnitId) : null,
                    IsActive: variant.IsActive !== undefined ? variant.IsActive : true,
                };
            });
        }

        // Bước 2: Gửi request tạo sản phẩm
        // Debug: Log dữ liệu trước khi gửi
        console.log("Creating product with data:", productData);

        // Send data directly to the API
        const response = await createApiRequest(`${API_BASE_URL}/Product`, {
            method: "POST",
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            await handleApiError(response, "Failed to create product");
        }

        const createdProduct = await response.json();
        const productId = createdProduct?.data?.productId;
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
                try {
                    // Sử dụng utility function để tạo slider
                    const sliderWithTitle = {
                        ...slider,
                        title: slider.title || `${productData.ProductName} ${formatSliderIndex(sliderIndex)}`
                    };
                    const sliderData = await processSliderOperation(sliderWithTitle, productId, "POST");
                    sliderResults.push({ success: true, data: sliderData });
                    sliderIndex++; // Tăng biến đếm lên sau khi tạo thành công slider
                } catch (error) {
                    console.warn(`Warning: ${error.message}`);
                    sliderResults.push({ success: false, message: error.message });
                    continue; // Tiếp tục với slider tiếp theo thay vì dừng
                }
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
        // Debug: Log dữ liệu trước khi gửi
        console.log("Updating product with data:", productData);

        // Send data directly to the API
        const response = await createApiRequest(`${API_BASE_URL}/Product`, {
            method: "PUT",
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            await handleApiError(response, "Failed to update product");
        }

        const updatedProduct = await response.json();

        // Bước 4: Cập nhật hoặc tạo mới sliders tuần tự
        const sliderResults = [];
        for (const slider of sliders || []) {
            try {
                const sliderWithProductName = {
                    ...slider,
                    title: slider.title || productData.ProductName
                };

                if (slider.id) {
                    // Bước 5: Cập nhật slider hiện có
                    const sliderData = await processSliderOperation(sliderWithProductName, productData.Id, "PUT");
                    sliderResults.push({ success: true, data: sliderData });
                } else if (slider.imageFile) {
                    // Bước 6: Tạo mới slider
                    const sliderData = await processSliderOperation(sliderWithProductName, productData.Id, "POST");
                    sliderResults.push({ success: true, data: sliderData });
                }
            } catch (error) {
                console.warn(`Warning: ${error.message}`);
                sliderResults.push({ success: false, message: error.message });
                continue;
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
        const response = await createApiRequest(`${API_BASE_URL}/Product/${id}`, {
            method: "DELETE",
            headers: {},
        });

        if (!response.ok) {
            await handleApiError(response, `Failed to delete product with ID ${id}`);
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

        const response = await createApiRequest(`${API_BASE_URL}/Product/variant`, {
            method: "PUT",
            body: JSON.stringify(variantData),
        });

        if (!response.ok) {
            await handleApiError(response, "Failed to update product variant");
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
        const response = await createApiRequest(`${API_BASE_URL}/Slider`, {
            method: "GET",
        });

        if (!response.ok) {
            await handleApiError(response, "Failed to fetch sliders");
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
        const response = await createApiRequest(`${API_BASE_URL}/Slider/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            await handleApiError(response, `Failed to fetch slider with ID ${id}`);
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
        if (!sliderData.title) {
            throw new Error("Slider title is required");
        }
        if (!imageFile) {
            throw new Error("Image file is required");
        }

        const formData = createSliderFormData(
            {
                ...sliderData,
                linkUrl: sliderData.linkUrl || "/",
                position: sliderData.position || "Home Page",
            },
            sliderData.productId,
            imageFile
        );

        const response = await fetch(`${API_BASE_URL}/Slider`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            await handleApiError(response, "Failed to create slider");
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
        if (!sliderData.id || sliderData.id <= 0) {
            throw new Error("Valid slider ID is required");
        }
        if (!sliderData.title) {
            throw new Error("Slider title is required");
        }

        const formData = createSliderFormData(
            {
                ...sliderData,
                linkUrl: sliderData.linkUrl || "/",
                position: sliderData.position || "Home Page",
            },
            sliderData.productId,
            imageFile
        );

        const response = await fetch(`${API_BASE_URL}/Slider`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            await handleApiError(response, "Failed to update slider");
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
        const response = await createApiRequest(`${API_BASE_URL}/Slider/${id}`, {
            method: "DELETE",
            headers: {},
        });

        if (!response.ok) {
            await handleApiError(response, `Failed to delete slider with ID ${id}`);
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
        const response = await createApiRequest(`${API_BASE_URL}/Product/variant/${id}`, {
            method: "DELETE",
            headers: {},
        });

        if (!response.ok) {
            await handleApiError(response, `Failed to delete Product Variant with ID ${id}`);
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
        const response = await createApiRequest(`${API_BASE_URL}/Product/variant/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            await handleApiError(response, `Failed to fetch Product variant with ID ${id}`);
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
        const response = await createApiRequest(`${API_BASE_URL}/Product/variant/check?${params.toString()}`, {
            method: "GET",
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

// ===== PRODUCT VARIANT IMAGE APIs =====

// [3.1] API lấy tất cả ảnh biến thể sản phẩm
export const getAllProductVariantImages = async () => {
    try {
        console.log("🔵 [ProductVariantImage] Fetching all variant images...");
        console.log("🌐 API URL:", `${API_BASE_URL}/ProductVariantImage`);

        const response = await createApiRequest(`${API_BASE_URL}/ProductVariantImage`, {
            method: "GET",
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error("❌ Response not OK, calling handleApiError...");
            await handleApiError(response, "Failed to fetch product variant images");
        }

        const result = await response.json();
        console.log("✅ Fetch all variant images success:", result);
        return result;
    } catch (error) {
        console.error("❌ Error fetching product variant images:", error.message);
        console.error("📊 Full error:", error);
        throw error;
    }
};

// [3.2] API lấy ảnh biến thể sản phẩm theo ID
export const getProductVariantImageById = async (id) => {
    try {
        const response = await createApiRequest(`${API_BASE_URL}/ProductVariantImage/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            await handleApiError(response, `Failed to fetch product variant image with ID ${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching product variant image with ID ${id}:`, error.message);
        throw error;
    }
};

// [3.3] API tạo ảnh biến thể sản phẩm
export const createProductVariantImage = async (imageData, imageFile) => {
    try {
        console.log("🔵 [ProductVariantImage] Creating new variant image...");
        console.log("📝 Image Data:", imageData);
        console.log("📁 Image File:", {
            name: imageFile?.name,
            size: imageFile?.size,
            type: imageFile?.type
        });

        // Validation dữ liệu đầu vào
        if (!imageData.ProVarId) {
            console.error("❌ ProVarId is missing:", imageData);
            throw new Error("ProVarId is required");
        }
        if (!imageFile) {
            console.error("❌ Image file is missing");
            throw new Error("Image file is required");
        }

        // Sử dụng utility function để tạo FormData
        const formData = createProductVariantImageFormData(imageData, imageFile);

        // Debug FormData contents
        console.log("📦 FormData contents:");
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, typeof value === 'object' && value instanceof File ?
                `File(${value.name}, ${value.size} bytes)` : value);
        }

        console.log("🌐 API URL:", `${API_BASE_URL}/ProductVariantImage`);

        const response = await fetch(`${API_BASE_URL}/ProductVariantImage`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error("❌ Response not OK, calling handleApiError...");
            await handleApiError(response, "Failed to create product variant image");
        }

        const result = await response.json();
        console.log("✅ Create variant image success:", result);
        return result;
    } catch (error) {
        console.error("❌ Error creating product variant image:", error.message);
        console.error("📊 Full error:", error);
        throw error;
    }
};

// [3.4] API cập nhật ảnh biến thể sản phẩm
export const updateProductVariantImage = async (imageData, imageFile) => {
    try {
        console.log("🔵 [ProductVariantImage] Updating variant image...");
        console.log("📝 Image Data:", imageData);
        console.log("📁 Image File:", imageFile ? {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type
        } : "No file (updating info only)");

        // Validation dữ liệu đầu vào
        if (!imageData.Id || imageData.Id <= 0) {
            console.error("❌ Invalid Id:", imageData.Id);
            throw new Error("Valid Id is required for updating product variant image");
        }
        if (!imageData.ProVarId) {
            console.error("❌ ProVarId is missing:", imageData);
            throw new Error("ProVarId is required");
        }

        // Sử dụng utility function để tạo FormData
        const formData = createProductVariantImageFormData(imageData, imageFile);

        // Debug FormData contents
        console.log("📦 FormData contents:");
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, typeof value === 'object' && value instanceof File ?
                `File(${value.name}, ${value.size} bytes)` : value);
        }

        console.log("🌐 API URL:", `${API_BASE_URL}/ProductVariantImage`);

        const response = await fetch(`${API_BASE_URL}/ProductVariantImage`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error("❌ Response not OK, calling handleApiError...");
            await handleApiError(response, "Failed to update product variant image");
        }

        const result = await response.json();
        console.log("✅ Update variant image success:", result);
        return result;
    } catch (error) {
        console.error("❌ Error updating product variant image:", error.message);
        console.error("📊 Full error:", error);
        throw error;
    }
};

// [3.5] API xóa ảnh biến thể sản phẩm
export const deleteProductVariantImage = async (id) => {
    try {
        console.log("🔵 [ProductVariantImage] Deleting variant image with ID:", id);

        if (!id || id <= 0) {
            console.error("❌ Invalid ID:", id);
            throw new Error("Valid ID is required for deleting product variant image");
        }

        console.log("🌐 API URL:", `${API_BASE_URL}/ProductVariantImage/${id}`);

        const response = await createApiRequest(`${API_BASE_URL}/ProductVariantImage/${id}`, {
            method: "DELETE",
            headers: {},
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error("❌ Response not OK, calling handleApiError...");
            await handleApiError(response, `Failed to delete product variant image with ID ${id}`);
        }

        const result = await response.json();
        console.log("✅ Delete variant image success:", result);
        return result;
    } catch (error) {
        console.error(`❌ Error deleting product variant image with ID ${id}:`, error.message);
        console.error("📊 Full error:", error);
        throw error;
    }
};
import { API_BASE_URL } from "../apiConfig";

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
        // Debug: Log dữ liệu trước khi gửi
        console.log("Creating product with data:", productData);

        // Send data directly to the API
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
                console.error("API Error Response:", errorData);
                // Handle validation errors
                if (errorData.errors) {
                    const validationErrors = Object.entries(errorData.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('; ');
                    errorMessage = `Validation errors: ${validationErrors}`;
                } else {
                    errorMessage = errorData.message || errorData.Message || errorData.title || errorMessage;
                }
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
        // Debug: Log dữ liệu trước khi gửi
        console.log("Updating product with data:", productData);

        // Send data directly to the API
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
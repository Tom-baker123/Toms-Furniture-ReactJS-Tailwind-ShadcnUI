import {
    TOKEN,
    GHN_BASE_URL,
    SHOP_ID,
    YOUR_SHOP_DISTRICT_ID,
    YOUR_SHOP_WARD_CODE,
    API_BASE_URL,
} from "../apiConfig";
export {
    TOKEN,
    GHN_BASE_URL,
    SHOP_ID,
    YOUR_SHOP_DISTRICT_ID,
    YOUR_SHOP_WARD_CODE,
    API_BASE_URL,
};

// Hàm gọi API dùng chung cho GHN
const apiRequest = async (url, { method = "GET", headers = {}, params = undefined, body = undefined } = {}) => {
    let fullUrl = url;
    if (params && typeof params === "object") {
        const query = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
        fullUrl += `?${query}`;
    }
    try {
        const response = await fetch(fullUrl, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Request failed: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("GHN API Error:", error);
        return { error: true, message: error.message || "An error occurred." };
    }
};

export const getProvinces = async () => {
    const data = await apiRequest(`${GHN_BASE_URL}/master-data/province`, {
        headers: { Token: TOKEN },
    });
    if (data.error) {
        console.error("Error lấy tỉnh:", data.message);
        return [];
    }
    return data.data || [];
};

export const getDistricts = async (provinceId) => {
    const data = await apiRequest(`${GHN_BASE_URL}/master-data/district`, {
        headers: { Token: TOKEN },
        params: { province_id: provinceId },
    });
    if (data.error) {
        console.error("Error lấy quận:", data.message);
        return [];
    }
    return data.data || [];
};

export const getWards = async (districtId) => {
    const data = await apiRequest(`${GHN_BASE_URL}/master-data/ward`, {
        headers: { Token: TOKEN },
        params: { district_id: districtId },
    });
    if (data.error) {
        console.error("Error lấy phường:", data.message);
        return [];
    }
    return data.data || [];
};

export const getAvailableServices = async (fromDistrictId, toDistrictId) => {
    const data = await apiRequest(`${GHN_BASE_URL}/v2/shipping-order/available-services`, {
        headers: { Token: TOKEN },
        params: {
            shop_id: SHOP_ID,
            from_district: fromDistrictId,
            to_district: toDistrictId,
        },
    });
    if (data.error) {
        console.error("Error lấy dịch vụ khả dụng:", data.message);
        return [];
    }
    return data.data || [];
};

export const calculateShippingFee = async (toDistrictId, toWardCode, items = [], serviceTypeId = 2) => {
    try {
        if (!items.length) throw new Error("Cart items trống");
        if (!Number(toDistrictId) || !toWardCode) throw new Error("Invalid district or ward code");

        const totalWeight = items.reduce((sum, item) => {
            const weight = item.productVariant?.weight || 300; // Giá trị mặc định 300g cho ghế
            return sum + weight * item.quantity;
        }, 0);
        const maxLength = Math.max(...items.map((item) => item.productVariant?.length || 10)); // Giá trị mặc định 10cm
        const maxWidth = Math.max(...items.map((item) => item.productVariant?.width || 10)); // Giá trị mặc định 10cm
        const totalHeight = items.reduce((sum, item) => {
            const height = item.productVariant?.height || 10; // Giá trị mặc định 10cm
            return sum + height * item.quantity;
        }, 0);

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

        const data = await apiRequest(`${GHN_BASE_URL}/v2/shipping-order/fee`, {
            method: "POST",
            headers: {
                Token: TOKEN,
                ShopId: SHOP_ID,
                "Content-Type": "application/json",
            },
            body: payload,
        });

        if (data.error) {
            throw new Error(data.message || "API returned error");
        }
        if (data.code === 200) {
            return data.data.total;
        } else {
            throw new Error(data.message || "API returned non-200 status");
        }
    } catch (error) {
        console.error("❌ Error khi tính phí vận chuyển:", {
            message: error.message,
            payload: {
                toDistrictId,
                toWardCode,
                items,
                serviceTypeId,
            },
        });
        return 0;
    }
};
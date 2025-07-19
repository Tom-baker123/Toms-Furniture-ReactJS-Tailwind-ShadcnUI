import axios from "axios";
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

        const totalWeight = items.reduce((sum, item) => sum + (item.sanPham.weight || 1000) * item.soLuong, 0);
        const maxLength = Math.max(...items.map((item) => item.sanPham.length || 20));
        const maxWidth = Math.max(...items.map((item) => item.sanPham.width || 20));
        const totalHeight = items.reduce((sum, item) => sum + (item.sanPham.height || 10) * item.soLuong, 0);

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
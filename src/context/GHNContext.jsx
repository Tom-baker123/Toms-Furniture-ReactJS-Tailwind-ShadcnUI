import React, { createContext, useContext, useState } from "react";
import { getProvinces, getDistricts, getWards, getAvailableServices, calculateShippingFee } from "../api/service/GHNService";
import useApiFetch from "../hooks/useApiFetch";

const GHNContext = createContext();

export const GHNProvider = ({ children }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [services, setServices] = useState([]);
    const [shippingFee, setShippingFee] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sử dụng useApiFetch cho các hàm gọi API
    const fetchData = useApiFetch(setLoading, setError, (data) => data);

    // Fetch provinces chỉ 1 lần
    const fetchProvinces = async () => {
        if (provinces.length > 0) return provinces;
        const result = await fetchData(getProvinces, "provinces", undefined, (res) => res);
        setProvinces(Array.isArray(result) ? result : []);
        return result;
    };

    // Fetch districts chỉ 1 lần cho mỗi provinceId
    const fetchDistricts = async (provinceId) => {
        if (districts.length > 0 && districts[0]?.province_id === provinceId) return districts;
        const result = await fetchData(getDistricts, "districts", provinceId, (res) => res);
        setDistricts(Array.isArray(result) ? result : []);
        return result;
    };

    // Fetch wards chỉ 1 lần cho mỗi districtId
    const fetchWards = async (districtId) => {
        if (wards.length > 0 && wards[0]?.district_id === districtId) return wards;
        const result = await fetchData(getWards, "wards", districtId, (res) => res);
        setWards(Array.isArray(result) ? result : []);
        return result;
    };

    // Fetch services chỉ 1 lần cho mỗi toDistrictId
    const fetchServices = async (toDistrictId) => {
        if (services.length > 0 && services[0]?.to_district === toDistrictId) return services;
        const result = await fetchData(
            (params) => getAvailableServices(params.fromDistrictId, params.toDistrictId),
            "services",
            { fromDistrictId: undefined, toDistrictId },
            (res) => res,
        );
        setServices(Array.isArray(result) ? result : []);
        return result;
    };

    // Fetch shippingFee chỉ 1 lần cho mỗi bộ params
    const fetchShippingFee = async (toDistrictId, toWardCode, items, serviceTypeId = 2) => {
        // Không cache shippingFee vì params có thể thay đổi liên tục
        const result = await fetchData(
            (params) => calculateShippingFee(params.toDistrictId, params.toWardCode, params.items, params.serviceTypeId),
            "shippingFee",
            { toDistrictId, toWardCode, items, serviceTypeId },
            (fee) => fee,
        );
        setShippingFee(Number(result) || 0);
        return result;
    };

    return (
        <GHNContext.Provider
            value={{
                provinces,
                districts,
                wards,
                services,
                shippingFee,
                loading,
                error,
                fetchProvinces,
                fetchDistricts,
                fetchWards,
                fetchServices,
                fetchShippingFee,
                setProvinces,
                setDistricts,
                setWards,
                setServices,
                setShippingFee,
            }}
        >
            {children}
        </GHNContext.Provider>
    );
};

export const useGHN = () => useContext(GHNContext);

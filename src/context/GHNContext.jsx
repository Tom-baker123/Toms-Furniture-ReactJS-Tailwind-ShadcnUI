import { createContext, useState, useEffect } from "react";
import { 
    getProvinces,
    getDistricts,
    getWards,
    getAvailableServices,
    calculateShippingFee,
    YOUR_SHOP_DISTRICT_ID,
 } from "@/api/service/GHNService";
import useApiFetch from "@/hooks/useApiFetch";

// Tạo Context cho GHN
export const GHNContext = createContext();

export const GHNProvider = ({ children }) => {
    const [state, setState] = useState({
        provinces: [],
        districts: [],
        wards: [],
        services: [],
        shippingFee: 0,
        loading: false,
        error: undefined,
    });

    const setLoading = (loading) => setState((prev) => ({ ...prev, loading }));
    const setError = (error) => setState((prev) => ({ ...prev, error }));

    // Sử dụng custom hook useApiFetch
    const fetchData = useApiFetch(setLoading, setError, setState);

    // Các hàm fetch sử dụng fetchData tổng quát
    const fetchProvinces = () => fetchData(getProvinces, "provinces");
    const fetchDistricts = (provinceId) => fetchData(getDistricts, "districts", provinceId);
    const fetchWards = (districtId) => fetchData(getWards, "wards", districtId);
    const fetchServices = (toDistrictId) =>
        fetchData(getAvailableServices, "services", { fromDistrictId: YOUR_SHOP_DISTRICT_ID, toDistrictId });
    const fetchShippingFee = (toDistrictId, toWardCode, items, serviceTypeId = 2) =>
        fetchData(
            calculateShippingFee,
            "shippingFee",
            [toDistrictId, toWardCode, items, serviceTypeId],
            (fee) => fee
        );

    // Tự động fetch provinces khi mount
    useEffect(() => {
        fetchProvinces();
    }, []);

    return (
        <GHNContext.Provider
            value={{
                provinces: state.provinces,
                districts: state.districts,
                wards: state.wards,
                services: state.services,
                shippingFee: state.shippingFee,
                loading: state.loading,
                error: state.error,
                fetchProvinces,
                fetchDistricts,
                fetchWards,
                fetchServices,
                fetchShippingFee,
            }}
        >
            {children}
        </GHNContext.Provider>
    );
};

export default GHNProvider;
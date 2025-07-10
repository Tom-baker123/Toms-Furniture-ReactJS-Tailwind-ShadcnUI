// AdminAPIContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import {
    getAllCategories,
    getAllBrands,
    getAllCountries,
    getAllSuppliers,
    getAllColors,
    getAllSizes,
    getAllMaterials,
    getAllUnits,
    getAllOrderStatuses,
} from "@/api/api";
import toast from "react-hot-toast";

// Tạo Context chung
export const AdminAPIContext = createContext();

// Provider để bọc các component cần dùng dữ liệu API
export const AdminAPIProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [countries, setCountries] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [units, setUnits] = useState([]);
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hàm fetch tất cả dữ liệu
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [categoriesData, brandsData, countriesData, suppliersData, colorsData, sizesData, materialsData, unitsData, orderStatusesData] =
                await Promise.all([
                    getAllCategories(),
                    getAllBrands(),
                    getAllCountries(),
                    getAllSuppliers(),
                    getAllColors(),
                    getAllSizes(),
                    getAllMaterials(),
                    getAllUnits(),
                    getAllOrderStatuses(),
                ]);
            setCategories(categoriesData);
            setBrands(brandsData);
            setCountries(countriesData);
            setSuppliers(suppliersData);
            setColors(colorsData);
            setSizes(sizesData);
            setMaterials(materialsData);
            setUnits(unitsData);
            setOrderStatuses(orderStatusesData);
        } catch (err) {
            setError(err.message);
            toast.error(`Error loading data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // Gọi API khi component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Hàm refetch để gọi lại API
    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return (
        <AdminAPIContext.Provider
            value={{
                categories,
                brands,
                countries,
                suppliers,
                colors,
                sizes,
                materials,
                units,
                orderStatuses,
                loading,
                error,
                refetch,
            }}
        >
            {children}
        </AdminAPIContext.Provider>
    );
};

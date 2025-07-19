import { createContext, useState, useEffect } from "react";
import {
    getAllCategories,
    getAllStoreInformations,
    getAllProducts,
    getAllColors,
    getAllUnits,
    getAllMaterials,
    getAllSizes,
    getAllCountries,
    getAllBrands,
    getAllSuppliers,
    getProductById,
} from "@/api/api";
import useApiFetch from "@/hooks/useApiFetch";

// Tạo Context chung cho ứng dụng
export const APIContext = createContext();

// Provider để bọc ứng dụng hoặc các component cần dùng danh mục và thông tin cửa hàng
export const APIProvider = ({ children }) => {
    const [state, setState] = useState({
        categories: undefined,
        storeInformation: undefined,
        products: undefined,
        product: undefined,
        colors: undefined,
        units: undefined,
        materials: undefined,
        sizes: undefined,
        countries: undefined,
        brands: undefined,
        suppliers: undefined,
        loading: false,
        error: undefined,
    });
    // Helper setters for each property
    const setLoading = (loading) => setState((prev) => ({ ...prev, loading }));
    const setError = (error) => setState((prev) => ({ ...prev, error }));

    // Sử dụng custom hook useApiFetch
    const fetchData = useApiFetch(setLoading, setError, setState);

    // Các hàm fetch sử dụng fetchData tổng quát (không dùng useCallback để tránh lặp vô hạn)
    const fetchCategories = () => fetchData(getAllCategories, "categories");
    const fetchStoreInformation = () => fetchData(getAllStoreInformations, "storeInformation", undefined, (res) => (res.length > 0 ? res[0] : null));
    const fetchProducts = (filters = {}) => {
        const filtersWithPagination = { pageNumber: 1, pageSize: 8, ...filters };
        return fetchData(getAllProducts, "products", filtersWithPagination);
    };
    const fetchProductById = (id) => fetchData(getProductById, "product", id);
    const fetchColors = () => fetchData(getAllColors, "colors");
    const fetchUnits = () => fetchData(getAllUnits, "units");
    const fetchMaterials = () => fetchData(getAllMaterials, "materials");
    const fetchSizes = () => fetchData(getAllSizes, "sizes");
    const fetchCountries = () => fetchData(getAllCountries, "countries");
    const fetchBrands = () => fetchData(getAllBrands, "brands");
    const fetchSuppliers = () => fetchData(getAllSuppliers, "suppliers");

    // Gọi API khi component mount
    // Chỉ gọi fetchProducts một lần khi mount
    const [didInit, setDidInit] = useState(false);
    useEffect(() => {
        if (!didInit) {
            fetchCategories();
            fetchStoreInformation();
            // fetchProducts({ pageNumber: 1, pageSize: 8 }); // Thêm pagination mặc định
            fetchProducts();
            fetchColors();
            fetchUnits();
            fetchMaterials();
            fetchSizes();
            fetchCountries();
            fetchBrands();
            fetchSuppliers();
            setDidInit(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [didInit]);

    // Hàm refetch chỉ gọi fetchProducts với filters
    const refetch = (filters = {}) => {
        fetchProducts(filters);
    };

    return (
        <APIContext.Provider
            value={{
                categories: state.categories,
                storeInformation: state.storeInformation,
                products: state.products,
                product: state.product,
                colors: state.colors,
                units: state.units,
                materials: state.materials,
                sizes: state.sizes,
                countries: state.countries,
                brands: state.brands,
                suppliers: state.suppliers,
                loading: state.loading,
                error: state.error,
                refetch,
                fetchProductById, // Thêm hàm fetchProductById vào context
            }}
        >
            {children}
        </APIContext.Provider>
    );
};

export default APIProvider;

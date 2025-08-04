import { createContext, useState, useEffect } from "react";
import {
    getAllCategories,
    getAllStoreInformations,
    getAllColors,
    getAllUnits,
    getAllMaterials,
    getAllSizes,
    getAllCountries,
    getAllBrands,
    getAllSuppliers,
} from "@/api/api";
import { getProductById } from "@/api/service/ProductService";
import { getAllProducts } from "@/api/service/ProductService";
import { getAllRoomTypes, getRoomTypeById } from "@/api/service/RoomTypeService";
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
        roomTypes: undefined,
        roomType: undefined,
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
        // Lấy tất cả sản phẩm mà không có phân trang
        const filtersWithoutPagination = { pageNumber: 1, pageSize: 1000, ...filters };
        return fetchData(getAllProducts, "products", filtersWithoutPagination);
    };
    const fetchProductById = (id) => fetchData(getProductById, "product", id);
    const fetchColors = () => fetchData(getAllColors, "colors");
    const fetchUnits = () => fetchData(getAllUnits, "units");
    const fetchMaterials = () => fetchData(getAllMaterials, "materials");
    const fetchSizes = () => fetchData(getAllSizes, "sizes");
    const fetchCountries = () => fetchData(getAllCountries, "countries");
    const fetchBrands = () => fetchData(getAllBrands, "brands");
    const fetchSuppliers = () => fetchData(getAllSuppliers, "suppliers");
    const fetchRoomTypes = () => fetchData(getAllRoomTypes, "roomTypes");
    const fetchRoomTypeById = (id) => fetchData(getRoomTypeById, "roomType", id);

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
            fetchRoomTypes();
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
                roomTypes: state.roomTypes,
                roomType: state.roomType,
                loading: state.loading,
                error: state.error,
                refetch,
                fetchCategories, // Thêm hàm fetchCategories vào context
                fetchProductById, // Thêm hàm fetchProductById vào context
                fetchRoomTypeById, // Thêm hàm fetchRoomTypeById vào context
            }}
        >
            {children}
        </APIContext.Provider>
    );
};

export default APIProvider;

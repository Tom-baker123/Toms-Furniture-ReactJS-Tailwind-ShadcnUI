import { createContext, useState, useEffect, useCallback } from "react";
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
} from "@/api/api";

// Tạo Context chung cho ứng dụng
export const APIContext = createContext();

// Provider để bọc ứng dụng hoặc các component cần dùng danh mục và thông tin cửa hàng
export const APIProvider = ({ children }) => {
    const [categories, setCategories] = useState(null);
    const [storeInformation, setStoreInformation] = useState(null); // State cho thông tin cửa hàng
    const [products, setProducts] = useState(null); // State cho thông tin cửa hàng
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State cho Colors, Units, Materials, Sizes, Countries, Brands, Suppliers
    const [colors, setColors] = useState(null);
    const [units, setUnits] = useState(null);
    const [materials, setMaterials] = useState(null);
    const [sizes, setSizes] = useState(null);
    const [countries, setCountries] = useState(null);
    const [brands, setBrands] = useState(null);
    const [suppliers, setSuppliers] = useState(null);

    // Hàm fetch danh mục
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllCategories();
            setCategories(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch thông tin cửa hàng
    const fetchStoreInformation = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllStoreInformations();
            // Lấy bản ghi đầu tiên nếu tồn tại
            setStoreInformation(response.length > 0 ? response[0] : null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch sản phẩm với hỗ trợ filter
    const fetchProducts = useCallback(async (filters = {}) => {
        // Trì hoãn setLoading để tránh lỗi render
        setTimeout(() => {
            setLoading(true);
            setError(null);
            getAllProducts(filters)
                .then((response) => {
                    setProducts(response);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 0);
    }, []);

    // Hàm fetch Colors
    const fetchColors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllColors();
            setColors(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch Units
    const fetchUnits = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllUnits();
            setUnits(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch Materials
    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllMaterials();
            setMaterials(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch Sizes
    const fetchSizes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllSizes();
            setSizes(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch Countries
    const fetchCountries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllCountries();
            setCountries(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch Brands
    const fetchBrands = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllBrands();
            setBrands(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch Suppliers
    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllSuppliers();
            setSuppliers(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Gọi API khi component mount
    useEffect(() => {
        fetchCategories();
        fetchStoreInformation();
        fetchProducts();
        fetchColors();
        fetchUnits();
        fetchMaterials();
        fetchSizes();
        fetchCountries();
        fetchBrands();
        fetchSuppliers();
    }, [
        fetchCategories,
        fetchStoreInformation,
        fetchProducts,
        fetchColors,
        fetchUnits,
        fetchMaterials,
        fetchSizes,
        fetchCountries,
        fetchBrands,
        fetchSuppliers,
    ]);

    // Hàm refetch chỉ gọi fetchProducts với filters
    const refetch = useCallback(
        (filters = {}) => {
            console.log("Refetch called with filters:", filters); // Debug
            fetchProducts(filters); // Chỉ gọi fetchProducts với filters
        },
        [fetchProducts],
    );

    return (
        <APIContext.Provider
            value={{ categories, storeInformation, products, colors, units, materials, sizes, countries, brands, suppliers, loading, error, refetch }}
        >
            {children}
        </APIContext.Provider>
    );
};

export default APIProvider;

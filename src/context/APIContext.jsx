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
    getProductById,
} from "@/api/api";

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
    const setCategories = (categories) => setState((prev) => ({ ...prev, categories }));
    const setStoreInformation = (storeInformation) => setState((prev) => ({ ...prev, storeInformation }));
    const setProducts = (products) => setState((prev) => ({ ...prev, products }));
    const setProduct = (product) => setState((prev) => ({ ...prev, product }));
    const setColors = (colors) => setState((prev) => ({ ...prev, colors }));
    const setUnits = (units) => setState((prev) => ({ ...prev, units }));
    const setMaterials = (materials) => setState((prev) => ({ ...prev, materials }));
    const setSizes = (sizes) => setState((prev) => ({ ...prev, sizes }));
    const setCountries = (countries) => setState((prev) => ({ ...prev, countries }));
    const setBrands = (brands) => setState((prev) => ({ ...prev, brands }));
    const setSuppliers = (suppliers) => setState((prev) => ({ ...prev, suppliers }));
    const setLoading = (loading) => setState((prev) => ({ ...prev, loading }));
    const setError = (error) => setState((prev) => ({ ...prev, error }));

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

    // Hàm fetch sản phẩm với hỗ trợ filter và pagination
    const fetchProducts = useCallback(async (filters = {}) => {
        // Trì hoãn setLoading để tránh lỗi render
        setTimeout(() => {
            setLoading(true);
            setError(null);

            // Thêm pagination parameters mặc định nếu không có
            const filtersWithPagination = {
                pageNumber: 1,
                pageSize: 8,
                ...filters,
            };

            getAllProducts(filtersWithPagination)
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

    // Hàm fetch sản phẩm theo ID
    const fetchProductById = useCallback(async (id) => {
        // Đặt trạng thái loading và xóa lỗi cũ
        setLoading(true);
        setError(null);
        try {
            const response = await getProductById(id); // Gọi API lấy sản phẩm theo ID
            setProduct(response); // Lưu dữ liệu sản phẩm vào state
            return response; // Trả về dữ liệu để component sử dụng nếu cần
        } catch (err) {
            setError(err.message); // Lưu lỗi nếu có
            throw err; // Ném lỗi để component xử lý
        } finally {
            setLoading(false); // Kết thúc trạng thái loading
        }
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
        fetchProducts({ pageNumber: 1, pageSize: 12 }); // Thêm pagination mặc định
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

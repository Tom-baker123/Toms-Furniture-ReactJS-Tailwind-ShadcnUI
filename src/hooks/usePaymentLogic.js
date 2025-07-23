import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getUserById } from "../api/api";

const usePaymentLogic = (contexts) => {
    const {
        provinces,
        districts,
        wards,
        shippingFee,
        error: ghnError,
        fetchProvinces,
        fetchDistricts,
        fetchWards,
        fetchShippingFee,
    } = contexts.ghn;

    const { authStatus } = contexts.auth;
    const { addAddress, fetchAddresses, addresses, loading, handleOrderPayment } = contexts.payment;
    const { cart, loading: cartLoading, error: cartError } = contexts.cart;

    // State variables
    const [user, setUser] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    // Thông tin người nhận cho guest
    const [customerInfo, setCustomerInfo] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        note: "",
    });
    
    // Phương thức thanh toán
    const [paymentMethod, setPaymentMethod] = useState("cod");

    // Validation errors
    const [validationErrors, setValidationErrors] = useState({});

    // Track image loading errors để tránh loop onError
    const [imageErrors, setImageErrors] = useState({});

    // Error cho đặt hàng
    const [orderError, setOrderError] = useState("");

    // State cho mã giảm giá
    const [promotionList, setPromotionList] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [promotionLoading, setPromotionLoading] = useState(false);
    const [promotionError, setPromotionError] = useState("");

    // Initialize data
    useEffect(() => {
        fetchProvinces();
        if (authStatus?.isAuthenticated && authStatus.userId) {
            getUserById(authStatus.userId).then((res) => {
                // Đảm bảo đồng bộ các trường với UserInfoForm
                setUser({
                    id: res.user.id,
                    userName: res.user.userName || "",
                    email: res.user.email || "",
                    gender: res.user.gender,
                    phoneNumber: res.user.phoneNumber || "",
                    userAddress: res.user.userAddress || "",
                    isActive: res.user.isActive,
                    createdDate: res.user.createdDate,
                    updatedDate: res.user.updatedDate,
                    roleName: res.user.roleName || "",
                });
            });
            fetchAddresses(authStatus.userId);
        }
    }, [authStatus]);

    // Lưu địa chỉ cho user đã đăng nhập
    const handleSaveAddress = async (formData) => {
        await addAddress(formData);
        fetchAddresses(authStatus.userId);
    };

    // Location change handlers
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        console.log("Selected Province ID:", provinceId, typeof provinceId);
        setSelectedProvince(provinceId);
        setSelectedDistrict("");
        setSelectedWard("");
        await fetchDistricts(provinceId);
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        console.log("Selected District ID:", districtId, typeof districtId);
        setSelectedDistrict(districtId);
        setSelectedWard("");
        await fetchWards(districtId);
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        console.log("Selected Ward Code:", wardCode, typeof wardCode);
        setSelectedWard(wardCode);
    };

    // Fetch shipping fee when location is selected
    useEffect(() => {
        if (selectedDistrict && selectedWard) {
            fetchShippingFee(selectedDistrict, selectedWard, cart);
        }
    }, [selectedDistrict, selectedWard]);

    // Xử lý thay đổi thông tin khách hàng
    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Xóa lỗi validation khi người dùng nhập lại
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!customerInfo.fullName.trim()) {
            errors.fullName = "Vui lòng nhập họ và tên";
        }

        if (!customerInfo.phone.trim()) {
            errors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone)) {
            errors.phone = "Số điện thoại không hợp lệ";
        }

        if (!customerInfo.email.trim()) {
            errors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            errors.email = "Email không hợp lệ";
        }

        if (!customerInfo.address.trim()) {
            errors.address = "Vui lòng nhập địa chỉ cụ thể";
        }

        if (!selectedProvince) {
            errors.province = "Vui lòng chọn tỉnh/thành phố";
        }

        if (!selectedDistrict) {
            errors.district = "Vui lòng chọn quận/huyện";
        }

        if (!selectedWard) {
            errors.ward = "Vui lòng chọn phường/xã";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Tính tổng tiền
    const calculateTotal = () => {
        const subtotal = cart.reduce((total, item) => {
            const price = item.productVariant?.discountedPrice ?? item.productVariant?.originalPrice ?? 0;
            return total + price * item.quantity;
        }, 0);

        return {
            subtotal,
            shippingFee,
            total: subtotal + shippingFee,
        };
    };

    // Lấy danh sách mã giảm giá hợp lệ khi subtotal hoặc shippingFee thay đổi
    useEffect(() => {
        const fetchPromotions = async () => {
            setPromotionLoading(true);
            setPromotionError("");
            try {
                // subtotal + shippingFee
                const { subtotal, shippingFee } = calculateTotal();
                const total = subtotal + shippingFee;
                // Gọi API lấy danh sách mã giảm giá hợp lệ
                const res = await import("../api/api").then((m) => m.getAllPromotions(total));
                setPromotionList(res || []);
            } catch (err) {
                setPromotionError("Không thể tải danh sách mã giảm giá.");
                setPromotionList([]);
            } finally {
                setPromotionLoading(false);
            }
        };
        // Chỉ gọi khi có sản phẩm trong giỏ hàng
        if (cart && cart.length > 0) {
            fetchPromotions();
        } else {
            setPromotionList([]);
        }
    }, [cart, shippingFee]);

    // Tính toán giảm giá (nếu có chọn mã)
    const getDiscountAmount = () => {
        if (!selectedPromotion) return 0;
        // Kiểm tra loại khuyến mãi
        if (selectedPromotion.promotionType?.promotionUnit === 0) {
            // Giảm theo số tiền cố định
            return Math.min(selectedPromotion.discountValue, selectedPromotion.maximumDiscountAmount || selectedPromotion.discountValue);
        } else if (selectedPromotion.promotionType?.promotionUnit === 1) {
            // Giảm theo phần trăm
            const { subtotal, shippingFee } = calculateTotal();
            const total = subtotal + shippingFee;
            const discount = (total * selectedPromotion.discountValue) / 100;
            return Math.min(discount, selectedPromotion.maximumDiscountAmount || discount);
        } else if (selectedPromotion.promotionType?.promotionUnit === 2) {
            // Free shipping
            return shippingFee;
        }
        return 0;
    };

    // Xử lý lỗi hình ảnh
    const handleImageError = (itemId) => {
        if (!imageErrors[itemId]) {
            setImageErrors((prev) => ({
                ...prev,
                [itemId]: true,
            }));
        }
    };

    // Xử lý đặt hàng
    const handlePlaceOrder = async () => {
        // Prevent double submit
        if (window.__orderProcessing) return;
        window.__orderProcessing = true;

        // Prepare orderDetails from cart
        const orderDetails = cart.map((item) => ({
            proVarId: item.productVariant?.id,
            quantity: item.quantity,
            price: item.productVariant?.discountedPrice ?? item.productVariant?.originalPrice ?? 0,
        }));

        // Prepare orderData in correct API format
        let orderData = {
            orderAddId: addresses && addresses.length > 0 ? addresses[0].id : null,
            paymentMethodId: paymentMethod,
            promotionId: selectedPromotion ? selectedPromotion.id : null,
            shippingPrice: shippingFee,
            note: customerInfo.note || "",
            orderDetails,
        };

        // If guest, get guestId from localStorage
        if (!authStatus?.isAuthenticated) {
            const guestId = localStorage.getItem("userGuestId");
            if (guestId && !isNaN(Number(guestId))) {
                orderData.userGuestId = Number(guestId);
            } else {
                setOrderError("You need to login or enter guest information to place an order.");
                window.__orderProcessing = false;
                return;
            }
        }

        try {
            setOrderError("");
            const response = await handleOrderPayment(orderData);
            // If payment method is vnpay and paymentUrl is returned, show toast and redirect
            // Sửa điều kiện để nhận cả số, chuỗi, hoặc 'vnpay' cho VNPAY
            const isVnpay = paymentMethod === "vnpay" || paymentMethod === 2 || paymentMethod === "2";
            if (isVnpay && response?.data?.paymentUrl) {
                toast.success("Redirecting to VNPAY payment page...");
                setTimeout(() => {
                    window.open(response.data.paymentUrl, "_self");
                }, 1000);
                window.__orderProcessing = false;
                return;
            }
            // Default: show success alert
            alert("Order placed successfully! Thank you for your purchase.");
        } catch (error) {
            console.error("Error placing order:", error);
            setOrderError(typeof error === "string" ? error : error?.message || "Order placement failed. Please try again.");
        }
        window.__orderProcessing = false;
    };

    const discountAmount = getDiscountAmount();
    const { subtotal, total } = calculateTotal();

    return {
        // State
        user,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        customerInfo,
        paymentMethod,
        setPaymentMethod,
        validationErrors,
        imageErrors,
        orderError,
        promotionList,
        selectedPromotion,
        setSelectedPromotion,
        promotionLoading,
        promotionError,
        discountAmount,
        subtotal,
        total,

        // Data from contexts
        provinces,
        districts,
        wards,
        shippingFee,
        ghnError,
        addresses,
        loading,
        cart,
        cartLoading,
        cartError,
        authStatus,

        // Handlers
        handleSaveAddress,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        handleCustomerInfoChange,
        handleImageError,
        handlePlaceOrder,
        validateForm,
    };
};

export default usePaymentLogic;

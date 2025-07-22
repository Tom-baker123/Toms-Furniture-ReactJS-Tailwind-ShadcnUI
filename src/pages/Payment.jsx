import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserguestForm from "../components/Home/Payment/UserguestForm";
import ShippingAddressForm from "../components/Home/Payment/ShippingAddressForm";
import SelectPaymentMethodForm from "../components/Home/Payment/SelectPaymentMethodForm";
import { useGHN } from "../context/GHNContext";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../context/PaymentContext";
import { getUserById } from "../api/api";
import UserInfoForm from "../components/Home/Payment/UserInfoForm";
import { useCart } from "../context/CartContext";

const Payment = () => {
    const { provinces, districts, wards, shippingFee, error: ghnError, fetchProvinces, fetchDistricts, fetchWards, fetchShippingFee } = useGHN();
    const { authStatus } = useAuth();
    const { addAddress, fetchAddresses, addresses, loading, handleOrderPayment } = usePayment();
    const { cart, loading: cartLoading, error: cartError } = useCart();
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

    // State cho mã giảm giá
    const [promotionList, setPromotionList] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [promotionLoading, setPromotionLoading] = useState(false);
    const [promotionError, setPromotionError] = useState("");

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

    const discountAmount = getDiscountAmount();

    // Xử lý đặt hàng
    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            return;
        }

        if (shippingFee === 0 && selectedDistrict && selectedWard) {
            setError("Chưa có phí vận chuyển. Vui lòng kiểm tra lại địa chỉ.");
            return;
        }

        try {
            // Chuẩn bị orderDetails từ cart
            const orderDetails = cart.map((item) => ({
                proVarId: item.productVariant?.id,
                quantity: item.quantity,
                price: item.productVariant?.discountedPrice ?? item.productVariant?.originalPrice ?? 0,
            }));

            // Chuẩn bị orderData đúng format API
            const orderData = {
                orderAddId: addresses && addresses.length > 0 ? addresses[0].id : null,
                paymentMethodId: paymentMethod,
                promotionId: selectedPromotion ? selectedPromotion.id : null,
                shippingPrice: shippingFee,
                note: customerInfo.note || "",
                orderDetails,
                userGuestId: !authStatus?.isAuthenticated ? null : undefined, // Nếu là guest thì truyền, còn user thì không
            };

            // Gọi API thanh toán
            const response = await handleOrderPayment(orderData);
            alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
        } catch (error) {
            console.error("Error placing order:", error);
            setError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
        }
    };

    const { subtotal, total } = calculateTotal();

    // Xử lý lỗi hình ảnh
    const handleImageError = (itemId) => {
        if (!imageErrors[itemId]) {
            setImageErrors((prev) => ({
                ...prev,
                [itemId]: true,
            }));
        }
    };

    return (
        <div className="container-custom lg:px-10 lg:py-5">
            <h1 className="mb-6 text-2xl font-bold">Check Out Page</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Phần thông tin đặt hàng */}
                <div className="space-y-6">
                    {/* Thông tin khách hàng */}
                    {authStatus?.isAuthenticated ? (
                        <UserInfoForm
                            user={user}
                            address={addresses && addresses.length > 0 ? addresses[0] : {}}
                            onSave={handleSaveAddress}
                            validationErrors={validationErrors}
                            loading={loading}
                            disabled={addresses && addresses.length > 0}
                        />
                    ) : (
                        <UserguestForm
                            customerInfo={customerInfo}
                            validationErrors={validationErrors}
                            handleCustomerInfoChange={handleCustomerInfoChange}
                        />
                    )}

                    <ShippingAddressForm
                        provinces={provinces}
                        districts={districts}
                        wards={wards}
                        selectedProvince={selectedProvince}
                        selectedDistrict={selectedDistrict}
                        selectedWard={selectedWard}
                        validationErrors={validationErrors}
                        handleProvinceChange={handleProvinceChange}
                        handleDistrictChange={handleDistrictChange}
                        handleWardChange={handleWardChange}
                    />

                    <SelectPaymentMethodForm
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />
                </div>

                {/* Phần tổng kết đơn hàng */}
                <div className="sticky top-6 h-fit space-y-6">
                    {/* Sản phẩm trong giỏ hàng */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Sản phẩm ({cart.length})</h2>
                        {cartLoading ? (
                            <div>Đang tải giỏ hàng...</div>
                        ) : cart.length === 0 ? (
                            <div>Giỏ hàng của bạn đang trống.</div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center space-x-4 border-b border-gray-200 pb-4 last:border-b-0"
                                    >
                                        <img
                                            src={
                                                imageErrors[item.id]
                                                    ? "/src/assets/product-image.jpg"
                                                    : item.productVariant?.images?.[0]?.imageUrl || "/src/assets/product-image.jpg"
                                            }
                                            alt={item.productName}
                                            className="h-16 w-16 rounded object-cover"
                                            onError={() => handleImageError(item.id)}
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium">{item.productName}</h3>
                                            <p className="text-sm text-gray-600">
                                                {(item.productVariant?.discountedPrice ?? item.productVariant?.originalPrice ?? 0).toLocaleString()}$
                                                x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {(
                                                    (item.productVariant?.discountedPrice ?? item.productVariant?.originalPrice ?? 0) * item.quantity
                                                ).toLocaleString()}
                                                $
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tổng kết */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Tổng kết đơn hàng</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-medium">{subtotal.toLocaleString()}$</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span className="font-medium">{shippingFee > 0 ? `${shippingFee.toLocaleString()}$` : "Chưa tính"}</span>
                            </div>

                            {/* Chọn mã giảm giá */}
                            <div className="flex flex-col gap-3">
                                <span className="text-gray-600">Mã giảm giá</span>
                                <div className="flex-1">
                                    {promotionLoading ? (
                                        <span>Đang tải...</span>
                                    ) : promotionError ? (
                                        <span className="text-sm text-red-500">{promotionError}</span>
                                    ) : (
                                        <select
                                            className="w-full rounded border px-2 py-1"
                                            value={selectedPromotion ? selectedPromotion.id : ""}
                                            onChange={(e) => {
                                                const promo = promotionList.find((p) => String(p.id) === e.target.value);
                                                setSelectedPromotion(promo || null);
                                            }}
                                        >
                                            <option value="">-- Không áp dụng --</option>
                                            {promotionList.map((promo) => (
                                                <option
                                                    key={promo.id}
                                                    value={promo.id}
                                                >
                                                    {promo.promotionCode} - {promo.promotionType?.promotionTypeName || ""} {promo.discountValue}
                                                    {promo.promotionType?.promotionUnit === 1
                                                        ? "%"
                                                        : promo.promotionType?.promotionUnit === 0
                                                          ? "$"
                                                          : ""}{" "}
                                                    (Đơn tối thiểu: {promo.orderMinimum}$)
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Hiển thị số tiền giảm */}
                            {selectedPromotion && discountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giảm giá</span>
                                    <span className="font-medium text-green-600">- {discountAmount.toLocaleString()}$</span>
                                </div>
                            )}

                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-600">{(total - discountAmount).toLocaleString()}$</span>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {(orderError || ghnError) && (
                            <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{orderError || ghnError}</div>
                        )}

                        {/* Nút đặt hàng */}
                        <button
                            onClick={async () => {
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
                            }}
                            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            Place Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;

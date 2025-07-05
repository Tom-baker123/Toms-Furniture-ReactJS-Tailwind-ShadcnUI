import React, { useEffect, useState } from "react";
import { getProvinces, getDistricts, getWards, getAvailableServices, calculateShippingFee, YOUR_SHOP_DISTRICT_ID } from "@/api/api";

const mockCartItems = [
    {
        id: 1,
        sanPham: {
            name: "Ghế sofa cao cấp",
            price: 15000000,
            image: "/public/img/Products/sofa-1.jpg",
            weight: 500,
            width: 30,
            length: 40,
            height: 20,
        },
        soLuong: 2,
    },
    {
        id: 2,
        sanPham: {
            name: "Bàn gỗ tự nhiên",
            price: 8500000,
            image: "/public/img/Products/table-1.jpg",
            weight: 2000,
            width: 50,
            length: 60,
            height: 30,
        },
        soLuong: 1,
    },
];

const Payment = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [shippingFee, setShippingFee] = useState(0);
    const [error, setError] = useState("");

    // Thông tin người nhận
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

    useEffect(() => {
        (async () => {
            const data = await getProvinces();
            setProvinces(data);
        })();
    }, []);

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setSelectedDistrict("");
        setSelectedWard("");
        setDistricts([]);
        setWards([]);
        setError("");

        const data = await getDistricts(provinceId);
        setDistricts(data);
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        console.log("Selected District ID:", districtId, typeof districtId);
        setSelectedDistrict(districtId);
        setSelectedWard("");
        setWards([]);
        setError("");

        const data = await getWards(districtId);
        setWards(data);
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        console.log("Selected Ward Code:", wardCode, typeof wardCode);
        setSelectedWard(wardCode);
        setError("");
    };

    useEffect(() => {
        const fetchFee = async () => {
            if (selectedDistrict && selectedWard) {
                try {
                    const services = await getAvailableServices(YOUR_SHOP_DISTRICT_ID, selectedDistrict);
                    if (services.length > 0) {
                        const fee = await calculateShippingFee(selectedDistrict, selectedWard, mockCartItems, services[0].service_type_id);
                        setShippingFee(fee);
                        setError("");
                    } else {
                        setError("No available shipping services for this route");
                        setShippingFee(0);
                    }
                } catch (err) {
                    setError("Failed to calculate shipping fee. Please try again.");
                    setShippingFee(0);
                }
            }
        };
        fetchFee();
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
        const subtotal = mockCartItems.reduce((total, item) => {
            return total + item.sanPham.price * item.soLuong;
        }, 0);

        return {
            subtotal,
            shippingFee,
            total: subtotal + shippingFee,
        };
    };

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
            const orderData = {
                customerInfo,
                shippingAddress: {
                    province: selectedProvince,
                    district: selectedDistrict,
                    ward: selectedWard,
                },
                items: mockCartItems,
                paymentMethod,
                shippingFee,
                total: calculateTotal().total,
            };

            console.log("Order data:", orderData);

            // Tại đây bạn có thể gọi API để tạo đơn hàng
            // const response = await createOrder(orderData);

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
        <div className="mx-auto max-w-6xl p-4">
            <h1 className="mb-6 text-2xl font-bold">Thanh toán</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Phần thông tin đặt hàng */}
                <div className="space-y-6">
                    {/* Thông tin khách hàng */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Thông tin khách hàng</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Họ và tên *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={customerInfo.fullName}
                                    onChange={handleCustomerInfoChange}
                                    className={`w-full rounded border px-3 py-2 ${validationErrors.fullName ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Nhập họ và tên"
                                />
                                {validationErrors.fullName && <span className="text-sm text-red-500">{validationErrors.fullName}</span>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={customerInfo.phone}
                                    onChange={handleCustomerInfoChange}
                                    className={`w-full rounded border px-3 py-2 ${validationErrors.phone ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Nhập số điện thoại"
                                />
                                {validationErrors.phone && <span className="text-sm text-red-500">{validationErrors.phone}</span>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={customerInfo.email}
                                    onChange={handleCustomerInfoChange}
                                    className={`w-full rounded border px-3 py-2 ${validationErrors.email ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Nhập email"
                                />
                                {validationErrors.email && <span className="text-sm text-red-500">{validationErrors.email}</span>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Địa chỉ cụ thể *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={customerInfo.address}
                                    onChange={handleCustomerInfoChange}
                                    className={`w-full rounded border px-3 py-2 ${validationErrors.address ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Số nhà, tên đường..."
                                />
                                {validationErrors.address && <span className="text-sm text-red-500">{validationErrors.address}</span>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Ghi chú</label>
                                <textarea
                                    name="note"
                                    value={customerInfo.note}
                                    onChange={handleCustomerInfoChange}
                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                    rows="3"
                                    placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Địa chỉ giao hàng */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Địa chỉ giao hàng</h2>

                        <div className="space-y-4">
                            {/* Province */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Tỉnh / Thành phố *</label>
                                <select
                                    value={selectedProvince}
                                    onChange={handleProvinceChange}
                                    className={`w-full rounded border px-3 py-2 ${validationErrors.province ? "border-red-500" : "border-gray-300"}`}
                                >
                                    <option value="">-- Chọn tỉnh --</option>
                                    {provinces.map((province) => (
                                        <option
                                            key={province.ProvinceID}
                                            value={province.ProvinceID}
                                        >
                                            {province.ProvinceName}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.province && <span className="text-sm text-red-500">{validationErrors.province}</span>}
                            </div>

                            {/* District */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Quận / Huyện *</label>
                                <select
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedProvince}
                                    className={`w-full rounded border px-3 py-2 ${validationErrors.district ? "border-red-500" : "border-gray-300"} ${!selectedProvince ? "bg-gray-100" : ""}`}
                                >
                                    <option value="">-- Chọn quận --</option>
                                    {districts.map((district) => (
                                        <option
                                            key={district.DistrictID}
                                            value={district.DistrictID}
                                        >
                                            {district.DistrictName}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.district && <span className="text-sm text-red-500">{validationErrors.district}</span>}
                            </div>

                            {/* Ward */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Phường / Xã *</label>
                                <select
                                    value={selectedWard}
                                    onChange={handleWardChange}
                                    disabled={!selectedDistrict}
                                    className={`w-full rounded border px-3 py-2 ${validationErrors.ward ? "border-red-500" : "border-gray-300"} ${!selectedDistrict ? "bg-gray-100" : ""}`}
                                >
                                    <option value="">-- Chọn phường --</option>
                                    {wards.map((ward) => (
                                        <option
                                            key={ward.WardCode}
                                            value={ward.WardCode}
                                        >
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.ward && <span className="text-sm text-red-500">{validationErrors.ward}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Phương thức thanh toán</h2>

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="cod"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === "cod"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label
                                    htmlFor="cod"
                                    className="ml-2 text-sm font-medium"
                                >
                                    Thanh toán khi nhận hàng (COD)
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="bank"
                                    name="paymentMethod"
                                    value="bank"
                                    checked={paymentMethod === "bank"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label
                                    htmlFor="bank"
                                    className="ml-2 text-sm font-medium"
                                >
                                    Chuyển khoản ngân hàng
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="momo"
                                    name="paymentMethod"
                                    value="momo"
                                    checked={paymentMethod === "momo"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label
                                    htmlFor="momo"
                                    className="ml-2 text-sm font-medium"
                                >
                                    Ví MoMo
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần tổng kết đơn hàng */}
                <div className="space-y-6">
                    {/* Sản phẩm trong giỏ hàng */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Sản phẩm ({mockCartItems.length})</h2>

                        <div className="space-y-4">
                            {mockCartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center space-x-4 border-b border-gray-200 pb-4 last:border-b-0"
                                >
                                    <img
                                        src={imageErrors[item.id] ? "/src/assets/product-image.jpg" : item.sanPham.image}
                                        alt={item.sanPham.name}
                                        className="h-16 w-16 rounded object-cover"
                                        onError={() => handleImageError(item.id)}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium">{item.sanPham.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {item.sanPham.price.toLocaleString()}₫ x {item.soLuong}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{(item.sanPham.price * item.soLuong).toLocaleString()}₫</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tổng kết */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Tổng kết đơn hàng</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-medium">{subtotal.toLocaleString()}₫</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span className="font-medium">{shippingFee > 0 ? `${shippingFee.toLocaleString()}₫` : "Chưa tính"}</span>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-600">{total.toLocaleString()}₫</span>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                        {/* Nút đặt hàng */}
                        <button
                            onClick={handlePlaceOrder}
                            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            Đặt hàng ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;

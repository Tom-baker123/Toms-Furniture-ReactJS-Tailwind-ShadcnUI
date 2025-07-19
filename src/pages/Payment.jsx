import React, { useEffect, useState } from "react";
import UserguestForm from "../components/Home/Payment/UserguestForm";
import ShippingAddressForm from "../components/Home/Payment/ShippingAddressForm";
import PaymentMethodForm from "../components/Home/Payment/PaymentMethodForm";
import { useGHN } from "../context/GHNContext";

const mockCartItems = [
    {
        id: 1,
        sanPham: {
            name: "Ghế sofa cao cấp",
            price: 15000000,
            image: "/img/Products/sofa-1.jpg",
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
            image: "/img/Products/table-1.jpg",
            weight: 2000,
            width: 50,
            length: 60,
            height: 30,
        },
        soLuong: 1,
    },
];

const Payment = () => {
    const { provinces, districts, wards, shippingFee, error, fetchProvinces, fetchDistricts, fetchWards, fetchShippingFee } = useGHN();
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

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
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
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
            fetchShippingFee(selectedDistrict, selectedWard, mockCartItems);
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
        <div className="container-custom lg:px-10 lg:py-5">
            <h1 className="mb-6 text-2xl font-bold">Payment</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Phần thông tin đặt hàng */}
                <div className="space-y-6">
                    {/* Thông tin khách hàng */}
                    <UserguestForm
                        customerInfo={customerInfo}
                        validationErrors={validationErrors}
                        handleCustomerInfoChange={handleCustomerInfoChange}
                    />

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

                    <PaymentMethodForm
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />
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

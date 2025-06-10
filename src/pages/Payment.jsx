import React, { useEffect, useState } from "react";
import { getProvinces, getDistricts, getWards, getAvailableServices, calculateShippingFee, YOUR_SHOP_DISTRICT_ID } from "@/api/api";

const mockCartItems = [
    {
        sanPham: { weight: 500, width: 30, length: 40, height: 20 },
        soLuong: 2,
    },
    // {
    //     sanPham: { weight: 2000, width: 50, length: 60, height: 30 },
    //     soLuong: 1,
    // },
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

    return (
        <div className="mx-auto max-w-xl space-y-4 p-4">
            <h2 className="text-xl font-bold">Thông tin giao hàng</h2>

            {/* Province */}
            <div>
                <label className="mb-1 block text-sm font-medium">Tỉnh / Thành phố</label>
                <select
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    className="w-full rounded border px-3 py-2"
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
            </div>

            {/* District */}
            <div>
                <label className="mb-1 block text-sm font-medium">Quận / Huyện</label>
                <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince}
                    className="w-full rounded border px-3 py-2"
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
            </div>

            {/* Ward */}
            <div>
                <label className="mb-1 block text-sm font-medium">Phường / Xã</label>
                <select
                    value={selectedWard}
                    onChange={handleWardChange}
                    disabled={!selectedDistrict}
                    className="w-full rounded border px-3 py-2"
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
            </div>

            {/* Error Message */}
            {error && <div className="mt-4 font-medium text-red-600">{error}</div>}

            {/* Shipping Fee */}
            {shippingFee > 0 && <div className="mt-4 font-medium text-green-600">Phí vận chuyển: {shippingFee.toLocaleString()}₫</div>}
        </div>
    );
};

export default Payment;

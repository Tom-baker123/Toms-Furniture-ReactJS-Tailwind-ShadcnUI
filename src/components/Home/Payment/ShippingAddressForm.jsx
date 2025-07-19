import React from "react";

const ShippingAddressForm = ({
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    validationErrors,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
}) => {
    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Địa chỉ giao hàng</h2>
            <div className="space-y-4">
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
    );
};

export default ShippingAddressForm;

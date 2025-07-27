import React from "react";
import { formatDropdownValue, parseDropdownValue } from "../../../lib/addressDropdownUtils";

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
                        value={selectedProvince || ""}
                        onChange={(e) => {
                            const { id, name } = parseDropdownValue(e.target.value);
                            console.log("Chọn tỉnh:", { id, name });
                            handleProvinceChange(id, name);
                        }}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.province ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">-- Chọn tỉnh --</option>
                        {provinces
                            .filter(
                                (province) =>
                                    ["Hà Nội 02", "Test - Alert - Tỉnh - 001", "Ngoc test", "Test"].indexOf(province.ProvinceName.trim()) === -1,
                            )
                            .map((province, index) => (
                                <option
                                    key={index}
                                    value={formatDropdownValue(province.ProvinceID, province.ProvinceName)}
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
                        value={selectedDistrict || ""}
                        onChange={(e) => {
                            const { id, name } = parseDropdownValue(e.target.value);
                            console.log("Chọn quận:", { id, name });
                            handleDistrictChange(id, name);
                        }}
                        disabled={!selectedProvince}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.district ? "border-red-500" : "border-gray-300"} ${!selectedProvince ? "bg-gray-100" : ""}`}
                    >
                        <option value="">-- Chọn quận --</option>
                        {districts.map((district) => (
                            <option
                                key={district.DistrictID}
                                value={formatDropdownValue(district.DistrictID, district.DistrictName)}
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
                        value={selectedWard || ""}
                        onChange={(e) => {
                            const { id, name } = parseDropdownValue(e.target.value);
                            console.log("Chọn phường:", { id, name });
                            handleWardChange(id, name);
                        }}
                        disabled={!selectedDistrict}
                        className={`w-full rounded border px-3 py-2 ${validationErrors.ward ? "border-red-500" : "border-gray-300"} ${!selectedDistrict ? "bg-gray-100" : ""}`}
                    >
                        <option value="">-- Chọn phường --</option>
                        {wards.map((ward) => (
                            <option
                                key={ward.WardCode}
                                value={formatDropdownValue(ward.WardCode, ward.WardName)}
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

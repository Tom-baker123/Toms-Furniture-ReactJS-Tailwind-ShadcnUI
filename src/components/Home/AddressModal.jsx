import React, { useState, useEffect, useRef } from "react";
import { formatDropdownValue, parseDropdownValue } from "../../lib/addressDropdownUtils";
import { X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useGHN } from "../../context/GHNContext";

const AddressModal = ({ open, onClose, onSave, editingAddress = null }) => {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef();

    // Chuẩn hóa dữ liệu khi edit (từ API về)
    const getDefaultValues = () => {
        if (editingAddress) {
            return {
                recipient: editingAddress.recipient || "",
                phoneNumber: editingAddress.phoneNumber || "",
                addressDetailRecipient: editingAddress.addressDetailRecipient || "",
                city: editingAddress.city || "",
                district: editingAddress.district || "",
                ward: editingAddress.ward || "",
                isDeafaultAddress: editingAddress.isDeafaultAddress || false,
            };
        }
        return {
            recipient: "",
            phoneNumber: "",
            addressDetailRecipient: "",
            city: "",
            district: "",
            ward: "",
            isDeafaultAddress: false,
            userId: 0,
        };
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control,
    } = useForm({
        defaultValues: getDefaultValues(),
    });

    // Quản lý hiển thị modal giống CartModal
    useEffect(() => {
        if (open) {
            const values = getDefaultValues();
            Object.keys(values).forEach((key) => setValue(key, values[key]));
        } else {
            reset(getDefaultValues());
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [open, editingAddress, setValue, reset]);
    // GHN API context
    const { provinces, districts, wards, fetchProvinces, fetchDistricts, fetchWards } = useGHN();
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    // Khi mở modal, fetch provinces nếu chưa có
    useEffect(() => {
        fetchProvinces();
    }, [fetchProvinces]);

    // Khi mở modal hoặc edit, đồng bộ giá trị combobox với giá trị trong form
    useEffect(() => {
        if (open) {
            const values = getDefaultValues();
            setSelectedProvince(values.city || "");
            setSelectedDistrict(values.district || "");
            setSelectedWard(values.ward || "");
        } else {
            setSelectedProvince("");
            setSelectedDistrict("");
            setSelectedWard("");
        }
    }, [open, editingAddress]);

    // Khi chọn tỉnh, fetch districts và đồng bộ cả state lẫn form (dùng ID)
    const handleProvinceChange = async (e) => {
        const value = e.target.value;
        const { id: provinceId } = parseDropdownValue(value);
        setSelectedProvince(value); // vẫn lưu id-name cho UI
        setSelectedDistrict("");
        setSelectedWard("");
        setValue("city", value, { shouldValidate: true });
        setValue("district", "", { shouldValidate: true });
        setValue("ward", "", { shouldValidate: true });
        if (provinceId) {
            await fetchDistricts(provinceId); // LUÔN truyền id dạng số
        }
    };

    // Khi chọn quận, fetch wards và đồng bộ cả state lẫn form (dùng ID)
    const handleDistrictChange = async (e) => {
        const value = e.target.value;
        const { id: districtId } = parseDropdownValue(value);
        setSelectedDistrict(value); // vẫn lưu id-name cho UI
        setSelectedWard("");
        setValue("district", value, { shouldValidate: true });
        setValue("ward", "", { shouldValidate: true });
        if (districtId) {
            await fetchWards(districtId); // LUÔN truyền id dạng số
        }
    };

    // Khi chọn phường, đồng bộ cả state lẫn form (dùng ID)
    const handleWardChange = (e) => {
        const value = e.target.value;
        setSelectedWard(value);
        setValue("ward", value, { shouldValidate: true });
    };

    // ĐỒNG BỘ GIÁ TRỊ COMBOBOX: Đã xử lý trong useEffect([open, editingAddress]) và các handleChange, không cần watch hook ở đây.

    // Đóng modal bằng phím ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    // Xử lý ngăn không cho scroll khi modal bật lên
    useEffect(() => {
        if (open) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
        return () => document.body.classList.remove("overflow-hidden");
    }, [open]);

    // Không cần normalize lại vì đã đúng API
    const onSubmit = (data) => {
        // Chuyển đổi giá trị dropdown về dạng ID
        const { id: cityCode, name: city } = parseDropdownValue(data.city || "");
        const { id: districtCode, name: district } = parseDropdownValue(data.district || "");
        const { id: wardCode, name: ward } = parseDropdownValue(data.ward || "");

        // Build object đúng chuẩn backend
        const addressPayload = {
            ...data,
            city,
            cityCode: cityCode ? Number(cityCode) : undefined,
            district,
            districtCode: districtCode ? Number(districtCode) : undefined,
            ward,
            wardCode: wardCode ? Number(wardCode) : undefined,
        };

        if (onSave) {
            onSave(addressPayload);
        }
        toast.success(editingAddress ? "Address updated successfully!" : "Address saved successfully!");
        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <>
            {/* Nền mờ */}
            <div
                className={cn(
                    "fixed inset-0 z-[9998] bg-black transition-opacity duration-300",
                    open ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0",
                )}
                onClick={handleClose}
            />
            {/* Panel trượt từ bên phải */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 z-[9999] flex h-screen w-full flex-col justify-between bg-white transition-transform duration-300 sm:w-3/4 md:w-[32rem]",
                    open ? "translate-x-0" : "translate-x-full",
                )}
            >
                {/* Topbar của modal */}
                <div className="bg-[#1D349A] px-[15px] py-3 text-center text-[15px] font-semibold text-white">
                    📍 {editingAddress ? "Edit Address" : "Add New Address"}
                </div>
                {/* Header */}
                <div className="flex justify-between border-b px-4 py-3 text-[20px] font-bold md:px-7 md:py-4 md:text-[16px] lg:text-2xl">
                    <h2 className="flex items-center gap-2">
                        <MapPin className="h-6 w-6" />
                        <span>{editingAddress ? "Edit Address" : "New Address"}</span>
                    </h2>
                    {/* Nút đóng */}
                    <button
                        className="hover-rotate cursor-pointer"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X className="h-7 w-7 stroke-3" />
                    </button>
                </div>
                {/* Form nhập địa chỉ */}
                <div className="flex-1 overflow-auto px-4 py-6 md:px-7">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Họ và tên người nhận */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Recipient *</label>
                            <input
                                {...register("recipient", { required: "Recipient is required" })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter recipient's name"
                            />
                            {errors.recipient && <p className="mt-1 text-sm text-red-500">{errors.recipient.message}</p>}
                        </div>
                        {/* Số điện thoại */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input
                                {...register("phoneNumber", { required: "Phone number is required" })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter phone number"
                            />
                            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>}
                        </div>
                        {/* Địa chỉ chi tiết */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Address Detail *</label>
                            <textarea
                                {...register("addressDetailRecipient", { required: "Address detail is required" })}
                                rows={3}
                                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter full address"
                            />
                            {errors.addressDetailRecipient && <p className="mt-1 text-sm text-red-500">{errors.addressDetailRecipient.message}</p>}
                        </div>
                        {/* Thành phố */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">City *</label>
                            <Controller
                                name="city"
                                control={control}
                                // rules={{ required: "City is required" }}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        value={field.value || ""}
                                        onChange={async (e) => {
                                            field.onChange(e);
                                            handleProvinceChange(e);
                                        }}
                                        className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${errors.city ? "border-red-500" : "border-gray-300"}`}
                                    >
                                        <option value="">-- Chọn tỉnh/thành phố --</option>

                                        {provinces
                                            .filter(
                                                (province) =>
                                                    ["Hà Nội 02", "Test - Alert - Tỉnh - 001", "Ngoc test", "Test"].indexOf(
                                                        province.ProvinceName.trim(),
                                                    ) === -1,
                                            )
                                            .map((province) => (
                                                <option
                                                    key={province.ProvinceID}
                                                    value={formatDropdownValue(province.ProvinceID, province.ProvinceName)}
                                                >
                                                    {province.ProvinceName}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
                        </div>
                        {/* Quận/Huyện */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">District *</label>
                            <Controller
                                name="district"
                                control={control}
                                // rules={{ required: "District is required" }}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        value={field.value || ""}
                                        onChange={async (e) => {
                                            field.onChange(e);
                                            handleDistrictChange(e);
                                        }}
                                        disabled={!selectedProvince}
                                        className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${errors.district ? "border-red-500" : "border-gray-300"} ${!selectedProvince ? "bg-gray-100" : ""}`}
                                    >
                                        <option value="">-- Chọn quận/huyện --</option>
                                        {districts.map((district) => (
                                            <option
                                                key={district.DistrictID}
                                                value={formatDropdownValue(district.DistrictID, district.DistrictName)}
                                            >
                                                {district.DistrictName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district.message}</p>}
                        </div>
                        {/* Phường/Xã */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Ward *</label>
                            <Controller
                                name="ward"
                                control={control}
                                // rules={{ required: "Ward is required" }}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleWardChange(e);
                                        }}
                                        disabled={!selectedDistrict}
                                        className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${errors.ward ? "border-red-500" : "border-gray-300"} ${!selectedDistrict ? "bg-gray-100" : ""}`}
                                    >
                                        <option value="">-- Chọn phường/xã --</option>
                                        {wards.map((ward) => (
                                            <option
                                                key={ward.WardCode}
                                                value={formatDropdownValue(ward.WardCode, ward.WardName)}
                                            >
                                                {ward.WardName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            {errors.ward && <p className="mt-1 text-sm text-red-500">{errors.ward.message}</p>}
                        </div>
                        {/* Checkbox địa chỉ mặc định */}
                        <div className="flex items-center">
                            <input
                                {...register("isDeafaultAddress")}
                                type="checkbox"
                                id="isDeafaultAddress"
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="isDeafaultAddress"
                                className="text-sm font-medium text-gray-700"
                            >
                                Set as default address
                            </label>
                        </div>
                    </form>
                </div>
                {/* Footer với nút hành động */}
                <div className="w-full border-t border-gray-200 bg-white p-4 md:p-6">
                    <div className="flex gap-3">
                        <ButtonHovCT
                            type="button"
                            onClick={handleClose}
                            className="flex-1 !font-bold"
                            bgColor="bg-gray-100"
                            hoverBgColor="bg-black"
                            textColor="text-black"
                            hoverTextColor="text-white"
                            border={false}
                        >
                            Cancel
                        </ButtonHovCT>
                        <ButtonHovCT
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            className="flex-1 !border-black"
                            bgColor="bg-black"
                            hoverBgColor="bg-white"
                            textColor="text-white"
                            hoverTextColor="text-black"
                        >
                            {editingAddress ? "Update Address" : "Save Address"}
                        </ButtonHovCT>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddressModal;

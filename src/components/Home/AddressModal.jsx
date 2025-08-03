import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useGHN } from "../../context/GHNContext";
import { normalizePhoneNumber, validatePhoneNumber } from "@/utils/phoneUtils";

const AddressModal = ({ open, onClose, onSave, editingAddress = null }) => {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef();

    // Chuẩn hóa dữ liệu khi edit (từ API về)
    const getDefaultValues = useCallback(() => {
        if (editingAddress) {
            return {
                recipient: editingAddress.recipient || "",
                phoneNumber: editingAddress.phoneNumber || "",
                addressDetailRecipient: editingAddress.addressDetailRecipient || "",
                city: editingAddress.city || "", // Chỉ lưu tên
                district: editingAddress.district || "", // Chỉ lưu tên
                ward: editingAddress.ward || "", // Chỉ lưu tên
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
    }, [editingAddress]);

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
            // Debug: log dữ liệu editingAddress
            console.log("🔍 AddressModal opened with editingAddress:", editingAddress);

            const values = getDefaultValues();
            console.log("🔍 Default values:", values);

            Object.keys(values).forEach((key) => setValue(key, values[key]));
        } else {
            reset();
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [open, editingAddress]);
    // GHN API context
    const { provinces, districts, wards, fetchProvinces, fetchDistricts, fetchWards } = useGHN();
    // State để lưu ID được chọn
    const [selectedProvinceId, setSelectedProvinceId] = useState("");
    const [selectedDistrictId, setSelectedDistrictId] = useState("");
    const [selectedWardId, setSelectedWardId] = useState("");

    // Khi mở modal, fetch provinces nếu chưa có
    useEffect(() => {
        if (open) {
            fetchProvinces();
        }
    }, [open]);

    // Khi mở modal hoặc edit, đồng bộ giá trị combobox với giá trị trong form
    useEffect(() => {
        if (open) {
            const values = getDefaultValues();
            console.log("🔍 Setting combobox values:", {
                city: values.city,
                district: values.district,
                ward: values.ward,
            });

            // Nếu đang edit, lưu lại ID để gửi về API
            if (editingAddress) {
                setSelectedProvinceId(editingAddress.cityCode || "");
                setSelectedDistrictId(editingAddress.districtCode || "");
                setSelectedWardId(editingAddress.wardCode || "");
            }
        } else {
            setSelectedProvinceId("");
            setSelectedDistrictId("");
            setSelectedWardId("");
        }
    }, [open, editingAddress]);

    // Tách riêng useEffect để fetch districts/wards khi edit
    useEffect(() => {
        if (open && editingAddress && editingAddress.cityCode) {
            console.log("🔍 Fetching districts for cityCode:", editingAddress.cityCode);
            fetchDistricts(editingAddress.cityCode);
        }
    }, [open, editingAddress?.cityCode]);

    useEffect(() => {
        if (open && editingAddress && editingAddress.districtCode) {
            console.log("🔍 Fetching wards for districtCode:", editingAddress.districtCode);
            fetchWards(editingAddress.districtCode);
        }
    }, [open, editingAddress?.districtCode]);

    // Khi chọn tỉnh, fetch districts và đồng bộ cả state lẫn form
    const handleProvinceChange = useCallback(
        async (e) => {
            const selectedOption = e.target.selectedOptions[0];
            const provinceName = selectedOption.text;
            const provinceId = selectedOption.getAttribute("data-id");

            setSelectedProvinceId(provinceId);
            setSelectedDistrictId("");
            setSelectedWardId("");
            setValue("city", provinceName, { shouldValidate: true });
            setValue("district", "", { shouldValidate: true });
            setValue("ward", "", { shouldValidate: true });

            if (provinceId) {
                await fetchDistricts(provinceId);
            }
        },
        [setValue, fetchDistricts],
    );

    // Khi chọn quận, fetch wards và đồng bộ cả state lẫn form
    const handleDistrictChange = useCallback(
        async (e) => {
            const selectedOption = e.target.selectedOptions[0];
            const districtName = selectedOption.text;
            const districtId = selectedOption.getAttribute("data-id");

            setSelectedDistrictId(districtId);
            setSelectedWardId("");
            setValue("district", districtName, { shouldValidate: true });
            setValue("ward", "", { shouldValidate: true });

            if (districtId) {
                await fetchWards(districtId);
            }
        },
        [setValue, fetchWards],
    );

    // Khi chọn phường, đồng bộ cả state lẫn form
    const handleWardChange = useCallback(
        (e) => {
            const selectedOption = e.target.selectedOptions[0];
            const wardName = selectedOption.text;
            const wardId = selectedOption.getAttribute("data-id");

            setSelectedWardId(wardId);
            setValue("ward", wardName, { shouldValidate: true });
        },
        [setValue],
    );

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

    // Submit form với ID thay vì parse từ dropdown value
    const onSubmit = useCallback(
        (data) => {
            // Chuẩn hóa số điện thoại trước khi gửi
            const normalizedPhoneNumber = data.phoneNumber ? normalizePhoneNumber(data.phoneNumber) : "";

            // Build object đúng chuẩn backend sử dụng ID đã lưu
            const addressPayload = {
                ...data,
                phoneNumber: normalizedPhoneNumber,
                city: data.city, // Tên tỉnh
                cityCode: selectedProvinceId ? Number(selectedProvinceId) : undefined,
                district: data.district, // Tên quận
                districtCode: selectedDistrictId ? Number(selectedDistrictId) : undefined,
                ward: data.ward, // Tên phường
                wardCode: selectedWardId ? Number(selectedWardId) : undefined,
            };

            if (onSave) {
                onSave(addressPayload);
            }
            toast.success(editingAddress ? "Cập nhật địa chỉ thành công!" : "Lưu địa chỉ thành công!");
            reset();
            onClose();
        },
        [editingAddress, onSave, reset, onClose, selectedProvinceId, selectedDistrictId, selectedWardId],
    );

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);

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
                    📍 {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                </div>
                {/* Header */}
                <div className="flex justify-between border-b px-4 py-3 text-[20px] font-bold md:px-7 md:py-4 md:text-[16px] lg:text-2xl">
                    <h2 className="flex items-center gap-2">
                        <MapPin className="h-6 w-6" />
                        <span>{editingAddress ? "Chỉnh sửa địa chỉ" : "Địa chỉ mới"}</span>
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Người nhận *</label>
                            <input
                                {...register("recipient", { required: "Tên người nhận là bắt buộc" })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Nhập tên người nhận"
                            />
                            {errors.recipient && <p className="mt-1 text-sm text-red-500">{errors.recipient.message}</p>}
                        </div>
                        {/* Số điện thoại */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Số điện thoại *</label>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                rules={{
                                    required: "Số điện thoại là bắt buộc",
                                    validate: (value) => {
                                        const error = validatePhoneNumber(value);
                                        return error ? error : true;
                                    },
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        onChange={(e) => {
                                            // Chuẩn hóa số điện thoại khi người dùng nhập
                                            const normalized = normalizePhoneNumber(e.target.value);
                                            field.onChange(normalized);
                                        }}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        placeholder="Nhập số điện thoại (VD: 0901234567, +84901234567)"
                                    />
                                )}
                            />
                            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>}
                        </div>
                        {/* Địa chỉ chi tiết */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Địa chỉ chi tiết *</label>
                            <textarea
                                {...register("addressDetailRecipient", { required: "Địa chỉ chi tiết là bắt buộc" })}
                                rows={3}
                                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Nhập địa chỉ đầy đủ"
                            />
                            {errors.addressDetailRecipient && <p className="mt-1 text-sm text-red-500">{errors.addressDetailRecipient.message}</p>}
                        </div>
                        {/* Thành phố */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Tỉnh/Thành phố *</label>
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
                                                    value={province.ProvinceName}
                                                    data-id={province.ProvinceID}
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Quận/Huyện *</label>
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
                                        disabled={!selectedProvinceId}
                                        className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${errors.district ? "border-red-500" : "border-gray-300"} ${!selectedProvinceId ? "bg-gray-100" : ""}`}
                                    >
                                        <option value="">-- Chọn quận/huyện --</option>
                                        {districts.map((district) => (
                                            <option
                                                key={district.DistrictID}
                                                value={district.DistrictName}
                                                data-id={district.DistrictID}
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Phường/Xã *</label>
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
                                        disabled={!selectedDistrictId}
                                        className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${errors.ward ? "border-red-500" : "border-gray-300"} ${!selectedDistrictId ? "bg-gray-100" : ""}`}
                                    >
                                        <option value="">-- Chọn phường/xã --</option>
                                        {wards.map((ward) => (
                                            <option
                                                key={ward.WardCode}
                                                value={ward.WardName}
                                                data-id={ward.WardCode}
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
                                Đặt làm địa chỉ mặc định
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
                            Hủy
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
                            {editingAddress ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
                        </ButtonHovCT>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddressModal;

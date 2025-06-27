import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createStoreInformation, updateStoreInformation, getAllStoreInformations } from "@/api/api";
import { MoveLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

// Component form để thêm hoặc sửa thông tin cửa hàng
const StoreInformationForm = () => {
    const navigate = useNavigate();
    const storeData = useLoaderData(); // Lấy dữ liệu từ loader
    const isEditing = !!storeData; // Kiểm tra xem có đang sửa hay không
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
    const [imagePreview, setImagePreview] = useState(storeData?.logo || null); // Preview logo

    // Khởi tạo form với react-hook-form
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  Id: storeData.id || 0,
                  StoreName: storeData.storeName || "",
                  StoreAddress: storeData.storeAddress || "",
                  PhoneNumber: storeData.phoneNumber || "",
                  Email: storeData.email || "",
                  LinkWebsite: storeData.linkWebsite || "",
                  Latitude: storeData.latitude != null ? storeData.latitude.toString() : "",
                  Longitude: storeData.longitude != null ? storeData.longitude.toString() : "",
                  OwnerName: storeData.ownerName || "",
                  BusinessType: storeData.businessType || "",
                  OperatingHours: storeData.operatingHours || "",
                  StoreDescription: storeData.storeDescription || "",
                  EstablishmentDate: storeData.establishmentDate ? new Date(storeData.establishmentDate).toISOString().split("T")[0] : "",
                  TaxId: storeData.taxId || "",
                  BranchCode: storeData.branchCode || "",
                  LinkSocialFacebook: storeData.linkSocialFacebook || "",
                  LinkSocialTwitter: storeData.linkSocialTwitter || "",
                  LinkSocialInstagram: storeData.linkSocialInstagram || "",
                  LinkSocialTiktok: storeData.linkSocialTiktok || "",
                  LinkSocialYoutube: storeData.linkSocialYoutube || "",
                  IsActive: storeData.isActive ?? true,
              }
            : {
                  StoreName: "",
                  StoreAddress: "",
                  PhoneNumber: "",
                  Email: "",
                  LinkWebsite: "",
                  Latitude: "",
                  Longitude: "",
                  OwnerName: "",
                  BusinessType: "",
                  OperatingHours: "",
                  StoreDescription: "",
                  EstablishmentDate: "",
                  TaxId: "",
                  BranchCode: "",
                  LinkSocialFacebook: "",
                  LinkSocialTwitter: "",
                  LinkSocialInstagram: "",
                  LinkSocialTiktok: "",
                  LinkSocialYoutube: "",
                  IsActive: true,
              },
    });

    // Cập nhật form khi dữ liệu thay đổi
    useEffect(() => {
        if (isEditing && storeData) {
            reset({
                Id: storeData.id,
                StoreName: storeData.storeName || "",
                StoreAddress: storeData.storeAddress || "",
                PhoneNumber: storeData.phoneNumber || "",
                Email: storeData.email || "",
                LinkWebsite: storeData.linkWebsite || "",
                Latitude: storeData.latitude != null ? storeData.latitude.toString() : "",
                Longitude: storeData.longitude != null ? storeData.longitude.toString() : "",
                OwnerName: storeData.ownerName || "",
                BusinessType: storeData.businessType || "",
                OperatingHours: storeData.operatingHours || "",
                StoreDescription: storeData.storeDescription || "",
                EstablishmentDate: storeData.establishmentDate ? new Date(storeData.establishmentDate).toISOString().split("T")[0] : "",
                TaxId: storeData.taxId || "",
                BranchCode: storeData.branchCode || "",
                LinkSocialFacebook: storeData.linkSocialFacebook || "",
                LinkSocialTwitter: storeData.linkSocialTwitter || "",
                LinkSocialInstagram: storeData.linkSocialInstagram || "",
                LinkSocialTiktok: storeData.linkSocialTiktok || "",
                LinkSocialYoutube: storeData.linkSocialYoutube || "",
                IsActive: storeData.isActive,
            });
            setImagePreview(storeData.logo);
        }
    }, [storeData, reset]);

    // Xử lý khi chọn file ảnh
    const handleImageChange = (e, onChange) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    // Xử lý submit form
    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            // Chuẩn hóa dữ liệu trước khi gửi
            const submitData = {
                ...data,
                Latitude: data.Latitude ? parseFloat(data.Latitude) : null,
                Longitude: data.Longitude ? parseFloat(data.Longitude) : null,
                TaxId: data.TaxId || null,
                BranchCode: data.BranchCode || null,
                EstablishmentDate: data.EstablishmentDate || null,
            };

            if (isEditing) {
                await updateStoreInformation(submitData, data.logoFile);
                toast.success("Store information updated successfully!");
            } else {
                await createStoreInformation(submitData, data.logoFile);
                toast.success("Store information created successfully!");
            }
            navigate("/admin/store_information");
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Form thêm/sửa thông tin cửa hàng */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    {/* Phần upload logo */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-4">
                        <div className="p-4 text-lg font-bold text-slate-800">
                            Store Logo <span className="text-lg text-gray-500">(optional)</span>
                        </div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <Controller
                                name="logoFile"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border bg-gray-50 p-2 transition outline-dashed hover:bg-gray-100">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-32 w-32 rounded object-cover"
                                            />
                                        ) : (
                                            <>
                                                <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                                <span className="text-sm text-gray-500">Select Image</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.gif,.webp"
                                            onChange={(e) => handleImageChange(e, onChange)}
                                        />
                                    </label>
                                )}
                            />
                        </div>
                    </div>
                    {/* Phần thông tin cửa hàng */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-8">
                        <div className="p-4 text-lg font-bold text-slate-800">Store Information</div>
                        <hr />
                        <div className="grid grid-cols-1 gap-5 px-4 py-4 md:grid-cols-2">
                            {/* Tên cửa hàng */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Store Name</p>
                                </span>
                                <Controller
                                    name="StoreName"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 100,
                                            message: "Store name must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.StoreName ? "border-red-500" : ""}`}
                                            placeholder="Enter store name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.StoreName && <p className="mt-1 text-sm text-red-500">{errors.StoreName.message}</p>}
                            </label>
                            {/* Địa chỉ */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Address</p>
                                </span>
                                <Controller
                                    name="StoreAddress"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 255,
                                            message: "Address must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.StoreAddress ? "border-red-500" : ""}`}
                                            placeholder="Enter store address"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.StoreAddress && <p className="mt-1 text-sm text-red-500">{errors.StoreAddress.message}</p>}
                            </label>
                            {/* Số điện thoại */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Phone Number</p>
                                </span>
                                <Controller
                                    name="PhoneNumber"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 20,
                                            message: "Phone number must be less than 20 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.PhoneNumber ? "border-red-500" : ""}`}
                                            placeholder="Enter phone number"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.PhoneNumber && <p className="mt-1 text-sm text-red-500">{errors.PhoneNumber.message}</p>}
                            </label>
                            {/* Email */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Email</p>
                                </span>
                                <Controller
                                    name="Email"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                            message: "Invalid email format",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Email must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="email"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Email ? "border-red-500" : ""}`}
                                            placeholder="Enter email"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.Email && <p className="mt-1 text-sm text-red-500">{errors.Email.message}</p>}
                            </label>
                            {/* Website */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Website</p>
                                </span>
                                <Controller
                                    name="LinkWebsite"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
                                            message: "Invalid website URL format",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Website URL must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.LinkWebsite ? "border-red-500" : ""}`}
                                            placeholder="Enter website URL"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.LinkWebsite && <p className="mt-1 text-sm text-red-500">{errors.LinkWebsite.message}</p>}
                            </label>
                            {/* Vĩ độ */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Latitude</p>
                                </span>
                                <Controller
                                    name="Latitude"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            value === "" || (parseFloat(value) >= -90 && parseFloat(value) <= 90) || "Latitude must be between -90 and 90",
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            step="any"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Latitude ? "border-red-500" : ""}`}
                                            placeholder="Enter latitude"
                                            {...field}
                                            value={field.value}
                                        />
                                    )}
                                />
                                {errors.Latitude && <p className="mt-1 text-sm text-red-500">{errors.Latitude.message}</p>}
                            </label>
                            {/* Kinh độ */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Longitude</p>
                                </span>
                                <Controller
                                    name="Longitude"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            value === "" || (parseFloat(value) >= -180 && parseFloat(value) <= 180) || "Longitude must be between -180 and 180",
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            step="any"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Longitude ? "border-red-500" : ""}`}
                                            placeholder="Enter longitude"
                                            {...field}
                                            value={field.value}
                                        />
                                    )}
                                />
                                {errors.Longitude && <p className="mt-1 text-sm text-red-500">{errors.Longitude.message}</p>}
                            </label>
                            {/* Chủ sở hữu */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Owner Name</p>
                                </span>
                                <Controller
                                    name="OwnerName"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 100,
                                            message: "Owner name must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.OwnerName ? "border-red-500" : ""}`}
                                            placeholder="Enter owner name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.OwnerName && <p className="mt-1 text-sm text-red-500">{errors.OwnerName.message}</p>}
                            </label>
                            {/* Loại hình kinh doanh */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Business Type</p>
                                    <span className="text-red-500">*</span>
                                </span>
                                <Controller
                                    name="BusinessType"
                                    control={control}
                                    rules={{
                                        required: "Business type is required",
                                        maxLength: {
                                            value: 100,
                                            message: "Business type must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.BusinessType ? "border-red-500" : ""}`}
                                            placeholder="Enter business type"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.BusinessType && <p className="mt-1 text-sm text-red-500">{errors.BusinessType.message}</p>}
                            </label>
                            {/* Giờ hoạt động */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Operating Hours</p>
                                </span>
                                <Controller
                                    name="OperatingHours"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 100,
                                            message: "Operating hours must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.OperatingHours ? "border-red-500" : ""}`}
                                            placeholder="Enter operating hours"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.OperatingHours && <p className="mt-1 text-sm text-red-500">{errors.OperatingHours.message}</p>}
                            </label>
                            {/* Mô tả cửa hàng */}
                            <label className="col-span-1 font-bold text-slate-500 md:col-span-2">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Store Description</p>
                                </span>
                                <Controller
                                    name="StoreDescription"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 1000,
                                            message: "Description must be less than 1000 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.StoreDescription ? "border-red-500" : ""}`}
                                            placeholder="Enter store description"
                                            rows="4"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.StoreDescription && <p className="mt-1 text-sm text-red-500">{errors.StoreDescription.message}</p>}
                            </label>
                            {/* Ngày thành lập */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Establishment Date</p>
                                </span>
                                <Controller
                                    name="EstablishmentDate"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="date"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.EstablishmentDate ? "border-red-500" : ""}`}
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    )}
                                />
                                {errors.EstablishmentDate && <p className="mt-1 text-sm text-red-500">{errors.EstablishmentDate.message}</p>}
                            </label>
                            {/* Mã số thuế */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Tax ID</p>
                                </span>
                                <Controller
                                    name="TaxId"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 50,
                                            message: "Tax ID must be less than 50 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.TaxId ? "border-red-500" : ""}`}
                                            placeholder="Enter tax ID"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.TaxId && <p className="mt-1 text-sm text-red-500">{errors.TaxId.message}</p>}
                            </label>
                            {/* Mã chi nhánh */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Branch Code</p>
                                </span>
                                <Controller
                                    name="BranchCode"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 50,
                                            message: "Branch code must be less than 50 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.BranchCode ? "border-red-500" : ""}`}
                                            placeholder="Enter branch code"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.BranchCode && <p className="mt-1 text-sm text-red-500">{errors.BranchCode.message}</p>}
                            </label>
                            {/* Facebook */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Facebook</p>
                                </span>
                                <Controller
                                    name="LinkSocialFacebook"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
                                            message: "Invalid Facebook URL format",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Facebook URL must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.LinkSocialFacebook ? "border-red-500" : ""}`}
                                            placeholder="Enter Facebook URL"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.LinkSocialFacebook && <p className="mt-1 text-sm text-red-500">{errors.LinkSocialFacebook.message}</p>}
                            </label>
                            {/* Twitter */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Twitter</p>
                                </span>
                                <Controller
                                    name="LinkSocialTwitter"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
                                            message: "Invalid Twitter URL format",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Twitter URL must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.LinkSocialTwitter ? "border-red-500" : ""}`}
                                            placeholder="Enter Twitter URL"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.LinkSocialTwitter && <p className="mt-1 text-sm text-red-500">{errors.LinkSocialTwitter.message}</p>}
                            </label>
                            {/* Instagram */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Instagram</p>
                                </span>
                                <Controller
                                    name="LinkSocialInstagram"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
                                            message: "Invalid Instagram URL format",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Instagram URL must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.LinkSocialInstagram ? "border-red-500" : ""}`}
                                            placeholder="Enter Instagram URL"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.LinkSocialInstagram && <p className="mt-1 text-sm text-red-500">{errors.LinkSocialInstagram.message}</p>}
                            </label>
                            {/* TikTok */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">TikTok</p>
                                </span>
                                <Controller
                                    name="LinkSocialTiktok"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
                                            message: "Invalid TikTok URL format",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "TikTok URL must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.LinkSocialTiktok ? "border-red-500" : ""}`}
                                            placeholder="Enter TikTok URL"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.LinkSocialTiktok && <p className="mt-1 text-sm text-red-500">{errors.LinkSocialTiktok.message}</p>}
                            </label>
                            {/* YouTube */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">YouTube</p>
                                </span>
                                <Controller
                                    name="LinkSocialYoutube"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
                                            message: "Invalid YouTube URL format",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "YouTube URL must be less than 255 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.LinkSocialYoutube ? "border-red-500" : ""}`}
                                            placeholder="Enter YouTube URL"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.LinkSocialYoutube && <p className="mt-1 text-sm text-red-500">{errors.LinkSocialYoutube.message}</p>}
                            </label>
                            {/* Trạng thái (chỉ hiển thị khi sửa) */}
                            {isEditing && (
                                <label className="font-bold text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <p className="text-md">Status</p>
                                    </span>
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                                {...field}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        )}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
                {/* Tiêu đề và nút submit */}
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">
                        {isEditing ? "Update Store Information" : "Add Store Information"}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreInformationForm;

// Loader để lấy dữ liệu thông tin cửa hàng
export const storeInformationLoader = async () => {
    try {
        const storeInformations = await getAllStoreInformations();
        // Lấy bản ghi đầu tiên nếu tồn tại
        return storeInformations.length > 0 ? storeInformations[0] : null;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin cửa hàng:", error.message);
        return null;
    }
};
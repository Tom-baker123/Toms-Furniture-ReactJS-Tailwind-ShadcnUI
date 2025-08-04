import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { getAllBanners, createBanner, updateBanner, deleteBanner } from "@/api/service/BannerService";
import { Image as ImageIcon, Edit, Trash2, Plus, Calendar, Link, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const BannerForm = () => {
    const [banners, setBanners] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageMobilePreview, setImageMobilePreview] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Khởi tạo form với react-hook-form
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            Title: "",
            Description: "",
            LinkUrl: "",
            StartDate: (() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1); // Ngày mai
                return tomorrow.toISOString().split("T")[0];
            })(),
            EndDate: (() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 8); // 8 ngày sau
                return nextWeek.toISOString().split("T")[0];
            })(),
            DisplayOrder: "",
            Position: "",
            IsActive: true,
            UserId: null,
        },
    });

    // Lấy danh sách banner khi component mount
    useEffect(() => {
        loadBanners();
    }, []);

    // Lấy danh sách banner từ API
    const loadBanners = async () => {
        try {
            setIsLoading(true);
            const response = await getAllBanners();
            setBanners(response);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách banner: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý khi chọn file ảnh
    const handleImageChange = (e, onChange, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    // Xử lý submit form
    const onSubmit = async (data) => {
        if (isLoading) return;

        // Validation ngày
        const startDate = new Date(data.StartDate);
        const endDate = new Date(data.EndDate);

        // Chỉ kiểm tra ngày bắt đầu không được ở quá khứ cho banner mới
        // Banner đang sửa có thể có ngày bắt đầu ở quá khứ (đang chạy)
        if (!selectedBanner) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);

            if (startDate < today) {
                toast.error("Ngày bắt đầu không thể ở quá khứ");
                return;
            }
        }

        if (endDate <= startDate) {
            toast.error("Ngày kết thúc phải sau ngày bắt đầu");
            return;
        }

        setIsLoading(true);
        try {
            const submitData = {
                ...data,
                DisplayOrder: data.DisplayOrder ? parseInt(data.DisplayOrder) : null,
            };

            // Debug: Log data được gửi
            console.log("Submitting banner data:", submitData);
            console.log("Start Date:", data.StartDate);
            console.log("End Date:", data.EndDate);

            if (selectedBanner) {
                // Cập nhật banner
                submitData.Id = selectedBanner.id;
                await updateBanner(submitData, data.imageFile, data.imageFileMobile);
                toast.success("Cập nhật banner thành công!");
            } else {
                // Tạo banner mới
                await createBanner(submitData, data.imageFile, data.imageFileMobile);
                toast.success("Tạo banner thành công!");
            }

            // Reset form và reload danh sách
            resetForm();
            loadBanners();
        } catch (error) {
            toast.error(`Lỗi: ${error.message || "Có lỗi xảy ra"}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        const tomorrow = (() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            return date.toISOString().split("T")[0];
        })();
        const nextWeek = (() => {
            const date = new Date();
            date.setDate(date.getDate() + 8);
            return date.toISOString().split("T")[0];
        })();

        reset({
            Title: "",
            Description: "",
            LinkUrl: "",
            StartDate: tomorrow,
            EndDate: nextWeek,
            DisplayOrder: "",
            Position: "",
            IsActive: true,
            UserId: null,
        });
        setSelectedBanner(null);
        setImagePreview(null);
        setImageMobilePreview(null);
        setIsFormVisible(false);
    };

    // Xử lý chọn banner để sửa
    const handleEditBanner = (banner) => {
        setSelectedBanner(banner);
        setIsFormVisible(true);

        // Format date cho input date
        const formatDateForInput = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        reset({
            Title: banner.title || "",
            Description: banner.description || "",
            LinkUrl: banner.linkUrl || "",
            StartDate: formatDateForInput(banner.startDate),
            EndDate: formatDateForInput(banner.endDate),
            DisplayOrder: banner.displayOrder?.toString() || "",
            Position: banner.position || "",
            IsActive: banner.isActive ?? true,
            UserId: banner.userId,
        });
        setImagePreview(banner.imageUrl);
        setImageMobilePreview(banner.imageUrlmobile);
    };

    // Xử lý xóa banner
    const handleDeleteBanner = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa banner này?")) return;

        try {
            await deleteBanner(id);
            toast.success("Xóa banner thành công!");
            loadBanners();
            if (selectedBanner?.id === id) {
                resetForm();
            }
        } catch (error) {
            toast.error("Lỗi khi xóa banner: " + error.message);
        }
    };

    // Kiểm tra trạng thái banner
    const getBannerStatus = (banner) => {
        const now = new Date();
        const startDate = new Date(banner.startDate);
        const endDate = new Date(banner.endDate);

        if (!banner.isActive) {
            return { status: "inactive", text: "Tạm dừng", className: "bg-gray-100 text-gray-800" };
        } else if (now < startDate) {
            return { status: "upcoming", text: "Sắp tới", className: "bg-yellow-100 text-yellow-800" };
        } else if (now > endDate) {
            return { status: "expired", text: "Hết hạn", className: "bg-red-100 text-red-800" };
        } else {
            return { status: "active", text: "Hoạt động", className: "bg-green-100 text-green-800" };
        }
    };

    // Hiển thị form tạo mới
    const handleCreateNew = () => {
        resetForm();
        setIsFormVisible(true);
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Danh sách banner bên trái */}
            <div className="col-span-12 md:col-span-5">
                <div className="overflow-hidden rounded-sm bg-white shadow-xs">
                    <div className="flex items-center justify-between border-b p-4">
                        <h3 className="text-lg font-bold text-slate-800">Danh sách Banner</h3>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 rounded-sm bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Tạo mới
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-500">
                                <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                Đang tải danh sách banner...
                            </div>
                        ) : banners.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Chưa có banner nào</div>
                        ) : (
                            <div className="divide-y">
                                {banners.map((banner) => (
                                    <div
                                        key={banner.id}
                                        className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                                            selectedBanner?.id === banner.id ? "border-l-4 border-blue-500 bg-blue-50" : ""
                                        }`}
                                        onClick={() => handleEditBanner(banner)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.title}
                                                className="h-16 w-16 rounded object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate font-medium text-gray-900">{banner.title}</h4>
                                                <p className="mt-1 truncate text-sm text-gray-600">{banner.description || "Không có mô tả"}</p>
                                                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                                    {(() => {
                                                        const statusInfo = getBannerStatus(banner);
                                                        return (
                                                            <span className={`rounded-full px-2 py-1 ${statusInfo.className}`}>
                                                                {statusInfo.text}
                                                            </span>
                                                        );
                                                    })()}
                                                    <span>#{banner.displayOrder || "N/A"}</span>
                                                    <span>
                                                        {banner.startDate && new Date(banner.startDate).toLocaleDateString("vi-VN")}
                                                        {banner.endDate && ` - ${new Date(banner.endDate).toLocaleDateString("vi-VN")}`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditBanner(banner);
                                                    }}
                                                    className="rounded p-1 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteBanner(banner.id);
                                                    }}
                                                    className="rounded p-1 text-red-600 hover:bg-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Form thêm/sửa banner bên phải */}
            <div className="col-span-12 md:col-span-7">
                {isFormVisible ? (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Upload ảnh */}
                        <div className="overflow-hidden rounded-sm bg-white shadow-xs">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-bold text-slate-800">Hình ảnh Banner</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                                {/* Ảnh Desktop */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Ảnh Desktop <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="imageFile"
                                        control={control}
                                        rules={{ required: !selectedBanner && "Ảnh desktop là bắt buộc" }}
                                        render={({ field: { onChange } }) => (
                                            <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded border bg-gray-50 p-4 transition outline-dashed hover:bg-gray-100">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview Desktop"
                                                        className="h-32 w-full rounded object-cover"
                                                    />
                                                ) : (
                                                    <>
                                                        <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                                        <span className="text-sm text-gray-500">Chọn ảnh Desktop</span>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".jpg,.jpeg,.png,.gif,.webp"
                                                    onChange={(e) => handleImageChange(e, onChange, setImagePreview)}
                                                />
                                            </label>
                                        )}
                                    />
                                    {errors.imageFile && <p className="mt-1 text-sm text-red-500">{errors.imageFile.message}</p>}
                                </div>

                                {/* Ảnh Mobile */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Ảnh Mobile <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="imageFileMobile"
                                        control={control}
                                        rules={{ required: !selectedBanner && "Ảnh mobile là bắt buộc" }}
                                        render={({ field: { onChange } }) => (
                                            <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded border bg-gray-50 p-4 transition outline-dashed hover:bg-gray-100">
                                                {imageMobilePreview ? (
                                                    <img
                                                        src={imageMobilePreview}
                                                        alt="Preview Mobile"
                                                        className="h-32 w-full rounded object-cover"
                                                    />
                                                ) : (
                                                    <>
                                                        <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                                        <span className="text-sm text-gray-500">Chọn ảnh Mobile</span>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".jpg,.jpeg,.png,.gif,.webp"
                                                    onChange={(e) => handleImageChange(e, onChange, setImageMobilePreview)}
                                                />
                                            </label>
                                        )}
                                    />
                                    {errors.imageFileMobile && <p className="mt-1 text-sm text-red-500">{errors.imageFileMobile.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Thông tin banner */}
                        <div className="overflow-hidden rounded-sm bg-white shadow-xs">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-bold text-slate-800">{selectedBanner ? "Sửa Banner" : "Tạo Banner Mới"}</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                                {/* Tiêu đề */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="Title"
                                        control={control}
                                        rules={{ required: "Tiêu đề là bắt buộc" }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="text"
                                                className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="Nhập tiêu đề banner"
                                            />
                                        )}
                                    />
                                    {errors.Title && <p className="mt-1 text-sm text-red-500">{errors.Title.message}</p>}
                                </div>

                                {/* Mô tả */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Mô tả</label>
                                    <Controller
                                        name="Description"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                rows={3}
                                                className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="Nhập mô tả banner"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Link URL */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        <Link className="mr-1 inline h-4 w-4" />
                                        Link URL <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="LinkUrl"
                                        control={control}
                                        rules={{ required: "Link URL là bắt buộc" }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="url"
                                                className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="https://example.com"
                                            />
                                        )}
                                    />
                                    {errors.LinkUrl && <p className="mt-1 text-sm text-red-500">{errors.LinkUrl.message}</p>}
                                </div>

                                {/* Ngày bắt đầu */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        <Calendar className="mr-1 inline h-4 w-4" />
                                        Ngày bắt đầu <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="StartDate"
                                        control={control}
                                        rules={{ required: "Ngày bắt đầu là bắt buộc" }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="date"
                                                className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        )}
                                    />
                                    {errors.StartDate && <p className="mt-1 text-sm text-red-500">{errors.StartDate.message}</p>}
                                </div>

                                {/* Ngày kết thúc */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        <Calendar className="mr-1 inline h-4 w-4" />
                                        Ngày kết thúc <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="EndDate"
                                        control={control}
                                        rules={{ required: "Ngày kết thúc là bắt buộc" }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="date"
                                                className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        )}
                                    />
                                    {errors.EndDate && <p className="mt-1 text-sm text-red-500">{errors.EndDate.message}</p>}
                                </div>

                                {/* Thứ tự hiển thị */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Thứ tự hiển thị</label>
                                    <Controller
                                        name="DisplayOrder"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="number"
                                                min="1"
                                                className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="1"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Vị trí */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        <MapPin className="mr-1 inline h-4 w-4" />
                                        Vị trí
                                    </label>
                                    <Controller
                                        name="Position"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="">Chọn vị trí</option>
                                                <option value="top">Top</option>
                                                <option value="middle">Middle</option>
                                                <option value="bottom">Bottom</option>
                                                <option value="sidebar">Sidebar</option>
                                            </select>
                                        )}
                                    />
                                </div>

                                {/* Trạng thái hoạt động */}
                                <div className="md:col-span-2">
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Banner hoạt động</span>
                                            </label>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Nút action */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-sm border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="rounded-sm bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? "Đang xử lý..." : selectedBanner ? "Cập nhật" : "Tạo mới"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="rounded-sm bg-white p-8 text-center shadow-xs">
                        <ImageIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900">Quản lý Banner</h3>
                        <p className="mb-4 text-gray-600">Chọn một banner từ danh sách bên trái để chỉnh sửa hoặc tạo banner mới</p>
                        <button
                            onClick={handleCreateNew}
                            className="rounded-sm bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                            Tạo Banner Mới
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerForm;

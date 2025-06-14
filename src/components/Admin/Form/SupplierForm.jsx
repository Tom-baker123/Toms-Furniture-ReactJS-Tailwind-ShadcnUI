import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createSupplier, updateSupplier } from "@/api/api";
import { MoveLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

// Component form để thêm hoặc cập nhật nhà cung cấp
const SupplierForm = () => {
    const navigate = useNavigate();
    const supplierData = useLoaderData(); // Lấy dữ liệu nhà cung cấp từ loader (nếu chỉnh sửa)
    const isEditing = !!supplierData; // Kiểm tra xem đang chỉnh sửa hay tạo mới
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi gửi form

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  SupplierName: supplierData.supplierName || "",
                  ContactName: supplierData.contactName || "",
                  Email: supplierData.email || "",
                  PhoneNumber: supplierData.phoneNumber || "",
                  Notes: supplierData.notes || "",
                  TaxId: supplierData.taxId || "",
                  IsActive: supplierData.isActive || true,
              }
            : {
                  SupplierName: "",
                  ContactName: "",
                  Email: "",
                  PhoneNumber: "",
                  Notes: "",
                  TaxId: "",
                  IsActive: true,
              },
    });

    const [imagePreview, setImagePreview] = useState(supplierData?.imageUrl || null); // Preview hình ảnh
    const [imageFile, setImageFile] = useState(null); // File hình ảnh được chọn

    // Cập nhật form khi chỉnh sửa nhà cung cấp
    useEffect(() => {
        if (isEditing) {
            reset({
                SupplierName: supplierData.supplierName,
                ContactName: supplierData.contactName,
                Email: supplierData.email,
                PhoneNumber: supplierData.phoneNumber,
                Notes: supplierData.notes,
                TaxId: supplierData.taxId,
                IsActive: supplierData.isActive,
            });
            setImagePreview(supplierData.imageUrl);
        }
    }, [supplierData, reset]);

    // Xử lý thay đổi hình ảnh
    const handleImageChange = (e, onChange) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    // Xử lý gửi form
    const onSubmit = async (data) => {
        if (isLoading) return; // Ngăn gửi lại khi đang xử lý
        setIsLoading(true);
        try {
            if (isEditing) {
                await updateSupplier({ Id: supplierData.id, ...data }, imageFile);
                toast.success("Supplier updated successfully!"); // Thông báo thành công bằng tiếng Anh
            } else {
                await createSupplier(data, imageFile);
                toast.success("Supplier created successfully!"); // Thông báo thành công bằng tiếng Anh
            }
            navigate("/admin/suppliers");
        } catch (error) {
            toast.error(`Error: ${error.message}`); // Thông báo lỗi bằng tiếng Anh
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            {/* Nút quay lại */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/suppliers")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Back {/* Nhãn nút bằng tiếng Anh */}
                </button>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    {/* Phần upload hình ảnh */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-4">
                        <div className="p-4 text-lg font-bold text-slate-800">
                            Supplier Image <span className="text-lg text-gray-500">(optional)</span> {/* Nhãn bằng tiếng Anh */}
                        </div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <div>
                                <Controller
                                    name="imageFile"
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border bg-gray-50 p-2 transition outline-dashed hover:bg-gray-100">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <>
                                                    <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                                    <span className="text-sm text-gray-500">Select image</span> {/* Nhãn bằng tiếng Anh */}
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
                    </div>
                    {/* Phần thông tin nhà cung cấp */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-8">
                        <div className="p-4 text-lg font-bold text-slate-800">Supplier Information</div> {/* Nhãn bằng tiếng Anh */}
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            {/* Trường Tên nhà cung cấp */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Supplier Name</p> {/* Nhãn bằng tiếng Anh */}
                                </span>
                                <Controller
                                    name="SupplierName"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 100,
                                            message: "Supplier name must be less than 100 characters", // Lỗi bằng tiếng Anh
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.SupplierName ? "border-red-500" : ""}`}
                                            placeholder="Enter supplier name" // Placeholder bằng tiếng Anh
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.SupplierName && <p className="mt-1 text-sm text-red-500">{errors.SupplierName.message}</p>}
                            </label>
                            {/* Trường Người liên hệ */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Contact Name</p> {/* Nhãn bằng tiếng Anh */}
                                </span>
                                <Controller
                                    name="ContactName"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 100,
                                            message: "Contact name must be less than 100 characters", // Lỗi bằng tiếng Anh
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.ContactName ? "border-red-500" : ""}`}
                                            placeholder="Enter contact name" // Placeholder bằng tiếng Anh
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.ContactName && <p className="mt-1 text-sm text-red-500">{errors.ContactName.message}</p>}
                            </label>
                            {/* Trường Email */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Email</p> {/* Nhãn bằng tiếng Anh */}
                                </span>
                                <Controller
                                    name="Email"
                                    control={control}
                                    rules={{
                                        required: "Email is required", // Lỗi bằng tiếng Anh
                                        pattern: {
                                            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                            message: "Invalid email format", // Lỗi bằng tiếng Anh
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Email must be less than 255 characters", // Lỗi bằng tiếng Anh
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text" // Không dùng type="email" để bỏ validation HTML mặc định
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Email ? "border-red-500" : ""}`}
                                            placeholder="Enter email" // Placeholder bằng tiếng Anh
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.Email && <p className="mt-1 text-sm text-red-500">{errors.Email.message}</p>}
                            </label>
                            {/* Trường Số điện thoại */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Phone Number</p> {/* Nhãn bằng tiếng Anh */}
                                </span>
                                <Controller
                                    name="PhoneNumber"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: "Phone number must be exactly 10 digits", // Lỗi bằng tiếng Anh
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: "Phone number must be exactly 10 digits", // Lỗi bằng tiếng Anh
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text" // Không dùng type="tel" để bỏ validation HTML mặc định
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.PhoneNumber ? "border-red-500" : ""}`}
                                            placeholder="Enter phone number" // Placeholder bằng tiếng Anh
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.PhoneNumber && <p className="mt-1 text-sm text-red-500">{errors.PhoneNumber.message}</p>}
                            </label>
                            {/* Trường Mã số thuế */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Tax ID</p> {/* Nhãn bằng tiếng Anh */}
                                </span>
                                <Controller
                                    name="TaxId"
                                    control={control}
                                    rules={{
                                        required: "Tax ID is required", // Lỗi bằng tiếng Anh
                                        maxLength: {
                                            value: 50,
                                            message: "Tax ID must be less than 50 characters", // Lỗi bằng tiếng Anh
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.TaxId ? "border-red-500" : ""}`}
                                            placeholder="Enter tax ID" // Placeholder bằng tiếng Anh
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.TaxId && <p className="mt-1 text-sm text-red-500">{errors.TaxId.message}</p>}
                            </label>
                            {/* Trường Ghi chú */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Notes</p> {/* Nhãn bằng tiếng Anh */}
                                </span>
                                <Controller
                                    name="Notes"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 500,
                                            message: "Notes must be less than 500 characters", // Lỗi bằng tiếng Anh
                                        },
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Notes ? "border-red-500" : ""}`}
                                            placeholder="Enter notes" // Placeholder bằng tiếng Anh
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.Notes && <p className="mt-1 text-sm text-red-500">{errors.Notes.message}</p>}
                            </label>
                            {/* Trường Trạng thái (chỉ hiển thị khi chỉnh sửa) */}
                            {isEditing && (
                                <label className="font-bold text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <p className="text-md">Status</p> {/* Nhãn bằng tiếng Anh */}
                                    </span>
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                                {...field}
                                            >
                                                <option value={true}>Active</option> {/* Tùy chọn bằng tiếng Anh */}
                                                <option value={false}>Inactive</option>
                                            </select>
                                        )}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Supplier" : "Add New Supplier"}</div> {/* Tiêu đề bằng tiếng Anh */}
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Supplier"} {/* Nhãn nút bằng tiếng Anh */}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupplierForm;
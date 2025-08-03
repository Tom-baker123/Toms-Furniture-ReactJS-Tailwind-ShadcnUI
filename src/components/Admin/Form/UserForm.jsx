import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createUser, updateUser } from "@/api/api";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";
import { normalizePhoneNumber, validatePhoneNumber } from "@/utils/phoneUtils";

const UserForm = () => {
    const navigate = useNavigate();
    const userData = useLoaderData();
    const isEditing = !!userData?.user; // Kiểm tra chế độ sửa
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  UserName: userData.user.userName || "",
                  Email: userData.user.email || "",
                  Password: "", // Không điền sẵn mật khẩu khi sửa
                  Gender: userData.user.gender.toLowerCase() || "male",
                  PhoneNumber: userData.user.phoneNumber || "",
                  UserAddress: userData.user.userAddress || "",
                  IsActive: userData.user.isActive || true,
                  RoleId: userData.user.roleName === "Admin" ? "1" : "2", // Chuỗi vì select trả về chuỗi
              }
            : {
                  UserName: "",
                  Email: "",
                  Password: "",
                  Gender: "male",
                  PhoneNumber: "",
                  UserAddress: "",
                  IsActive: true,
                  RoleId: "2", // Chuỗi vì select trả về chuỗi
              },
    });

    useEffect(() => {
        if (isEditing && userData.user) {
            reset({
                UserName: userData.user.userName,
                Email: userData.user.email,
                Password: "",
                Gender: userData.user.gender.toLowerCase(),
                PhoneNumber: userData.user.phoneNumber,
                UserAddress: userData.user.userAddress,
                IsActive: userData.user.isActive,
                RoleId: userData.user.roleName === "Admin" ? "1" : "2",
            });
        }
    }, [userData, reset]);

    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            // Chuyển đổi dữ liệu form thành payload phù hợp
            const userPayload = {
                UserName: data.UserName,
                Email: data.Email,
                Gender: data.Gender === "male", // Chuyển thành boolean (true = male, false = female)
                PhoneNumber: data.PhoneNumber ? normalizePhoneNumber(data.PhoneNumber) : null,
                UserAddress: data.UserAddress || null,
                IsActive: data.IsActive === "true" || data.IsActive === true, // Đảm bảo boolean
                RoleId: parseInt(data.RoleId), // Chuyển thành số
            };

            if (!isEditing) {
                userPayload.Password = data.Password; // Chỉ gửi mật khẩu khi thêm mới
            }

            console.log("Payload gửi đi:", JSON.stringify(userPayload)); // Debug payload

            if (isEditing) {
                await updateUser(userData.user.id, userPayload); // Gửi payload trực tiếp
                toast.success("Cập nhật người dùng thành công!");
            } else {
                await createUser(userPayload); // Gửi payload trực tiếp
                toast.success("Thêm người dùng thành công!");
            }
            navigate("/admin/users");
        } catch (error) {
            console.error("Lỗi chi tiết:", error);
            toast.error(`Lỗi: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/users")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Quay lại
                </button>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
                        <div className="p-4 text-lg font-bold text-slate-800">Thông tin người dùng</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Tên người dùng</span>
                                <Controller
                                    name="UserName"
                                    control={control}
                                    rules={{
                                        required: "Tên người dùng là bắt buộc",
                                        maxLength: {
                                            value: 50,
                                            message: "Tên người dùng không được vượt quá 50 ký tự",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.UserName ? "border-red-500" : ""}`}
                                            placeholder="Nhập tên người dùng"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.UserName && <p className="mt-1 text-sm text-red-500">{errors.UserName.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Email</span>
                                <Controller
                                    name="Email"
                                    control={control}
                                    rules={{
                                        required: "Email là bắt buộc",
                                        pattern: {
                                            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                            message: "Định dạng email không hợp lệ",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="email"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Email ? "border-red-500" : ""}`}
                                            placeholder="Nhập email"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.Email && <p className="mt-1 text-sm text-red-500">{errors.Email.message}</p>}
                            </label>
                            {!isEditing && (
                                <label className="font-bold text-slate-500">
                                    <span className="text-md">Mật khẩu</span>
                                    <Controller
                                        name="Password"
                                        control={control}
                                        rules={{
                                            required: "Mật khẩu là bắt buộc",
                                            minLength: {
                                                value: 6,
                                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <input
                                                type="password"
                                                className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.Password ? "border-red-500" : ""}`}
                                                placeholder="Nhập mật khẩu"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.Password && <p className="mt-1 text-sm text-red-500">{errors.Password.message}</p>}
                                </label>
                            )}
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Giới tính</span>
                                <Controller
                                    name="Gender"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                            {...field}
                                        >
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                        </select>
                                    )}
                                />
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Số điện thoại</span>
                                <Controller
                                    name="PhoneNumber"
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            if (!value) return true; // Cho phép để trống
                                            const error = validatePhoneNumber(value);
                                            return error ? error : true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.PhoneNumber ? "border-red-500" : ""}`}
                                            placeholder="Nhập số điện thoại (VD: 0901234567, +84901234567)"
                                            {...field}
                                            onChange={(e) => {
                                                // Chuẩn hóa số điện thoại khi người dùng nhập
                                                const normalized = normalizePhoneNumber(e.target.value);
                                                field.onChange(normalized);
                                            }}
                                        />
                                    )}
                                />
                                {errors.PhoneNumber && <p className="mt-1 text-sm text-red-500">{errors.PhoneNumber.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Địa chỉ</span>
                                <Controller
                                    name="UserAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.UserAddress ? "border-red-500" : ""}`}
                                            placeholder="Nhập địa chỉ (tùy chọn)"
                                            {...field}
                                        />
                                    )}
                                />
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Vai trò</span>
                                <Controller
                                    name="RoleId"
                                    control={control}
                                    rules={{
                                        required: "Vai trò là bắt buộc",
                                    }}
                                    render={({ field }) => (
                                        <select
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.RoleId ? "border-red-500" : ""}`}
                                            {...field}
                                        >
                                            <option value="1">Admin</option>
                                            <option value="2">User</option>
                                        </select>
                                    )}
                                />
                                {errors.RoleId && <p className="mt-1 text-sm text-red-500">{errors.RoleId.message}</p>}
                            </label>
                            <label className="font-bold text-slate-500">
                                <span className="text-md">Trạng thái</span>
                                <Controller
                                    name="IsActive"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                            {...field}
                                        >
                                            <option value="true">Kích hoạt</option>
                                            <option value="false">Chưa kích hoạt</option>
                                        </select>
                                    )}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Cập nhật người dùng" : "Thêm người dùng mới"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm người dùng"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;

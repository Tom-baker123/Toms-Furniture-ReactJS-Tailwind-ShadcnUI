import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonHovCT from "../../tailwind-custom/ButtonHovCT";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { normalizePhoneNumber, validatePhoneNumber } from "@/utils/phoneUtils";

const RegisterForm = () => {
    // Trạng thái để kiểm soát khi đang gửi form
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { handleRegister, switchForm } = useAuth();

    // Sử dụng react-hook-form để quản lý form
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const password = watch("password");

    // Xử lý submit form
    const onSubmit = async (data) => {
        setIsSubmitting(true);

        // Chuẩn hóa số điện thoại trước khi gửi
        if (data.phoneNumber) {
            data.phoneNumber = normalizePhoneNumber(data.phoneNumber);
        }

        await handleRegister(data);
        setIsSubmitting(false);
    };

    return (
        <div className="my-5 flex flex-col">
            {/* [1.] Tiêu đề */}
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Đăng Ký{/* Register */}</h2>
            <p className="text-md md:text-md mt-3 text-center font-semibold text-gray-500">
                Tạo tài khoản của bạn để bắt đầu mua sắm. 🛍️
                {/* Create your account to start shopping. */}
            </p>

            {/* [2.] Form đăng ký */}
            <form
                className="mt-6 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* [1.] User Name */}
                <div className="Form-Field">
                    <label className="Form-Label">
                        Tên người dùng
                        {/* User Name */}
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="text"
                        placeholder="Tên của bạn"
                        {...register("userName", {
                            required: "Tên người dùng là bắt buộc",
                            minLength: { value: 3, message: "Tên người dùng phải có ít nhất 3 ký tự" },
                        })}
                    />
                    {errors.userName && <p className="mt-1 text-sm text-red-500">{errors.userName.message}</p>}
                </div>

                {/* [2.] Email */}
                <div className="Form-Field">
                    <label className="Form-Label">Email</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email là bắt buộc",
                            pattern: {
                                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                message: "Định dạng email không hợp lệ",
                            },
                        })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* [3.] Password */}
                <div className="Form-Field">
                    <label className="Form-Label">Mật khẩu</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="password"
                        placeholder="Mật khẩu"
                        {...register("password", {
                            required: "Mật khẩu là bắt buộc",
                            minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                        })}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* [4.] Confirm Password */}
                <div className="Form-Field">
                    <label className="Form-Label">Xác nhận mật khẩu</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        {...register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu",
                            validate: (value) => value === password || "Mật khẩu không khớp",
                        })}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                {/* [5.] Gender */}
                <div className="Form-Field">
                    <label className="Form-Label">
                        Giới tính
                        {/* Gender */}
                    </label>
                    <select
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg transition-all"
                        {...register("gender", { required: "Vui lòng chọn giới tính" })}
                    >
                        <option value=""> Chọn giới tính {/* Select Gender */}</option>
                        <option value="true">Nam {/* Male */}</option>
                        <option value="false">Nữ {/* Female */}</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>}
                </div>

                {/* [6.] Phone Number */}
                <div className="Form-Field">
                    <label className="Form-Label">
                        Số điện thoại
                        {/* Phone Number */}
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="tel"
                        placeholder="Số điện thoại (VD: 0901234567, +84901234567)"
                        {...register("phoneNumber", {
                            validate: (value) => {
                                if (!value) return true; // Cho phép để trống
                                const error = validatePhoneNumber(value);
                                return error ? error : true;
                            },
                        })}
                        onChange={(e) => {
                            // Chuẩn hóa số điện thoại khi người dùng nhập
                            const normalized = normalizePhoneNumber(e.target.value);
                            e.target.value = normalized;
                        }}
                    />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>}
                </div>

                {/* [7.] Address */}
                <div className="Form-Field">
                    <label className="Form-Label">
                        Địa chỉ
                        {/* Address */}
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="text"
                        placeholder="Địa chỉ"
                        {...register("userAddress")}
                    />
                </div>

                {/* Nút submit */}
                <ButtonHovCT
                    className={cn("mt-8", isSubmitting ? "!border-gray-300 !bg-gray-300" : "!border-black")}
                    bgColor="bg-black"
                    hoverBgColor=" bg-white" // lớp trượt màu đen
                    textColor="text-white"
                    type="submit"
                    disabled={isSubmitting} // 🔒 Vô hiệu khi đang gửi
                >
                    {/* {isSubmitting ? "Registering..." : "Register"} */}
                    {isSubmitting ? "Đang Đăng Ký..." : "Đăng Ký"}
                </ButtonHovCT>
            </form>

            {/* [3.] Nút quay lại modal Login */}
            <span className="mt-2 flex items-center justify-center gap-1 font-semibold">
                <span className="text-gray-500">
                    Đã có tài khoản?
                    {/* Already have an account */}
                </span>
                <Link
                    to="/"
                    onClick={(e) => {
                        e.preventDefault();
                        switchForm("login");
                    }}
                    className="text-center font-bold underline"
                >
                    Đăng Nhập tại đây
                    {/* Login here */}
                </Link>
            </span>
        </div>
    );
};

export default RegisterForm;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

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
        await handleRegister(data);
        setIsSubmitting(false);
    };

    return (
        <div className="my-5 flex flex-col">
            {/* [1.] Tiêu đề */}
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Register</h2>
            <p className="text-md md:text-md mt-3 text-center font-semibold text-gray-500">Create your account to start shopping.</p>

            {/* [2.] Form đăng ký */}
            <form
                className="mt-6 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* [1.] User Name */}
                <div className="Form-Field">
                    <label className="Form-Label">User Name</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="text"
                        placeholder="Your name"
                        {...register("userName", {
                            required: "User name is required",
                            minLength: { value: 3, message: "User name must be at least 3 characters" },
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
                            required: "Email is required",
                            pattern: {
                                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                message: "Invalid email format",
                            },
                        })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* [3.] Password */}
                <div className="Form-Field">
                    <label className="Form-Label">Password</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* [4.] Confirm Password */}
                <div className="Form-Field">
                    <label className="Form-Label">Confirm Password</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) => value === password || "Passwords do not match",
                        })}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                {/* [5.] Gender */}
                <div className="Form-Field">
                    <label className="Form-Label">Gender</label>
                    <select
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg transition-all"
                        {...register("gender", { required: "Please select a gender" })}
                    >
                        <option value="">Select Gender</option>
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>}
                </div>

                {/* [6.] Phone Number */}
                <div className="Form-Field">
                    <label className="Form-Label">Phone Number</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="tel"
                        placeholder="Phone Number"
                        {...register("phoneNumber", {
                            pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Invalid phone number",
                            },
                        })}
                    />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>}
                </div>

                {/* [7.] Address */}
                <div className="Form-Field">
                    <label className="Form-Label">Address</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="text"
                        placeholder="Address"
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
                    {isSubmitting ? "Registering..." : "Register"}
                </ButtonHovCT>
            </form>

            {/* [3.] Nút quay lại modal Login */}
            <span className="mt-2 flex items-center justify-center gap-1 font-semibold">
                <span className="text-gray-500">Already have an account</span>
                <Link
                    to="/"
                    onClick={(e) => {
                        e.preventDefault();
                        switchForm("login");
                    }}
                    className="text-center font-bold underline"
                >
                    Login here
                </Link>
            </span>
        </div>
    );
};

export default RegisterForm;

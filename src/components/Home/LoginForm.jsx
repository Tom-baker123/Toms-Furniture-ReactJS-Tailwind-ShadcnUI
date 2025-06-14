import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import { useForm } from "react-hook-form";
import { checkAuthStatus, login } from "@/api/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const LoginForm = ({ onSwitch }) => {
    const [isSubmitting, setIsSubmitting] = useState(false); // 🆕 trạng thái loading

    // [1.] Thành phần này sử dụng react-hook-form để quản lý form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // [2.] Điều hướng đến trang khác
    const navigate = useNavigate();

    // [3.]
    const onSubmit = async (data) => {
        setIsSubmitting(true); // 🔐 Khóa nút lại
        const result = await login(data.email, data.password);
        setIsSubmitting(false); // 🔓 Mở lại
        if (result.message === "Đăng nhập thành công.") {
            toast.success("Login successful!");
            const authStatus = await checkAuthStatus();
            if (authStatus.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
            window.location.reload(); // Reload the page to update the auth status
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="my-5 flex flex-col">
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Login</h2>
            <p className="text-md md:text-md mt-3 text-center font-semibold text-gray-500">If you have an account with us, please log in.</p>
            <form
                className="mt-6 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="Form-Field">
                    <label
                        htmlFor="email"
                        className="Form-Label"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                message: "Email format not support",
                            },
                        })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="Form-Field">
                    <label
                        htmlFor="password"
                        className="Form-Label"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Mật khẩu là bắt buộc",
                        })}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <Link
                    to="/forgot-password"
                    className="mt-2 font-semibold text-gray-500 underline"
                >
                    Forgot Password
                </Link>
                <ButtonHovCT
                    className={cn("mt-6", isSubmitting ? "!border-gray-300 !bg-gray-300" : "!border-black")}
                    bgColor="bg-black"
                    hoverBgColor="bg-white"
                    textColor="text-white"
                    type="submit"
                    disabled={isSubmitting} // 🔒 Vô hiệu khi đang gửi
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </ButtonHovCT>
            </form>

            <Link
                to={"/"}
                className="mt-2 text-center font-semibold underline"
                onClick={(e) => {
                    e.preventDefault();
                    onSwitch("register");
                }}
            >
                Create new account
            </Link>
        </div>
    );
};

export default LoginForm;

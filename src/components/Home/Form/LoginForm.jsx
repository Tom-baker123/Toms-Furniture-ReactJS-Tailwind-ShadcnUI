import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonHovCT from "../../tailwind-custom/ButtonHovCT";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false); // 🆕 trạng thái loading
    const { handleLogin, switchForm } = useAuth();

    // [1.] Thành phần này sử dụng react-hook-form để quản lý form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Xử lý submit form
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        await handleLogin(data);
        setIsSubmitting(false);
    };

    // Xử lý phím Enter trong input
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Ngăn hành vi mặc định nếu cần
            handleSubmit(onSubmit); // Gọi hàm submit
        }
    };

    return (
        <div className="my-5 flex flex-col">
            {/* Tiêu đề form */}
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Đăng nhập {/* Login */}</h2>
            <p className="text-md md:text-md mt-3 text-center font-semibold text-gray-500">
                Nếu bạn đã có tài khoản, vui lòng đăng nhập.{/* If you have an account with us, please log in. */}
            </p>

            {/* Form đăng nhập */}
            <form
                className="mt-6 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Trường Email */}
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
                                message: "Invalid email format",
                            },
                        })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* Trường Password */}
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
                            required: "Password is required",
                        })}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* Nút quên mật khẩu */}
                <button
                    type="button"
                    onClick={() => switchForm("forgot-password")}
                    className="mt-2 cursor-pointer text-left font-semibold text-gray-500 underline"
                >
                    Quên mật khẩu{/* Forgot Password */}
                </button>

                {/* Nút submit */}
                <ButtonHovCT
                    className={cn("mt-6", isSubmitting ? "!border-gray-300 !bg-gray-300" : "!border-black")}
                    bgColor="bg-black"
                    hoverBgColor="bg-white"
                    textColor="text-white"
                    type="submit"
                    disabled={isSubmitting} // 🔒 Vô hiệu khi đang gửi
                >
                    {/* {isSubmitting ? "Logging in..." : "Login"} */}
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </ButtonHovCT>
            </form>

            {/* Liên kết đến form đăng ký */}
            <Link
                to={"/"}
                className="mt-2 text-center font-semibold underline"
                onClick={(e) => {
                    e.preventDefault();
                    switchForm("register");
                }}
            >
                Tạo tài khoản mới{/* Create new account */}
            </Link>
        </div>
    );
};

export default LoginForm;

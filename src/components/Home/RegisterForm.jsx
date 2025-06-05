import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import { useModal } from "@/context/ModalContext";
import { register } from "@/api/api";
import { VerifyOtpForm } from "./AuthComponents/VerifyOtpForm";
import { toast } from "react-hot-toast";

const RegisterForm = ({ onSwitch }) => {
    // Object khởi tạo form Data
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        phoneNumber: "",
        userAddress: "",
    });
    // [1.] Hook để quản lý modal
    const { openModal, closeModal } = useModal();

    // [2.] Hàm xử lý thay đổi dữ liệu trong form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // [3.] Hàm xử lý gửi form đăng ký
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData);
        if (result?.message === "Đăng ký thành công. Vui lòng kiểm tra email để nhận mã OTP.") {
            toast.success("Registration successful! please check your email for the OTP code.");
            openModal(<VerifyOtpForm email={formData.email} />, { className: "max-w-md" });
        } else {
            toast.error(result?.message);
        }
    };

    return (
        <div className="my-5 flex flex-col">
            {/* [1.] Tiêu đề */}
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Register</h2>
            <p className="text-md md:text-md mt-3 text-center font-semibold text-gray-500">If you have an account with us, please log in.</p>

            {/* [2.] Form đăng ký */}
            <form
                className="mt-6 flex flex-col"
                onSubmit={handleSubmit}
            >
                {/* [1.] User Name */}
                <div className="Form-Field">
                    <label
                        htmlFor=""
                        className="Form-Label"
                    >
                        User Name
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                    />
                </div>

                {/* [2.] Email */}
                <div className="Form-Field">
                    <label className="Form-Label">Email</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </div>

                {/* [3.] Password */}
                <div className="Form-Field">
                    <label className="Form-Label">Password</label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </div>

                {/* [4.] Confirm Password */}
                <div className="Form-Field">
                    <label
                        htmlFor=""
                        className="Form-Label"
                    >
                        Confirm Password
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                    />
                </div>

                {/* [5.] Gender */}
                <div className="Form-Field">
                    <label
                        htmlFor=""
                        className="Form-Label"
                    >
                        Gender
                    </label>
                    <select
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg transition-all"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                {/* [6.] Phone Number */}
                <div className="Form-Field">
                    <label
                        htmlFor=""
                        className="Form-Label"
                    >
                        Phone Number
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                    />
                </div>

                {/* [7.] Address */}
                <div className="Form-Field">
                    <label
                        htmlFor=""
                        className="Form-Label"
                    >
                        Address
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="text"
                        name="userAddress"
                        value={formData.userAddress}
                        onChange={handleChange}
                        placeholder="Address"
                    />
                </div>

                <ButtonHovCT
                    className={"mt-8 !border-black"}
                    bgColor="bg-black"
                    hoverBgColor=" bg-white" // lớp trượt màu đen
                    textColor="text-white"
                    type="submit"
                >
                    Register
                </ButtonHovCT>
            </form>

            {/* [3.] Nút quay lại modal Login */}
            <span className="mt-2 flex items-center justify-center gap-1 font-semibold">
                <span className="text-gray-500">Already have an account</span>
                <Link
                    to={"/"}
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitch("login");
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

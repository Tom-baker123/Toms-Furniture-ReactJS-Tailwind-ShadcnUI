import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ButtonHovCT from "../../tailwind-custom/ButtonHovCT";
import { forgotPassword } from "@/api/api";
import { VerifyOtpForm } from "../AuthComponents/VerifyOtpForm";
import { useModal } from "@/context/ModalContext";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const ForgotPasswordForm = ({ onSwitch, onSetEmail }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { openModal } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const result = await forgotPassword(data.email);
        setIsSubmitting(false);

        if (result.message === "OTP code sent successfully. Please check your email.") {
            toast.success("OTP sent successfully! Please check your email.");
            onSetEmail(data.email); // Lưu email vào state
            openModal(
                <VerifyOtpForm
                    email={data.email}
                    context="forgot-password"
                    onSwitch={onSwitch}
                />,
                {
                    className: "max-w-md",
                },
            );
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="my-5 flex flex-col">
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Forgot Password</h2>
            <p className="text-md md:text-md mt-3 text-center font-semibold text-gray-500">Enter your email to receive an OTP for password reset.</p>
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
                                message: "Email format not supported",
                            },
                        })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <ButtonHovCT
                    className={cn("mt-6", isSubmitting ? "!border-gray-300 !bg-gray-300" : "!border-black")}
                    bgColor="bg-black"
                    hoverBgColor="bg-white"
                    textColor="text-white"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </ButtonHovCT>
            </form>
            <span className="mt-2 flex items-center justify-center gap-1 font-semibold">
                <span className="text-gray-500">Back to</span>
                <Link
                    to={"/"}
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitch("login");
                    }}
                    className="text-center font-bold underline"
                >
                    Login
                </Link>
            </span>
        </div>
    );
};

export default ForgotPasswordForm;

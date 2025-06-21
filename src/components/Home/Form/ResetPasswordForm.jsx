import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonHovCT from "../../tailwind-custom/ButtonHovCT";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const ResetPasswordForm = ({ email }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { handleResetPassword, switchForm } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const password = watch("newPassword"); // Theo dõi giá trị của newPassword

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        await handleResetPassword(email, data.newPassword);
        setIsSubmitting(false);
    };

    return (
        <div className="my-5 flex flex-col">
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Reset Password</h2>
            <p className="text-md md:text-md mt-3 text-center font-semibold text-gray-500">
                Enter your new password for <span className="text-black">{email}</span>
            </p>
            <form
                className="mt-6 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="Form-Field">
                    <label
                        htmlFor="newPassword"
                        className="Form-Label"
                    >
                        New Password
                    </label>
                    <input
                        id="newPassword"
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="password"
                        placeholder="New Password"
                        {...register("newPassword", {
                            required: "New password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                    />
                    {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>}
                </div>
                <div className="Form-Field">
                    <label
                        htmlFor="confirmPassword"
                        className="Form-Label"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
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
                <ButtonHovCT
                    className={cn("mt-6", isSubmitting ? "!border-gray-300 !bg-gray-300" : "!border-black")}
                    bgColor="bg-black"
                    hoverBgColor="bg-white"
                    textColor="text-white"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                </ButtonHovCT>
            </form>
            <span className="mt-2 flex items-center justify-center gap-1 font-semibold">
                <span className="text-gray-500">Back to</span>
                <Link
                    to={"/"}
                    onClick={(e) => {
                        e.preventDefault();
                        switchForm("login");
                    }}
                    className="text-center font-bold underline"
                >
                    Login
                </Link>
            </span>
        </div>
    );
};

export default ResetPasswordForm;
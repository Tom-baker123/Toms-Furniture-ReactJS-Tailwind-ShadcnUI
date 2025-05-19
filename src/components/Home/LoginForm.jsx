import React from "react";
import { Link } from "react-router-dom";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";

const LoginForm = ({ onSwitch }) => {
    return (
        <div className="my-5 flex flex-col">
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Login</h2>
            <p className="text-md mt-3 text-center font-semibold text-gray-500 md:text-md">If you have an account with us, please log in.</p>
            <form className="mt-6 flex flex-col">
                {/* [1.] Email */}
                <div className="Form-Field">
                    <label
                        htmlFor=""
                        className="mb-3 block font-semibold"
                    >
                        Email
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="text"
                        placeholder="Email"
                    />
                </div>

                {/* [2.] Password */}
                <div className="Form-Field mt-6">
                    <label
                        htmlFor=""
                        className="mb-3 block font-semibold"
                    >
                        Password
                    </label>
                    <input
                        className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                        type="text"
                        placeholder="Password"
                    />
                </div>
                <Link
                    to={"/ForgotPassword"}
                    className="mt-2 font-semibold text-gray-500 underline"
                >
                    Forgot Password
                </Link>

                <ButtonHovCT
                    className={"mt-6 !border-black"}
                    bgColor="bg-black"
                    hoverBgColor=" bg-white" // lớp trượt màu đen
                    textColor="text-white"
                >
                    Sign Up
                </ButtonHovCT>
            </form>

            <Link
                to={"#"}
                className="mt-2 text-center font-semibold underline"
                onClick={(e) => {
                    e.preventDefault();
                    onSwitch && onSwitch();
                }}
            >
                Create new account
            </Link>
        </div>
    );
};

export default LoginForm;

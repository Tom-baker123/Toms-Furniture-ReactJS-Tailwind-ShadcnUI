import React from "react";
import { Link } from "react-router-dom";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";

const LoginForm = ({ onSwitch }) => {
    return (
        <div className="my-5 flex flex-col">
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Login</h2>
            <p className="text-md md:text-md mt-3 text-center font-semibold text-gray-500">If you have an account with us, please log in.</p>
            <form className="mt-6 flex flex-col">
                {/* [1.] Email */}
                <div className="Form-Field">
                    <label
                        htmlFor=""
                        className="Form-Label"
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
                <div className="Form-Field">
                    <label
                        htmlFor=""
                        className="Form-Label"
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
                    Login
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

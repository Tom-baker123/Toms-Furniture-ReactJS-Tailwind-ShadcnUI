import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { VerifyOtpForm } from "./AuthComponents/VerifyOtpForm";

const AuthSwitcher = () => {
    const [mode, setMode] = useState("login"); // login, register, verify-otp, resend-otp
    const [emailForOTP, setEmailForOTP] = useState("");

    const switchMode = (newMode, email = "") => {
        setMode(newMode);
        if (email !== "") setEmailForOTP(email);
    };

    return (
        <>
            {mode === "login" && <LoginForm onSwitch={switchMode} />}
            {mode === "register" && <RegisterForm onSwitch={switchMode} />}
            {mode === "verify-otp" && (
                <VerifyOtpForm
                    onSwitch={switchMode}
                    email={emailForOTP}
                />
            )}
            {mode === "resend-otp" && (
                <LoginForm
                    onSwitch={switchMode}
                    email={emailForOTP}
                />
            )}
        </>
    );
};

export default AuthSwitcher;

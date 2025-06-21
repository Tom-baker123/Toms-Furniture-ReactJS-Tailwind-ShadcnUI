import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./Form/ForgotPasswordForm";
import ResetPasswordForm from "./Form/ResetPasswordForm";
import { useModal } from "@/context/ModalContext";

const AuthSwitcher = () => {
    const [currentForm, setCurrentForm] = useState("login");
    const [email, setEmail] = useState(""); // Lưu email cho quên mật khẩu
    const { openModal } = useModal();

    const switchForm = (form) => {
        setCurrentForm(form);
    };

    // Hàm lưu email từ ForgotPasswordForm
    const handleSetEmail = (emailValue) => {
        setEmail(emailValue);
    };

    return (
        <>
            {currentForm === "login" && <LoginForm onSwitch={switchForm} />}
            {currentForm === "register" && <RegisterForm onSwitch={switchForm} />}
            {currentForm === "forgot-password" && (
                <ForgotPasswordForm
                    onSwitch={switchForm}
                    onSetEmail={handleSetEmail}
                />
            )}
            {currentForm === "reset-password" && (
                <ResetPasswordForm
                    email={email}
                    onSwitch={switchForm}
                />
            )}
        </>
    );
};

export default AuthSwitcher;

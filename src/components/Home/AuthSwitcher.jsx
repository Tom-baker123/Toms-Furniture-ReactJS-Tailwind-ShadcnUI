import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./Form/ForgotPasswordForm";
import ResetPasswordForm from "./Form/ResetPasswordForm";
import { useAuth } from "@/context/AuthContext";

const AuthSwitcher = () => {
    const { currentForm, email } = useAuth();

    return (
        <>
            {currentForm === "login" && <LoginForm />}
            {currentForm === "register" && <RegisterForm />}
            {currentForm === "forgot-password" && <ForgotPasswordForm />}
            {currentForm === "reset-password" && <ResetPasswordForm email={email} />}
        </>
    );
};

export default AuthSwitcher;
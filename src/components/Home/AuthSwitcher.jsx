import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthSwitcher = () => {
    const [isLogin, setIsLogin] = useState(true);

    return isLogin ? <LoginForm onSwitch={() => setIsLogin(false)} /> : <RegisterForm onSwitch={() => setIsLogin(true)}/>;
};

export default AuthSwitcher;

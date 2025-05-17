import React from "react";

const ButtonHovCT = ({
    children,
    bgColor = "", // nền mặc định
    hoverBgColor = "", // nền hover luôn đổi
    textColor = "",
    hoverTextColor = "",
    border = true,
    onClick,
    className = "",
}) => {
    return (
        <button
            onClick={onClick}
            className={`group relative overflow-hidden rounded-full px-6 py-2 font-semibold ${bgColor} ${textColor} ${border ? `border ${textColor.replace("text-", "border-")}` : ""} transition-colors duration-300 ease-in-out ${className} `}
        >
            <span className={`relative !z-10 transition-colors duration-300 group-hover:text-black`}>{children}</span>
            <span
                className={`absolute inset-0 ${hoverBgColor} !z-0 -translate-x-full transform transition-transform duration-300 ease-in-out group-hover:translate-x-0`}
            ></span>
        </button>
    );
};

export default ButtonHovCT;

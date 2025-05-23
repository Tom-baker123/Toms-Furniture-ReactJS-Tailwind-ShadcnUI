import React from "react";

const ButtonHov = ({ Title = "", classCustom = "" }) => {
    return (
        <>
            <button className={`btn ${classCustom}`}>
                <span className={`relative z-[8] font-bold`}>{Title === "" ? "Shop Now" : Title}</span>
            </button>
        </>
    );
};

export default ButtonHov;

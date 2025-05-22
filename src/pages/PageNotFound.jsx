import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import React from "react";

const PageNotFound = () => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-5 py-10 my-auto">
            <img
                src="/img/sub-icon/EmptyBox.png"
                alt="Page Not Found"
                width={100}
                height={100}
            />
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold">404 Page not found </h1>
                <p className="text-md text-gray-500">The page you requested does not exist.</p>
            </div>
            <ButtonHovCT
                className={"!border-black"}
                bgColor="bg-black"
                hoverBgColor=" bg-white" // lớp trượt màu đen
                textColor="text-white"
            >
                Continue Shopping
            </ButtonHovCT>
        </div>
    );
};

export default PageNotFound;

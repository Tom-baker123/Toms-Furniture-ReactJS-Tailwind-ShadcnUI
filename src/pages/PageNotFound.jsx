import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import React from "react";

const PageNotFound = () => {
    return (
        <div className="my-auto flex w-full flex-col items-center justify-center gap-5 py-10">
            <img
                src="/img/sub-icon/EmptyBox.png"
                alt="Không tìm thấy trang"
                width={100}
                height={100}
            />
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold">404 Không tìm thấy trang </h1>
                <p className="text-md text-gray-500">Trang bạn yêu cầu không tồn tại.</p>
            </div>
            <ButtonHovCT
                className={"!border-black"}
                bgColor="bg-black"
                hoverBgColor=" bg-white" // lớp trượt màu đen
                textColor="text-white"
            >
                Tiếp tục mua sắm
            </ButtonHovCT>
        </div>
    );
};

export default PageNotFound;

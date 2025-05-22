import React from "react";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import { Funnel } from "lucide-react";

const ProductCategoryToolbar = () => {
    return (
        <ButtonHovCT
            className={"!border-black"}
            bgColor="bg-black"
            hoverBgColor=" bg-white" // lớp trượt màu đen
            textColor="text-white"
        >
            <span className="flex items-center gap-2 py-1 text-lg font-bold">
                <Funnel />
                Filter
            </span>
        </ButtonHovCT>
    );
};

export default ProductCategoryToolbar;

import React from "react";
import ButtonHovCT from "../tailwind-custom/ButtonHovCT";
import { Funnel } from "lucide-react";

const ProductCategoryToolbar = () => {
    return (
        <ButtonHovCT
            className={"!border-black !px-5"}
            bgColor="bg-black"
            hoverBgColor=" bg-white" // lớp trượt màu đen
            textColor="text-white"
        >
            <span className="flex items-center py-0.5 gap-2 text-sm font-bold">
                <Funnel className="w-5" />
                Filter
            </span>
        </ButtonHovCT>
    );
};

export default ProductCategoryToolbar;

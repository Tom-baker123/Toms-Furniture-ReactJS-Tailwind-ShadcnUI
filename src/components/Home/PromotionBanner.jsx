import React from "react";
import ButtonHovCustom from "../tailwind-custom/ButtonHovCustom";

const PromotionBanner = () => {
    return (
        <div className="container-custom">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {/* 1. Promotion Banner */}
                <div className="relative box-border h-full w-full overflow-hidden rounded-md object-cover">
                    <img
                        className="max-md:hidden box-border h-full w-full object-cover"
                        src="/img/PromotionBanner/Promotion-Banner-1.png"
                        alt="asdasdasd"
                    />
                    <img
                        className="md:hidden box-border h-full w-full object-cover"
                        src="/img/PromotionBanner/Promotion-Banner-1--mb.png"
                        alt="asdasdasd"
                    />
                    <div className="absolute top-0 left-0 flex h-full w-full flex-col p-8 md:p-3 lg:p-7">
                        <h3 className="text-xl font-bold md:text-2xl lg:text-3xl">Cross Chairs</h3>
                        <p className="mt-4 text-sm font-semibold text-gray-500 md:mt-3">
                            Elevate your space with 30% off <br />
                            our timeless designs!
                        </p>
                        <div className="flex flex-1 items-end">
                            <ButtonHovCustom
                                colorSelect={"black_white"}
                                colorHoverSelect={"white_black"}
                                classNameCT={"border-[1px] border-black"}
                            >
                                Shop Now
                            </ButtonHovCustom>
                        </div>
                    </div>
                    <div className="absolute top-5 right-5 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-red-700 text-white">
                        <p className="font-semibold">Save </p>
                        <h2 className="text-3xl font-bold">30%</h2>
                    </div>
                </div>

                {/* 2. Promotion Banner */}
                <div className="relative box-border h-full w-full overflow-hidden rounded-md object-cover">
                    <img
                        className="max-md:hidden box-border h-full w-full object-cover"
                        src="/img/PromotionBanner/Promotion-Banner-2.png"
                        alt="asdasdasd"
                    />
                    <img
                        className="md:hidden box-border h-full w-full object-cover"
                        src="/img/PromotionBanner/Promotion-Banner-2--mb.png"
                        alt="asdasdasd"
                    />
                    <div className="absolute top-0 left-0 flex h-full w-full flex-col p-8 md:p-3 lg:p-7">
                        <h3 className="text-xl font-bold md:text-2xl lg:text-3xl">Turn Chairs</h3>
                        <p className="mt-4 text-sm font-semibold text-gray-500 md:mt-3">
                            Elevate your space with 40% off <br />
                            our timeless designs!
                        </p>
                        <div className="flex flex-1 items-end">
                            <ButtonHovCustom
                                colorSelect={"black_white"}
                                colorHoverSelect={"white_black"}
                                classNameCT={"border-[1px] border-black"}
                            >
                                Shop Now
                            </ButtonHovCustom>
                        </div>
                    </div>

                    <div className="absolute top-5 right-5 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-yellow-200 text-black">
                        <p className="font-semibold">Save </p>
                        <h2 className="text-3xl font-bold">40%</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionBanner;

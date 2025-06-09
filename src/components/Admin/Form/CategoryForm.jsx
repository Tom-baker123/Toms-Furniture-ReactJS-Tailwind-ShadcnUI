import { CircleHelp, ImageIcon, MoveLeft } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const CategoryForm = () => {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="title">Category Management</div>
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-4">
                    <div className="p-4 text-lg font-bold text-slate-800">
                        Collection Image <span className="text-lg text-gray-500"> (optional)</span>
                    </div>
                    <hr />
                    <form className="flex flex-col gap-5 px-4 py-4">
                        {/* Input tag */}

                        <label className="font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                                <p className="text-md">Tag</p>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="flex cursor-pointer items-center justify-center">
                                            <CircleHelp
                                                strokeWidth={3.5}
                                                className="w-3.5 text-blue-600"
                                            />
                                            {/* <div className="h-3.5 w-3.5 rounded-full bg-slate-300 text-[10px] text-white">?</div> */}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p className="w-52 text-wrap">
                                            You can use only 1 picture. Image format jpg, jpeg, png, gif with ratio 1:1 (square image) and resolution
                                            2048px x 2048px for best image quality{" "}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </span>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                placeholder="Insert picture tag"
                            />
                        </label>

                        <div className="">
                            {/* Ảnh định dạng jpg, jpeg, png, gif tỉ lệ 1:1 (ảnh
                            vuông) và độ phân giải 2048px x 2048px để chất
                            lượng hình ảnh tốt nhất 
                            */}
                            <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border bg-gray-50 px-5 py-16 transition outline-dashed hover:bg-gray-100">
                                <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-500">Choose your image</span>
                                <input
                                    type="file"
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </form>
                </div>
                <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-8">
                    <div className="p-4 text-lg font-bold text-slate-800">Collection Information</div>
                    <hr />
                    <form className="flex flex-col gap-5 px-4 py-4">
                        {/* [1.] Tên danh mục */}
                        <label className="font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                                <p className="text-md">Collection Name</p>
                            </span>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                placeholder="Insert collection name here"
                            />
                        </label>

                        {/* [1.] Mô tả danh mục */}
                        <label className="font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                                <p className="text-md">Collection Description</p>
                            </span>
                            <textarea
                                rows={5}
                                className="w-full rounded-sm border"
                                name=""
                                id=""
                            ></textarea>
                        </label>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;

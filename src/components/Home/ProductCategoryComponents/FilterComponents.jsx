import { cn } from "@/lib/utils";
import React, { useState } from "react";

const FilterComponents = ({ showHead, title = "", json = "Please Check Your Filter Problem" }) => {
    const [AccordionOpen, setAccordionOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-6 first:pt-0 last:border-0">
            <button
                onClick={() => setAccordionOpen(!AccordionOpen)}
                className="flex w-full cursor-pointer justify-between select-none"
            >
                <span className="text-md font-bold">{title || "Filter"}</span>
                {/* {AccordionOpen ? <span>-</span> : <span>+</span>} */}
                <svg
                    className="ml-8 shrink-0 fill-black"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        y="7"
                        width="16"
                        height="2"
                        rx="1"
                        className={`origin-center transform transition duration-200 ease-out ${AccordionOpen && "!rotate-180"}`}
                    />
                    <rect
                        y="7"
                        width="16"
                        height="2"
                        rx="1"
                        className={`origin-center rotate-90 transform transition duration-200 ease-out ${AccordionOpen && "!rotate-180"}`}
                    />
                </svg>
            </button>
            <div
                className={cn(
                    `grid cursor-pointer overflow-hidden text-sm text-slate-600 transition-all duration-150 ease-in-out`,
                    AccordionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
            >
                <ul className="grid w-full gap-3 overflow-hidden">
                    <li className="flex w-full items-center gap-2 pt-6">
                        <input
                            name="filter.v.availability"
                            value="1"
                            className="checkbox h-5 w-5"
                            id="vertical-filter.v.availability-1"
                            type="checkbox"
                        ></input>
                        <label
                            htmlFor="vertical-filter.v.availability-1"
                            className="text-subtext text-gray-400 reversed-link flex flex-grow items-center justify-between gap-1"
                        >
                            <span className="text-[15px] font-bold">In stock</span>
                            <span className="count">1</span>
                        </label>
                    </li>
                    <li className="flex items-center gap-2">
                        <input
                            name="filter.v.availability"
                            value="1"
                            className="checkbox h-5 w-5"
                            id="vertical-filter.v.availability-1"
                            type="checkbox"
                        ></input>
                        <label
                            htmlFor="vertical-filter.v.availability-1"
                            className="text-subtext text-gray-400 reversed-link flex flex-grow items-center justify-between gap-1"
                        >
                            <span className="text-[15px] font-bold">Out of stock</span>
                            <span className="count">1</span>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default FilterComponents;

{
    /* Ví dụ các bộ lọc */
}
// <div>
//     <label className="font-bold"> Availability </label>
//     <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
//         <option>All</option>
//         <option>Chairs</option>
//         <option>Tables</option>
//         <option>Sofas</option>
//     </select>
// </div>
// <div>
//     <label className="block text-sm font-medium text-gray-700">Price Range</label>
//     <input
//         type="range"
//         min="0"
//         max="1000"
//         className="w-full"
//     />
// </div>
// <div>
//     <label className="block text-sm font-medium text-gray-700">Color</label>
//     <div className="flex gap-2">
//         <input
//             type="checkbox"
//             id="red"
//         />
//         <label htmlFor="red">Red</label>
//         <input
//             type="checkbox"
//             id="blue"
//         />
//         <label htmlFor="blue">Blue</label>
//     </div>
// </div>

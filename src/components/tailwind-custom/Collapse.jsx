import { cn } from "@/lib/utils";
import React, { useState } from "react";

const Collapse = ({ showHead, title = "", json }) => {
    const [AccordionOpen, setAccordionOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-6 first:pt-0 last:border-0">
            <button
                onClick={() => setAccordionOpen(!AccordionOpen)}
                className="flex w-full cursor-pointer justify-between select-none"
            >
                <span className="text-md font-bold">{title || "Filter"}</span>
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
            {/* Horizontal Line */}
            <div className="w-full border-b border-gray-400 pt-2.5 lg:hidden" />
            <div
                className={cn(
                    `grid cursor-pointer overflow-hidden text-sm text-slate-600 transition-all duration-150 ease-in-out`,
                    AccordionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
            >
                <ul className="overflow-hidden space-y-2 font-semibold text-gray-500">
                    {json.map((fl, flindex) => (
                        <li className="first:pt-6" key={flindex}> {fl} </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Collapse;

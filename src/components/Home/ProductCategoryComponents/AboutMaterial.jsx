import React, { useRef, useState, useEffect } from "react";
import { Paragraph_About_Material } from "@/assets/FakeData";

const AboutMaterial = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [maxHeight, setMaxHeight] = useState("0px");
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            if (isExpanded) {
                setMaxHeight(contentRef.current.scrollHeight + "px");
            } else {
                setMaxHeight("5rem"); // hoặc chiều cao ngắn hơn tùy bạn
            }
        }
    }, [isExpanded]);

    const fullContent = Paragraph_About_Material.map((t, index) => (
        <p
            key={index}
            className="my-3 font-semibold text-gray-500 first:mt-0 last:mb-0"
        >
            {t.paragraph}
        </p>
    ));

    return (
        <div className="container-custom pb-9 md:pb-[45px] xl:pb-[60px]">
            <div className="rounded-md bg-gray-100 px-5 py-8 md:px-[50px] md:py-10">
                <h2 className="text-xl font-bold lg:text-[28px]">About Tom's Furniture</h2>

                <div className="relative mt-3 overflow-hidden">
                    <div
                        ref={contentRef}
                        style={{ maxHeight }}
                        className="transition-all duration-150 ease-in-out"
                    >
                        {fullContent}
                    </div>

                    {/* Nền mờ chỉ hiện khi chưa mở rộng */}
                    {!isExpanded && (
                        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-gray-100 to-transparent" />
                    )}
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 cursor-pointer py-2 font-bold text-black underline underline-offset-2"
                >
                    {isExpanded ? "View Less ▲" : "View More ▼"}
                </button>
            </div>
        </div>
    );
};

export default AboutMaterial;

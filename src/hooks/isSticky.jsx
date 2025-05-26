import React, { useState, useEffect } from "react";

const isSticky = () => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsSticky(true); // Scroll xuống để chèn class
            } else {
                setIsSticky(false); // Scroll lên đầu để ẩn class
            }
        };

        // "Hễ khi nào người dùng cuộn trang (scroll), thì hãy chạy hàm handleScroll."
        window.addEventListener("scroll", handleScroll);

        // Gỡ listener khi component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return isSticky;
};

export default isSticky;

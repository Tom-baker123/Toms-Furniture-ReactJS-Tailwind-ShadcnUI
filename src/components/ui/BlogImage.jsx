import React from "react";
import { createImageDataUrl } from "../../utils/base64Utils";

const BlogImage = ({ src, alt, className = "", fallbackSrc = "/img/FeatureSection/multicolumn-1.png", ...props }) => {
    // Hàm xử lý source ảnh
    const getImageSrc = (imageSrc) => {
        if (!imageSrc) return fallbackSrc;

        // Nếu là URL HTTP/HTTPS thì dùng trực tiếp
        if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
            return imageSrc;
        }

        // Nếu là data URL thì dùng trực tiếp
        if (imageSrc.startsWith("data:")) {
            return imageSrc;
        }

        // Nếu là đường dẫn local thì dùng trực tiếp
        if (imageSrc.startsWith("/")) {
            return imageSrc;
        }

        // Nếu có thể là base64 thuần, thử tạo data URL
        try {
            // Kiểm tra xem có phải base64 không (basic check)
            if (imageSrc.length > 100 && imageSrc.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
                return createImageDataUrl(imageSrc);
            }
        } catch (error) {
            console.warn("Error processing image source:", error);
        }

        // Fallback
        return imageSrc;
    };

    const handleImageError = (e) => {
        console.warn(`Failed to load image: ${src}`);
        e.target.src = fallbackSrc;
    };

    return (
        <img
            src={getImageSrc(src)}
            alt={alt}
            className={className}
            onError={handleImageError}
            {...props}
        />
    );
};

export default BlogImage;

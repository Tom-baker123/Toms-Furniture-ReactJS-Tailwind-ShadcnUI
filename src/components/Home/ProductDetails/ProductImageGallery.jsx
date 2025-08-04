import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";

const ProductImageGallery = ({ images = [] }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [mainSwiper, setMainSwiper] = useState(null);

    // Nếu images rỗng hoặc không có ảnh hợp lệ, dùng ảnh mặc định
    const validImages =
        Array.isArray(images) && images.length > 0 ? images.filter((img) => !!img && typeof img === "string" && img.trim() !== "") : [];
    const fallbackImage = "/img/NotFound/No Picture.png";
    const displayImages = validImages.length > 0 ? validImages : [fallbackImage];

    // Reset về slide đầu tiên khi danh sách hình ảnh thay đổi
    useEffect(() => {
        if (mainSwiper) {
            mainSwiper.slideTo(0, 0); // slideTo(index, speed)
        }
        if (thumbsSwiper) {
            thumbsSwiper.slideTo(0, 0);
        }
    }, [images, mainSwiper, thumbsSwiper]);

    return (
        <div className="flex flex-col gap-4 md:flex-row">
            {/* Thumbnails */}
            <Swiper
                onSwiper={setThumbsSwiper}
                direction="horizontal"
                slidesPerView={4}
                spaceBetween={10}
                watchSlidesProgress
                modules={[Thumbs]}
                className="order-2 w-full md:order-1 md:w-24"
                breakpoints={{
                    768: {
                        direction: "vertical",
                        slidesPerView: 4,
                    },
                }}
            >
                {displayImages.map((img, idx) => (
                    <SwiperSlide
                        key={idx}
                        className="!mb-0 md:!h-24"
                    >
                        <img
                            src={img}
                            alt={`Thumb ${idx}`}
                            className="w-full cursor-pointer rounded border object-cover md:h-20 md:w-20"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Main Image */}
            <Swiper
                onSwiper={setMainSwiper}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]}
                className="order-1 w-full md:order-2 md:w-[calc(100%-6rem)]"
            >
                {displayImages.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={img}
                            alt={`Main ${idx}`}
                            className="w-full rounded object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductImageGallery;

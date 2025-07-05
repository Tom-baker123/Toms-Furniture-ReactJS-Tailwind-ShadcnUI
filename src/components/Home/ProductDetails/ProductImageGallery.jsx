import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";

const images = [
    "/img/Products/Spoke-Sofa-Basic.webp",
    "/img/Products/Spoke-Sofa-Basic.webp",
    "/img/Products/Spoke-Sofa-Basic.webp",
    "/img/Products/Spoke-Sofa-Basic.webp",
];

const ProductImageGallery = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="flex flex-col-reverse gap-4 md:flex-row">
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
                {images.map((img, idx) => (
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
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]}
                className="order-1 w-full md:order-2 md:w-[calc(100%-6rem)]"
            >
                {images.map((img, idx) => (
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

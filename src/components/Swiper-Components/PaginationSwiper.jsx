import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { NewArrivalsPicture } from "@/assets/FakeData";
import { cn } from "@/lib/utils";

const PaginationSwiper = ({ Picture = NewArrivalsPicture }) => {
    // Tạo ref cho nút prev và next
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const paginationRef = useRef(null);

    // Xác định breakpoint bằng uidotdev cho responsive
    const isTablet = useMediaQuery("(min-width: 768px)"); // Kiểm tra thiết bị là tablet

    // Hiển thị dưới mobile
    if (!isTablet) {
        return (
            <div className="grid grid-cols-2 gap-5">
                {Picture.map((image, index) => (
                    <div key={index}>
                        <img
                            className={cn(`w-full rounded-md`, image.info?.length > 0 ? "aspect-square" : "h-full")}
                            src={`/img/NewArrivals/${image.ImageURL}`}
                            alt="asdsa"
                        />
                        {/* pt-[12px] cho box title */}
                        {Array.isArray(image.info) && image.info.length > 0 && (
                            <div className="flex-1 pt-3">
                                {image.info.map((info, idx) => (
                                    <div
                                        className="flex h-full w-full flex-col justify-between"
                                        key={idx}
                                    >
                                        <p className="text-sm font-semibold text-gray-700">{info.type}</p>
                                        <h3 className="text-[20px] font-bold">{info.proName}</h3>
                                        <p className="font-bold">{info.price}</p>
                                        <div className="flex gap-x-2">
                                            <div className="mt-1 h-5 w-5 bg-gray-600 md:mt-2"></div>
                                            <div className="mt-1 h-5 w-5 bg-gray-300 md:mt-2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // Hiển thị trên tablet & desktop
    return (
        <div className="NewArrivalsSwiper relative">
            <Swiper
                modules={[Navigation, Pagination, Mousewheel]}
                slidesPerView={3} // 👈 Slide tự động co giãn theo kích thước
                spaceBetween={30}
                simulateTouch={true}
                // autoHeight={true}
                mousewheel={{
                    forceToAxis: true,
                }}
                breakpoints={{
                    1280: { slidesPerView: 5 },
                    768: { slidesPerView: 3 },
                }}
                navigation={{
                    // 👈 Gán button điều hướng custom
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                pagination={{
                    el: paginationRef.current,
                    type: "progressbar",
                }}
                onSwiper={(swiper) => {
                    // 👈 Khi swiper khởi tạo
                    setTimeout(() => {
                        // Delay để refs kịp gán
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.params.pagination.el = paginationRef.current;

                        swiper.navigation.destroy(); // Reset navigation cũ
                        swiper.navigation.init(); // Khởi tạo lại navigation
                        swiper.navigation.update(); // Update state mới

                        swiper.pagination.destroy(); // Reset pagination cũ
                        swiper.pagination.init(); // Khởi tạo lại pagination
                        swiper.pagination.render(); // Render xong mới update cần lưu ý
                        swiper.pagination.update(); // Update state mới
                    });
                }}
                className="!h-auto"
            >
                {Picture.map((t, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex h-full flex-col">
                            <img
                                className={cn(`w-full rounded-md object-cover`, t.info?.length > 0 ? "aspect-square" : "h-full")}
                                src={`/img/NewArrivals/${t.ImageURL}`}
                                alt="asdsa"
                            />
                            {Array.isArray(t.info) && t.info.length > 0 && (
                                <div className="flex-1 pt-10 xl:pt-5">
                                    {t.info.map((info, idx) => (
                                        <div
                                            className="flex h-full w-full flex-col justify-between"
                                            key={idx}
                                        >
                                            <p className="text-sm font-semibold text-gray-700">{info.type}</p>
                                            <h3 className="text-[20px] font-bold">{info.proName}</h3>
                                            <p className="font-bold">{info.price}</p>
                                            <div className="flex gap-x-2">
                                                <div className="mt-1 h-5 w-5 bg-gray-600 md:mt-2"></div>
                                                <div className="mt-1 h-5 w-5 bg-gray-300 md:mt-2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}

                {/* Thanh Progressbar + Nút Prev/Next bên phải */}
                <div className="mt-4 flex items-center justify-between">
                    <div
                        ref={paginationRef}
                        className="swiper-pagination !static !h-[3px] w-full flex-1 overflow-hidden rounded-sm !bg-gray-200"
                    ></div>
                    <div className="ml-4 flex items-center gap-2">
                        <button
                            ref={prevRef}
                            className="overflow-hidden rounded-full border border-gray-200 bg-white p-2 transition select-none"
                        >
                            <ChevronLeft className="z-20 h-4 w-4 text-black" />
                        </button>
                        <button
                            ref={nextRef}
                            className="overflow-hidden rounded-full border border-gray-200 bg-white p-2 transition select-none"
                        >
                            <ChevronRight className="h-4 w-4 text-black" />
                        </button>
                    </div>
                </div>
            </Swiper>
        </div>
    );
};

export default PaginationSwiper;

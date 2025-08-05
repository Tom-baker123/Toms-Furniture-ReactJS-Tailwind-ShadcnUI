// HeroSwiper.jsx
import { useRef } from "react"; // Hook useRef để giữ tham chiếu đến button
import { Swiper, SwiperSlide } from "swiper/react"; // Component Swiper & SwiperSlide
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icon mũi tên từ Lucide
import { Navigation, Pagination, Autoplay, EffectCreative } from "swiper/modules"; // Module cho Navigation, Pagination, Autoplay
import "swiper/css"; // Import CSS cơ bản của Swiper
import "swiper/css/navigation"; // Import CSS cho Navigation
import "swiper/css/pagination"; // Import CSS cho Pagination
import ButtonHov from "../../tailwind-custom/ButtonHov";
import { HeroList } from "@/assets/FakeData";

const HeroSwiper = ({ transitionTime }) => {
    // Tạo ref cho nút prev và next
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="hero-swiper-ct relative mx-auto block overflow-hidden rounded-md px-[15px] 2xl:max-w-7xl">
            {" "}
            {/* Container tổng cho Swiper */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCreative]} // Kích hoạt các modules cần dùng
                pagination={{
                    el: ".swiper-pagination", // Gán class cho pagination
                    clickable: true, // Pagination có thể click được
                }}
                slidesPerView="1" // 👈 Slide tự động co giãn theo kích thước
                spaceBetween={10} // 👈 Khoảng cách giữa các slide
                centeredSlides={false} // 👈 Không cần căn giữa slide
                slideToClickedSlide={true} // 👈 Click vào slide sẽ tự lướt tới nó
                // pagination={{ type: 'progressbar' }}// 👈 Thanh progressbar dưới swiper
                navigation={{
                    // 👈 Gán button điều hướng custom
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                loop={true}
                autoplay={{
                    delay: transitionTime || 3000, // thời gian chuyển trang
                    disableOnInteraction: false, // Không tắt autoplay khi user đang tương tác.
                }}
                onSwiper={(swiper) => {
                    // 👈 Khi swiper khởi tạo
                    setTimeout(() => {
                        // Delay để refs kịp gán
                        if (swiper.params?.navigation && swiper.navigation) {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                            swiper.navigation.destroy(); // Reset navigation cũ
                            swiper.navigation.init(); // Khởi tạo lại navigation
                            swiper.navigation.update(); // Update state mới
                        }
                    });
                }}
            >
                {HeroList.map((t) => (
                    <SwiperSlide>
                        <div className="relative h-full w-full shrink-0 overflow-hidden">
                            {/* IMG */}
                            <div className="relative h-full w-full overflow-hidden rounded-md">
                                <div>
                                    <img
                                        className="zoom-in-slow hidden w-full !bg-gray-100 min-md:block"
                                        src={`/img/hero-swiper/${t.url_desk}`}
                                        alt={t.id}
                                    />
                                    <img
                                        className="zoom-in-slow block w-full !bg-gray-100 min-md:hidden"
                                        src={`/img/hero-swiper/${t.url_mobile}`}
                                        alt={t.id}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/25"></div>
                            </div>

                            {/* Title */}
                            <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center px-[15px] text-white">
                                <div className="py-8 text-center">
                                    <div className="mb-4 text-lg font-bold md:text-sm lg:text-xl">Cotton Made</div>
                                    <h2 className="text-5xl font-bold md:text-5xl lg:text-7xl">New Season July</h2>
                                    <div className="mt-8">
                                        <ButtonHov
                                            Title="Shop Collection"
                                            classCustom="px-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                <div className="absolute bottom-3 left-0 flex w-full items-center justify-center">
                    {/* Nút Prev (Trái) */}
                    <button
                        ref={prevRef}
                        className="z-10 flex items-center justify-center rounded-full p-2 transition select-none"
                    >
                        <ChevronLeft className="h-6 w-6 cursor-pointer stroke-3 text-white" /> {/* Icon trái màu trắng */}
                    </button>

                    {/* Pagination */}
                    <div className="swiper-pagination !static !w-auto !cursor-pointer"></div>

                    {/* Nút Next (Phải) */}
                    <button
                        ref={nextRef}
                        className="z-10 flex items-center justify-center rounded-full p-2 transition select-none"
                    >
                        <ChevronRight className="h-6 w-6 cursor-pointer stroke-3 text-white" /> {/* Icon phải màu trắng */}
                    </button>
                </div>
            </Swiper>
        </div>
    );
};

export default HeroSwiper;

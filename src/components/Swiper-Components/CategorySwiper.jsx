// CategorySwiper.jsx
import { useRef } from "react"; // Hook useRef để giữ tham chiếu đến button
import { Swiper, SwiperSlide } from "swiper/react"; // Component Swiper & SwiperSlide
import { Navigation, Pagination } from "swiper/modules"; // Module cho Navigation và Pagination
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icon mũi tên từ Lucide
import "swiper/css"; // Import CSS cơ bản của Swiper
import "swiper/css/navigation"; // Import CSS cho Navigation
import "swiper/css/pagination"; // Import CSS cho Pagination
import { categoryList } from "@/assets/FakeData";
import { Link } from "react-router-dom";

const CategorySwiper = () => {
    // Tạo ref cho nút prev và next
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="relative mx-auto block overflow-hidden px-[15px] py-5 2xl:max-w-7xl">
            {/* Container tổng cho Swiper */}
            <Swiper
                modules={[Navigation, Pagination]} // Kích hoạt các modules cần dùng
                slidesPerView="auto" // 👈 Slide tự động co giãn theo kích thước
                spaceBetween={16} // 👈 Khoảng cách giữa các slide
                centeredSlides={false} // 👈 Không cần căn giữa slide
                slideToClickedSlide={true} // 👈 Click vào slide sẽ tự lướt tới nó
                // pagination={{ type: 'progressbar' }}// 👈 Thanh progressbar dưới swiper
                breakpoints={{
                    0: { slidesPerView: 3 }, // 👈 Dưới 768px hiển thị 5 card
                    768: { slidesPerView: 6 }, // 👈 Từ 768px trở lên dùng auto
                    1024: { slidesPerView: 8 }, // 👈 Từ 768px trở lên dùng auto
                    1280: { slidesPerView: 10 }, // 👈 Từ 768px trở lên dùng auto
                }}
                navigation={{
                    // 👈 Gán button điều hướng custom
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onSwiper={(swiper) => {
                    // 👈 Khi swiper khởi tạo
                    setTimeout(() => {
                        // Delay để refs kịp gán
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.destroy(); // Reset navigation cũ
                        swiper.navigation.init(); // Khởi tạo lại navigation
                        swiper.navigation.update(); // Update state mới
                    });
                }}
            >
                {categoryList.map((t, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex"
                        // className="!flex-basis-auto !flex-shrink-0 !flex-grow-0 max-md:!mr-0 max-md:!h-24 max-md:!w-1/4 max-md:!flex-col"
                        // style={{ width: "8rem" }} // 👈 Phải đặt min-width để slidesPerView="auto" hoạt động đẹp
                    >
                        <span className="flex h-full w-full shrink-0 items-start justify-center">
                            <Link
                                to={t.linkWebsite}
                                className="relative flex flex-col items-center justify-start text-center decoration-0"
                            >
                                {/* Logo Category */}
                                <div className="relative block w-20 max-w-full overflow-hidden rounded-full bg-transparent select-none max-md:w-15">
                                    <img
                                        className="mx-auto block rounded-full object-cover max-sm:w-20"
                                        src={`/img/category-menu/${t.url}`}
                                        alt=""
                                        width={800}
                                        height={800}
                                    />
                                </div>
                                {/* Category Title */}
                                <div className="pointer-events-none w-full pt-3">
                                    <h3 className="relative inline-block flex-1 px-4 text-base text-[15px]">
                                        <span>
                                            <span className="whitespace-nowrap">{t.name}</span>
                                            <svg
                                                className="icon-custom icon-caret-right rtl-flip-x icon--medium icon--thick hidden md:block"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M7.5 3.75L13.75 10L7.5 16.25"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                ></path>
                                            </svg>
                                        </span>
                                    </h3>
                                </div>
                            </Link>
                        </span>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Nút Prev (Trái) */}
            <button
                ref={prevRef}
                className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 transition select-none"
            >
                <ChevronLeft className="h-3 w-3 text-black" /> {/* Icon trái màu trắng */}
            </button>
            {/* Nút Next (Phải) */}
            <button
                ref={nextRef}
                className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 transition select-none"
            >
                <ChevronRight className="h-3 w-3 text-black" /> {/* Icon phải màu trắng */}
            </button>
        </div>
    );
};

export default CategorySwiper;

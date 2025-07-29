// CategorySwiper.jsx
import { useContext, useRef } from "react"; // Hook useRef để giữ tham chiếu đến button
import { Swiper, SwiperSlide } from "swiper/react"; // Component Swiper & SwiperSlide
import { Navigation, Pagination } from "swiper/modules"; // Module cho Navigation và Pagination
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icon mũi tên từ Lucide
import "swiper/css"; // Import CSS cơ bản của Swiper
import "swiper/css/navigation"; // Import CSS cho Navigation
import "swiper/css/pagination"; // Import CSS cho Pagination
// import { categoryList } from "@/assets/FakeData";
import { Link } from "react-router-dom";
import { APIContext } from "@/context/APIContext";

// Component Loading Skeleton
const CategorySkeleton = () => {
    return (
        <div className="relative mx-auto block overflow-hidden px-[15px] py-5 2xl:max-w-7xl">
            <div className="flex space-x-4">
                {/* Tạo 10 skeleton items để match với breakpoint lớn nhất */}
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex animate-pulse flex-col items-center justify-start text-center"
                    >
                        {/* Logo Category Skeleton */}
                        <div className="relative block w-20 max-w-full overflow-hidden rounded-full bg-gray-200 select-none max-md:w-15">
                            <div className="mx-auto block aspect-square rounded-full bg-gray-300 object-cover max-sm:w-20"></div>
                        </div>
                        {/* Category Title Skeleton */}
                        <div className="w-full pt-3">
                            <div
                                className="mx-auto h-4 rounded bg-gray-200"
                                style={{ width: "60px" }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategorySwiper = () => {
    // Tạo ref cho nút prev và next
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    // Lấy dữ liệu từ Context
    const { categories, loading, error } = useContext(APIContext);

    if (loading) {
        return <CategorySkeleton />; // Sử dụng skeleton thay vì text loading
    }

    if (error) {
        return <div className="py-5 text-center text-red-500">🤒 {error}</div>;
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="py-5 text-center">
                <img
                    src="/img/sub-icon/Empty_List.png"
                    alt=""
                    width={120}
                    className="mx-auto"
                />
                <span className="text-xl font-extrabold text-slate-500">Danh mục rỗng</span>
                <p className="text-sm font-semibold text-slate-500">Vui lòng thử lại sau</p>
            </div>
        );
    }

    return (
        <div className="group relative mx-auto block overflow-hidden px-[15px] py-5 2xl:max-w-7xl">
            {/* Container tổng cho Swiper */}
            <Swiper
                modules={[Navigation, Pagination]} // Kích hoạt các modules cần dùng
                slidesPerView="auto" // 👈 Slide tự động co giãn theo kích thước
                spaceBetween={16} // 👈 Khoảng cách giữa các slide
                centeredSlides={false} // 👈 Không cần căn giữa slide
                slideToClickedSlide={true} // 👈 Click vào slide sẽ tự lướt tới nó
                // pagination={{ type: 'progressbar' }}// 👈 Thanh progressbar dưới swiper
                breakpoints={{
                    0: { slidesPerView: 3 }, // 👈 Dưới 768px hiển thị 3 card
                    640: { slidesPerView: 5 }, // 👈 Dưới 768px hiển thị 3 card
                    768: { slidesPerView: 6 }, // 👈 Từ 768px trở lên dùng auto
                    1024: { slidesPerView: 8 }, // 👈 Từ 768px trở lên dùng auto
                    1280: { slidesPerView: 9 }, // 👈 Từ 768px trở lên dùng auto
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
                {categories.map((category, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex"
                        // className="!flex-basis-auto !flex-shrink-0 !flex-grow-0 max-md:!mr-0 max-md:!h-24 max-md:!w-1/4 max-md:!flex-col"
                        // style={{ width: "8rem" }} // 👈 Phải đặt min-width để slidesPerView="auto" hoạt động đẹp
                    >
                        <span className="flex h-full w-full shrink-0 items-start justify-center">
                            <Link
                                to={`/products?category=${category.id}`}
                                className="relative flex flex-col items-center justify-start text-center decoration-0"
                            >
                                {/* Logo Category */}
                                <div className="relative block w-20 max-w-full overflow-hidden rounded-full bg-transparent select-none max-md:w-15">
                                    <img
                                        className="mx-auto block rounded-full object-cover max-sm:w-20 bg-gray-100"
                                        src={category.imageUrl || `/img/category-menu/default.jpg`}
                                        alt={category.name}
                                        width={800}
                                        height={800}
                                    />
                                </div>
                                {/* Category Title */}
                                <div className="pointer-events-none w-full pt-3">
                                    <h3 className="relative inline-block flex-1 px-4 text-base text-[15px]">
                                        <span>
                                            <span className="whitespace-nowrap">{category.categoryName}</span>
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
                                                />
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
            <div className="absolute top-1/2 left-0 z-20 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                    ref={prevRef}
                    className="group/btn relative cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-white p-2 transition-all duration-300 ease-in-out select-none"
                >
                    {/* Lớp nền slide màu đen */}
                    <div className="absolute inset-0 -translate-x-full transform rounded-full bg-black transition-transform duration-300 ease-in-out group-hover/btn:translate-x-0"></div>
                    <ChevronLeft className="relative z-10 h-3 w-3 transition-colors duration-300 group-hover/btn:text-white" />{" "}
                    {/* Icon trái màu trắng */}
                </button>
            </div>
            {/* Nút Next (Phải) */}
            <div className="absolute top-1/2 right-0 z-20 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                    ref={nextRef}
                    className="group/btn relative cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-white p-2 transition-all duration-300 ease-in-out select-none"
                >
                    {/* Lớp nền slide màu đen */}
                    <div className="absolute inset-0 -translate-x-full transform rounded-full bg-black transition-transform duration-300 ease-in-out group-hover/btn:translate-x-0"></div>
                    <ChevronRight className="relative z-10 h-3 w-3 transition-colors duration-300 group-hover/btn:text-white" />{" "}
                    {/* Icon phải màu trắng */}
                </button>
            </div>
        </div>
    );
};

export default CategorySwiper;

import { FooterPaymentIcon, FooterSocial } from "@/assets/FakeData";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ButtonHovCustom from "./tailwind-custom/ButtonHovCustom";
import { useDesktopBreakpoint } from "@/hooks/useDesktopBreakpoint";
import ButtonHovCT from "./tailwind-custom/ButtonHovCT";
import Collapse from "./tailwind-custom/Collapse";
import { APIContext } from "@/context/APIContext";

const Footer = () => {
    // 1. Xử lý details đóng mở responsive footer
    const isDesktop = useDesktopBreakpoint(); // Mặc định là màn hình 1024 trở lên là desktop
    const { storeInformation, loading, error } = useContext(APIContext); // Lấy thông tin cửa hàng

    return (
        <footer className="container-custom block py-6 md:py-12 lg:py-10">
            {/* 1. Foot Hỗ trợ liên lạc  px-4 xl:px-[50px]*/}
            <section className="grid grid-cols-1 gap-3 py-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {/* Customer Service */}
                <div className="relative flex">
                    <div className="flex flex-1 gap-x-3">
                        {/* Icon */}
                        <div
                            className="block stroke-[0.1rem] text-[#1d349a]"
                            dangerouslySetInnerHTML={{
                                __html: '<svg className="icon icon-chat icon--medium icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M10 10.3125C10.5178 10.3125 10.9375 9.89277 10.9375 9.375C10.9375 8.85723 10.5178 8.4375 10 8.4375C9.48223 8.4375 9.0625 8.85723 9.0625 9.375C9.0625 9.89277 9.48223 10.3125 10 10.3125Z" fill="currentColor"></path><path d="M6.5625 10.3125C7.08027 10.3125 7.5 9.89277 7.5 9.375C7.5 8.85723 7.08027 8.4375 6.5625 8.4375C6.04473 8.4375 5.625 8.85723 5.625 9.375C5.625 9.89277 6.04473 10.3125 6.5625 10.3125Z" fill="currentColor"></path><path d="M13.4375 10.3125C13.9553 10.3125 14.375 9.89277 14.375 9.375C14.375 8.85723 13.9553 8.4375 13.4375 8.4375C12.9197 8.4375 12.5 8.85723 12.5 9.375C12.5 9.89277 12.9197 10.3125 13.4375 10.3125Z" fill="currentColor"></path><path d="M8.20859 15L9.45859 17.1875C9.51322 17.2833 9.59222 17.363 9.68758 17.4184C9.78294 17.4738 9.89127 17.503 10.0016 17.503C10.1119 17.503 10.2202 17.4738 10.3155 17.4184C10.4109 17.363 10.4899 17.2833 10.5445 17.1875L11.7945 15H16.875C17.0408 15 17.1997 14.9342 17.3169 14.8169C17.4342 14.6997 17.5 14.5408 17.5 14.375V4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375V14.375C2.5 14.5408 2.56585 14.6997 2.68306 14.8169C2.80027 14.9342 2.95924 15 3.125 15H8.20859Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>',
                            }}
                        ></div>
                        {/* Title */}
                        <div className="flex flex-1 flex-col items-start">
                            <h3 className="font-bold">Dịch vụ khách hàng</h3>
                            <div className="font-semibold tracking-tight text-gray-600">
                                <p>{storeInformation?.operatingHours}</p>
                            </div>
                        </div>
                    </div>
                    {/* Vertical Line */}
                    <div className="absolute [inset-inline-end:-15px] top-0 h-full border-r border-gray-200"></div>
                </div>

                {/* Call Us */}
                <div className="relative flex">
                    <div className="flex flex-1 gap-x-3">
                        {/* Icon */}
                        <div
                            className="block stroke-[0.1rem] text-[#1d349a]"
                            dangerouslySetInnerHTML={{
                                __html: '<svg className="icon icon-phone icon--medium icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M12.843 11.3544C12.9295 11.2968 13.0291 11.2617 13.1326 11.2523C13.2362 11.2429 13.3404 11.2594 13.4359 11.3005L17.1203 12.9512C17.2445 13.0043 17.3481 13.0962 17.4157 13.2131C17.4833 13.3299 17.5112 13.4656 17.4953 13.5997C17.3739 14.5067 16.9273 15.3389 16.2383 15.9413C15.5494 16.5437 14.6652 16.8754 13.75 16.8747C10.9321 16.8747 8.22957 15.7553 6.23699 13.7627C4.24442 11.7701 3.125 9.0676 3.125 6.24968C3.1243 5.33452 3.456 4.45026 4.05841 3.76134C4.66082 3.07242 5.49293 2.62574 6.4 2.50436C6.53409 2.48844 6.66973 2.51636 6.78662 2.58396C6.90351 2.65156 6.99537 2.7552 7.04844 2.87936L8.69922 6.56686C8.73978 6.66157 8.7563 6.76484 8.7473 6.86748C8.7383 6.97012 8.70407 7.06894 8.64766 7.15515L6.97813 9.1403C6.9189 9.22966 6.88388 9.33286 6.87649 9.43981C6.86909 9.54676 6.88958 9.6538 6.93594 9.75046C7.58203 11.0731 8.94922 12.4239 10.2758 13.0637C10.373 13.1099 10.4805 13.1299 10.5878 13.1218C10.695 13.1138 10.7983 13.0778 10.8875 13.0176L12.843 11.3544Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>',
                            }}
                        ></div>
                        {/* Title */}
                        <div className="flex flex-1 flex-col items-start">
                            <h3 className="font-bold">Gọi cho chúng tôi</h3>
                            <div className="font-semibold tracking-tight text-gray-600">
                                <p>{storeInformation?.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                    {/* Vertical Line */}
                    <div className="absolute [inset-inline-end:-15px] top-0 h-full border-r border-gray-200"></div>
                </div>

                {/* Get in Touch */}
                <div className="relative flex">
                    <div className="flex flex-1 gap-x-3">
                        {/* Icon */}
                        <div
                            className="block stroke-[0.1rem] text-[#1d349a]"
                            dangerouslySetInnerHTML={{
                                __html: '<svg className="icon icon-paperplane icon--medium icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M10 9.42969V14.4297" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path><path d="M10.0006 14.3746L17.2881 16.8363C17.4081 16.8802 17.5387 16.8863 17.6623 16.8537C17.7859 16.8212 17.8965 16.7515 17.9793 16.6541C18.0621 16.5567 18.113 16.4362 18.1251 16.309C18.1373 16.1818 18.1102 16.0539 18.0475 15.9425L10.5405 2.81754C10.4864 2.71985 10.4072 2.63842 10.311 2.58172C10.2148 2.52502 10.1052 2.49512 9.99358 2.49512C9.88194 2.49512 9.77233 2.52502 9.67616 2.58172C9.57998 2.63842 9.50076 2.71985 9.44671 2.81754L1.95843 15.9425C1.89634 16.0536 1.8696 16.1809 1.88178 16.3075C1.89396 16.4341 1.94448 16.554 2.02658 16.6511C2.10869 16.7482 2.21849 16.818 2.3413 16.8511C2.46411 16.8842 2.5941 16.879 2.71389 16.8363L10.0006 14.3746Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>',
                            }}
                        ></div>
                        {/* Title */}
                        <div className="flex flex-1 flex-col items-start">
                            <h3 className="font-bold">Liên hệ</h3>
                            <div className="font-semibold tracking-tight text-gray-600">
                                <a
                                    href="mailto:lienhe@noithat.com"
                                    className="underline underline-offset-3"
                                >
                                    {storeInformation?.email}
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Vertical Line */}
                    <div className="absolute [inset-inline-end:-15px] top-0 h-full border-r border-gray-200"></div>
                </div>

                {/* Address */}
                <div className="relative flex">
                    <div className="flex flex-1 gap-x-3">
                        {/* Icon */}
                        <div
                            className="block stroke-[0.1rem] text-[#1d349a]"
                            dangerouslySetInnerHTML={{
                                __html: '<svg className="icon icon-map-pin icon--medium icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M10 10.625C11.3807 10.625 12.5 9.50571 12.5 8.125C12.5 6.74429 11.3807 5.625 10 5.625C8.61929 5.625 7.5 6.74429 7.5 8.125C7.5 9.50571 8.61929 10.625 10 10.625Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16.25 8.125C16.25 13.75 10 18.125 10 18.125C10 18.125 3.75 13.75 3.75 8.125C3.75 6.4674 4.40848 4.87769 5.58058 3.70558C6.75269 2.53348 8.3424 1.875 10 1.875C11.6576 1.875 13.2473 2.53348 14.4194 3.70558C15.5915 4.87769 16.25 6.4674 16.25 8.125Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>',
                            }}
                        ></div>
                        {/* Title */}
                        <div className="flex flex-1 flex-col items-start">
                            <h3 className="font-bold">Địa chỉ</h3>
                            <div className="font-semibold tracking-tight text-gray-600">
                                <p>{storeInformation?.storeAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Horizontal Line */}
            <div className="w-full border-b border-gray-200"></div>

            {/* 2. Footer List */}
            <section className="flex flex-col pt-6 md:pt-[30px] lg:flex-row lg:gap-8 lg:pt-10">
                {/* 2.1 New Seltter */}
                <div className="mb-3 flex-1/3 lg:mb-0">
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold">Đăng ký nhận bản tin</h3>

                        <div className="mt-4 font-semibold text-gray-500">
                            <p>Đăng ký nhận bản tin để nhận ngay 10% giảm giá cho đơn hàng đầu tiên.</p>
                        </div>
                    </div>

                    <form
                        method="post"
                        className="mt-5 md:w-[470px]"
                    >
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <input
                                    className="form-control h-full w-full flex-1 rounded-4xl border border-transparent bg-gray-200 px-5 focus:border-black"
                                    id="NewsletterForm-newsletter_3qCrWc"
                                    type="email"
                                    name="contact[email]"
                                    aria-required="true"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    autoComplete="email"
                                    placeholder="Nhập email của bạn"
                                    required=""
                                />
                            </div>
                            <ButtonHovCT
                                className={"!border-black"}
                                bgColor="bg-black"
                                hoverBgColor=" bg-white" // lớp trượt màu đen
                                textColor="text-white"
                            >
                                Đăng ký
                            </ButtonHovCT>
                        </div>
                    </form>

                    <p className="mt-5 font-semibold text-gray-500 max-lg:pb-3">
                        Khi đăng ký, bạn đồng ý với{" "}
                        <a
                            href="/policies/terms-of-service"
                            title="Điều khoản dịch vụ"
                            className="underline"
                        >
                            Điều khoản dịch vụ
                        </a>{" "}
                        và{" "}
                        <a
                            href="/policies/privacy-policy"
                            title="Chính sách bảo mật"
                            className="underline"
                        >
                            Chính sách bảo mật.
                        </a>
                    </p>
                </div>

                {/* 2.2 Footer Menu */}
                {/* Company Section */}
                <div className="flex-1">
                    <details
                        className="hidden lg:block"
                        open={isDesktop}
                    >
                        <summary className={`flex cursor-pointer justify-between text-[1.2rem] font-bold lg:pointer-events-none`}>
                            <h3 className="py-3 lg:py-0">Công ty</h3>
                        </summary>

                        {/* Horizontal Line */}
                        <div className="w-full border-b border-gray-200 lg:hidden" />

                        <ul className="space-y-2 py-3 font-semibold text-gray-500">
                            <li>
                                <Link
                                    to="/about"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/findastore"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Tìm cửa hàng
                                </Link>
                            </li>
                        </ul>
                    </details>

                    <div className="lg:hidden">
                        <Collapse
                            title="Công ty"
                            json={["Về chúng tôi", "Liên hệ", "Câu hỏi thường gặp", "Blog", "Tìm cửa hàng"]}
                            linkMapping={{
                                "Về chúng tôi": "/about",
                                "Liên hệ": "/contact",
                                "Câu hỏi thường gặp": "/faq",
                                Blog: "/blog",
                                "Tìm cửa hàng": "/findastore",
                            }}
                        />
                    </div>
                </div>

                {/* Collection Section */}
                <div className="flex-1">
                    <details
                        className="hidden lg:block"
                        open={isDesktop}
                    >
                        <summary className={`flex cursor-pointer justify-between text-[1.2rem] font-bold lg:pointer-events-none`}>
                            <h3 className="py-3 lg:py-0">Bộ sưu tập</h3>
                        </summary>

                        {/* Horizontal Line */}
                        <div className="w-full border-b border-gray-200 lg:hidden" />

                        <ul className="space-y-2 py-3 font-semibold text-gray-500">
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Bàn
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Ghế Bow
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Bàn xoay
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Ghế xoay
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Ghế Cross Bar
                                </Link>
                            </li>
                        </ul>
                    </details>

                    <div className="lg:hidden">
                        <Collapse
                            title="Bộ sưu tập"
                            json={["Bàn", "Ghế Bow", "Bàn xoay", "Ghế xoay", "Ghế Cross Bar"]}
                            linkMapping={{
                                Bàn: "/products",
                                "Ghế Bow": "/products",
                                "Bàn xoay": "/products",
                                "Ghế xoay": "/products",
                                "Ghế Cross Bar": "/products",
                            }}
                        />
                    </div>
                </div>

                {/* Shop Section */}
                <div className="flex-1">
                    <details
                        className="hidden lg:block"
                        open={isDesktop}
                    >
                        <summary className={`flex cursor-pointer justify-between text-[1.2rem] font-bold lg:pointer-events-none`}>
                            <h3 className="py-3 lg:py-0">Cửa hàng</h3>
                        </summary>

                        {/* Horizontal Line */}
                        <div className="w-full border-b border-gray-200 lg:hidden" />

                        <ul className="space-y-2 py-3 font-semibold text-gray-500">
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Sofa
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Ngoài trời
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Ghế ngồi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Đèn chiếu sáng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-gray-900"
                                >
                                    Phụ kiện
                                </Link>
                            </li>
                        </ul>
                    </details>

                    <div className="lg:hidden">
                        <Collapse
                            title="Cửa hàng"
                            json={["Sofa", "Ngoài trời", "Ghế ngồi", "Đèn chiếu sáng", "Phụ kiện"]}
                            linkMapping={{
                                Sofa: "/products",
                                "Ngoài trời": "/products",
                                "Ghế ngồi": "/products",
                                "Đèn chiếu sáng": "/products",
                                "Phụ kiện": "/products",
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* 3. Footer Bottom */}
            <section>
                {/* 3.1. Footer Social */}
                <div className="mt-10 flex flex-col justify-between gap-6 font-semibold md:flex-row md:items-end md:gap-0">
                    {/* footer__copyright - Left */}
                    <div className="flex flex-col gap-2">
                        <div className="block">Các phương thức thanh toán</div>
                        <div className="block">
                            <ul className="flex gap-x-2">
                                {FooterPaymentIcon.map((t, index) => (
                                    <li key={index}>
                                        <div dangerouslySetInnerHTML={{ __html: t.svgHTML }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* footer__copyright - Right*/}
                    <div>
                        <ul className="flex items-center gap-6">
                            {FooterSocial.map((t, index) => (
                                <li key={index}>
                                    <button className="rounded-full border-[1px] p-3">
                                        <div dangerouslySetInnerHTML={{ __html: t.svgHTML }} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3.2. Footer Copyright */}
                <div className="mt-10 flex justify-between font-semibold">
                    {/* footer__copyright - Left */}
                    <div>
                        <p className="block">
                            &copy;2025
                            <a
                                href="#"
                                className="inline"
                            >
                                Hyper Garace.
                            </a>
                            <a
                                href="#"
                                className="inline"
                            >
                                Vận hành bởi React Js
                            </a>
                        </p>
                    </div>

                    {/* footer__copyright - Right*/}
                    <div>
                        <ul className="flex items-center gap-6">
                            <li>Điều khoản dịch vụ</li>
                            <li>Chính sách bảo mật</li>
                        </ul>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default Footer;

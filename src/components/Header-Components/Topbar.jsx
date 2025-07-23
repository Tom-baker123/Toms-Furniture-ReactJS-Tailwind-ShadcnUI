import React from "react";

const Topbar = () => {
    return (
        <div className="z-40 bg-[#1D349A]">
            <div className="mx-auto px-4 py-[9px] text-[1rem] text-white lg:grid lg:grid-cols-3 lg:gap-3 2xl:max-w-7xl">
                <ul className="hidden lg:flex lg:flex-wrap lg:gap-5">
                    <li>Trung tâm hỗ trợ {/* Help Center */}</li>
                    <li>Tìm cửa hàng {/* Find a Store */}</li>
                    <li>Liên hệ {/* Contact */}</li>
                </ul>

                <p className="text-center">✌🏼 Free phí ship khi đơn hàng trên 5,000,000 VND {/* ✌🏼 Free Express Shipping on orders $500!  */}</p>

                <ul className="hidden lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:gap-4">
                    <li className="w-4">
                        <a href="/">
                            <img
                                className="invert"
                                src="/img/social-logo/facebook.png"
                                alt=""
                            />
                        </a>
                    </li>
                    <li className="w-4">
                        <a href="/">
                            <img
                                className="invert"
                                src="/img/social-logo/twitter.png"
                                alt=""
                            />
                        </a>
                    </li>
                    <li className="w-4">
                        <a href="/">
                            <img
                                className="invert"
                                src="/img/social-logo/instagram.png"
                                alt=""
                            />
                        </a>
                    </li>
                    <li className="w-4">
                        <a href="/">
                            <img
                                className="invert"
                                src="/img/social-logo/tik-tok.png"
                                alt=""
                            />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Topbar;

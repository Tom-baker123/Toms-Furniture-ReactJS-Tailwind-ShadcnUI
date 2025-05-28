import ProgressBar from "@/components/Home/ProgressBar";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import showHeader from "@/hooks/showHeader";
import { cn } from "@/lib/utils";
import { Ticket, X } from "lucide-react";
import React, { useState } from "react";

const Cart = ({ itemCount = 0 }) => {
    const [quantity, setQuantity] = useState(1);
    // Sử dụng showHeader hook để lấy trạng thái hiển thị của header
    const showHead = showHeader();

    return (
        <main className="container-custom pt-2.5 pb-10 md:pt-3 md:pb-12 scroll-smooth">
            <section className="mb-8 text-3xl font-bold md:text-4xl">Your Cart ({itemCount}) </section>

            <section className="grid grid-cols-12">
                <div className="col-span-12 w-full pr-5 md:col-span-8">
                    <table
                        className="flex-1 border-collapse max-lg:w-full"
                        role="table"
                    >
                        <thead className="">
                            <tr className="hidden text-left">
                                <th className="table-cell">Product</th>
                                <th className="table-cell">Quantity</th>
                                <th className="table-cell">Total</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <tr
                                    key={index}
                                    className="table-row"
                                >
                                    <td className="table-cell w-96 px-0 py-5 pr-5">
                                        <div className="flex w-full flex-1 items-center gap-3">
                                            <button className="hover-rotate cursor-pointer max-md:hidden">
                                                <X className="h-7 w-7 stroke-3" />
                                            </button>
                                            <div className="flex items-center">
                                                <img
                                                    src="/img/cart-image/TurnTableMono.png"
                                                    alt="Product"
                                                    className="mr-3 size-20 rounded-md object-contain sm:size-22 lg:size-30"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between gap-1 sm:gap-2 md:gap-2.5">
                                                <div className="flex flex-1 flex-col">
                                                    <span className="text-lg font-semibold md:text-xl">Product Name</span>
                                                    <span className="text-xs text-gray-500 md:text-sm">Product Description lask</span>
                                                </div>

                                                <div className="text-sm font-bold lg:text-lg">1,200,000 VND</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell w-40 px-0 py-5 pr-5 max-lg:hidden">
                                        <div className="flex w-fit items-center justify-between gap-3 rounded-full border px-5 py-2 font-bold">
                                            <button
                                                className="cursor-pointer text-lg"
                                                disabled={quantity === 1}
                                                onClick={() => setQuantity(quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <h2 className="text-lg">{quantity}</h2>
                                            <button
                                                className="cursor-pointer text-lg"
                                                onClick={() => setQuantity(quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="table-cell w-40 px-0 py-5 pr-5 text-xl max-lg:hidden">
                                        <span className="font-bold">{quantity * 12}.VND</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="col-span-12 md:col-span-4 md:pr-5">
                    <div className={cn(`pt-3 sticky top-0 transition-all duration-500`, showHead ? `top-[133.5px] md:top-[157px] lg:top-[138px] z-10` : `top-0 z-10`)}>
                        <div className="mb-3 flex flex-col gap-2 pb-5">
                            <p className="font-semibold text-[#0d8756]"> You are eligible for free shipping. </p>
                            <ProgressBar />
                        </div>
                        <div className="grid gap-6">
                            {/* Cart Addon */}
                            <div className="rounded-full bg-gray-200 px-5 py-4 text-lg font-bold">Order Note</div>

                            {/*  */}
                            <div className="flex cursor-pointer justify-between border-b-2 border-dashed pb-3">
                                <Ticket
                                    className="text-red-500"
                                    size={25}
                                />
                                <p className="font-semibold text-gray-500">Get your Promotion</p>
                            </div>
                            <div className="grid gap-1">
                                <div className="flex justify-between text-lg font-bold whitespace-nowrap lg:text-xl">
                                    <span className="">Estiamted total</span>
                                    <span>20,000,000 VND</span>
                                </div>
                                <div className="">Taxes and shipping calculated at checkout</div>
                            </div>

                            <ButtonHovCT
                                className={"!border-black py-3 text-xl"}
                                bgColor="bg-black"
                                hoverBgColor=" bg-white" // lớp trượt màu đen
                                textColor="text-white"
                            >
                                Check Out
                            </ButtonHovCT>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Cart;

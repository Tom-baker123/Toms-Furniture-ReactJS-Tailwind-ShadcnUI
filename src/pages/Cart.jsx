import { Ticket } from "lucide-react";
import React from "react";

const Cart = ({ itemCount = 0 }) => {
    return (
        <main className="container-custom pt-2.5 pb-10 md:pt-3 md:pb-12">
            <section className="mb-8 text-4xl font-bold">Your Cart ({itemCount}) </section>

            <section className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-8">
                    <div className=""></div>
                </div>

                <div className="sticky-element col-span-12 md:col-span-4">
                    <div className="">
                        <Ticket
                            className="text-red-500"
                            size={25}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Cart;

import React, { useState } from "react";

const QuantityButton = () => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex items-center justify-between gap-5 rounded-full border px-3 py-1 font-bold">
            <button
                className="cursor-pointer text-lg font-extrabold"
                disabled={quantity === 1}
                onClick={() => setQuantity(quantity - 1)}
            >
                -
            </button>
            <h2>{quantity}</h2>
            <button
                className="cursor-pointer text-lg font-extrabold"
                onClick={() => setQuantity(quantity + 1)}
            >
                +
            </button>
        </div>
    );
};

export default QuantityButton;

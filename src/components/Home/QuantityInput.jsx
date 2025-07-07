import React from "react";

/**
 * Tái sử dụng input số lượng cho cart, product, v.v.
 * Props:
 *  - value: số lượng hiện tại
 *  - onChange: callback (val: number) => void
 *  - disabled: disable input
 *  - min: số lượng tối thiểu (default 1)
 */
const QuantityInput = ({ value, onChange, disabled, min = 1 }) => {
    return (
        <>
            <input
                type="number"
                min={min}
                className="w-12 appearance-none border-none bg-transparent px-1 py-1 text-center outline-none"
                style={{ MozAppearance: "textfield" }}
                value={value}
                onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val) || val < min) val = min;
                    onChange(val);
                }}
                onBlur={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val) || val < min) val = min;
                    onChange(val);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        let val = parseInt(e.target.value, 10);
                        if (isNaN(val) || val < min) val = min;
                        onChange(val);
                    }
                }}
                disabled={disabled}
            />
            <style>{`
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}</style>
        </>
    );
};

export default QuantityInput;

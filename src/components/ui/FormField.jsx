// src/components/ui/FormField.jsx
import React from "react";

const FormField = ({ label, required = false, error = null, children, className = "" }) => {
    return (
        <label className={`font-bold text-slate-500 ${className}`}>
            <span className="flex items-center gap-1">
                <p className="text-md">{label}</p>
                {required && <span className="text-lg text-red-500">*</span>}
            </span>
            {children}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </label>
    );
};

export default FormField;

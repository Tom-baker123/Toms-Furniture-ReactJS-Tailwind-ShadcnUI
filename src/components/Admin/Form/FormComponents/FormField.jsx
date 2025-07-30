import React from "react";
import { Controller } from "react-hook-form";

const FormField = ({ field, control, getFieldError, getFieldClassName }) => {
    const renderField = ({ field: controllerField }) => {
        switch (field.type) {
            case "input":
                return (
                    <input
                        type={field.inputType || "text"}
                        className={getFieldClassName(field.name)}
                        placeholder={field.placeholder}
                        {...controllerField}
                    />
                );

            case "textarea":
                return (
                    <textarea
                        className={getFieldClassName(field.name)}
                        placeholder={field.placeholder}
                        rows={field.rows || 4}
                        {...controllerField}
                    />
                );

            case "select":
                return (
                    <select
                        className={getFieldClassName(field.name)}
                        {...controllerField}
                        value={controllerField.value || ""}
                        onChange={(e) => {
                            let value = e.target.value;

                            // Convert empty string to null for select fields
                            if (value === "") {
                                value = null;
                            }

                            // Convert string boolean values to actual boolean for IsActive field
                            if (field.name === "IsActive") {
                                if (value === "true") value = true;
                                else if (value === "false") value = false;
                            }

                            controllerField.onChange(value);
                        }}
                    >
                        {field.placeholder && <option value="">{field.placeholder}</option>}
                        {field.options?.map((option) => (
                            <option
                                key={option.id}
                                value={option.id || option.value}
                            >
                                {option[field.optionKey] || option.label}
                            </option>
                        ))}
                    </select>
                );

            default:
                return null;
        }
    };

    const error = getFieldError(field.name);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <Controller
                name={field.name}
                control={control}
                rules={field.rules}
                render={renderField}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    );
};

export default FormField;

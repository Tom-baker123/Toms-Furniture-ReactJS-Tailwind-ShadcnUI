import { useMemo } from 'react';

export const useFormFields = ({
    control,
    errors,
    categories,
    brands,
    countries,
    suppliers,
    isEditing
}) => {
    const formFields = useMemo(() => [
        {
            name: "ProductName",
            label: "Product Name *",
            type: "input",
            inputType: "text",
            placeholder: "Enter product name",
            rules: {
                required: "Product name is required",
                maxLength: {
                    value: 100,
                    message: "Product name must be less than 100 characters",
                },
            },
            required: true
        },
        {
            name: "SpecificationDescription",
            label: "Specification Description",
            type: "textarea",
            placeholder: "Enter specification description",
            rows: 4,
            required: false
        },
        {
            name: "CategoryId",
            label: "Category *",
            type: "select",
            placeholder: "Select category",
            options: categories,
            optionKey: "categoryName",
            rules: { required: "Category is required" },
            required: true
        },
        {
            name: "BrandId",
            label: "Brand",
            type: "select",
            placeholder: "Select brand",
            options: brands,
            optionKey: "brandName",
            required: false
        },
        {
            name: "CountriesId",
            label: "Country",
            type: "select",
            placeholder: "Select country",
            options: countries,
            optionKey: "countryName",
            required: false
        },
        {
            name: "SupplierId",
            label: "Supplier",
            type: "select",
            placeholder: "Select supplier",
            options: suppliers,
            optionKey: "supplierName",
            required: false
        },
        ...(isEditing ? [{
            name: "IsActive",
            label: "Status",
            type: "select",
            options: [
                { id: true, value: true, label: "Active" },
                { id: false, value: false, label: "Inactive" }
            ],
            optionKey: "label",
            required: false
        }] : [])
    ], [categories, brands, countries, suppliers, isEditing]);

    const getFieldError = (fieldName) => {
        return errors[fieldName];
    };

    const getFieldClassName = (fieldName, baseClassName = "") => {
        const errorClass = getFieldError(fieldName) ? "border-red-500" : "border-gray-300";
        return `mt-1 w-full rounded-md border ${errorClass} px-3 py-2 transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 ${baseClassName}`;
    };

    return {
        formFields,
        getFieldError,
        getFieldClassName
    };
};

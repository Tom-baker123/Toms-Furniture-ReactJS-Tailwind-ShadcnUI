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
            label: "Tên Sản Phẩm *",
            type: "input",
            inputType: "text",
            placeholder: "-- Nhập tên sản phẩm --",
            rules: {
                required: "Tên sản phẩm là bắt buộc",
                validate: {
                    notEmpty: (value) => {
                        if (!value || value.trim() === "") {
                            return "Tên sản phẩm không được để trống hoặc chỉ chứa khoảng trắng";
                        }
                        return true;
                    }
                },
                maxLength: {
                    value: 100,
                    message: "Tên sản phẩm phải ít hơn 100 ký tự",
                },
            },
            required: true
        },
        {
            name: "SpecificationDescription",
            label: "Mô Tả Thông Số Kỹ Thuật",
            type: "textarea",
            placeholder: "-- Nhập mô tả thông số kỹ thuật --",
            rows: 4,
            required: false
        },
        {
            name: "CategoryId",
            label: "Danh Mục *",
            type: "select",
            placeholder: "-- Chọn danh mục --",
            options: categories,
            optionKey: "categoryName",
            rules: {
                required: "Danh mục là bắt buộc",
                validate: {
                    notEmpty: (value) => {
                        if (!value || value === "" || value === "0" || value === 0) {
                            return "Vui lòng chọn một danh mục hợp lệ";
                        }
                        return true;
                    }
                }
            },
            required: true
        },
        {
            name: "BrandId",
            label: "Thương Hiệu",
            type: "select",
            placeholder: "-- Chọn thương hiệu --",
            options: brands,
            optionKey: "brandName",
            required: false
        },
        {
            name: "CountriesId",
            label: "Quốc Gia",
            type: "select",
            placeholder: "-- Chọn quốc gia --",
            options: countries,
            optionKey: "countryName",
            required: false
        },
        {
            name: "SupplierId",
            label: "Nhà Cung Cấp",
            type: "select",
            placeholder: "-- Chọn nhà cung cấp --",
            options: suppliers,
            optionKey: "supplierName",
            required: false
        },
        ...(isEditing ? [{
            name: "IsActive",
            label: "Trạng Thái",
            type: "select",
            options: [
                { id: true, value: true, label: "Hoạt Động" },
                { id: false, value: false, label: "Không Hoạt Động" }
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

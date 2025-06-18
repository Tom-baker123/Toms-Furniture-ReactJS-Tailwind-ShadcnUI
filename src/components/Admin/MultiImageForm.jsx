import React, { useState } from "react";
import { Plus, X, Upload, Image, Save, RotateCcw } from "lucide-react";

const MultiImageForm = () => {
    const [formData, setFormData] = useState({
        productName: "",
        images: [{ file: null, preview: null, alt: "" }],
    });

    const [errors, setErrors] = useState({});

    const handleProductNameChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            productName: e.target.value,
        }));

        // Clear error when user starts typing
        if (errors.productName) {
            setErrors((prev) => ({ ...prev, productName: "" }));
        }
    };

    const handleImageChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => {
                    const newImages = [...prev.images];
                    newImages[index] = {
                        ...newImages[index],
                        file: file,
                        preview: reader.result,
                    };
                    return { ...prev, images: newImages };
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset input để có thể chọn cùng file nhiều lần
        event.target.value = "";
    };

    const handleAltChange = (index, value) => {
        setFormData((prev) => {
            const newImages = [...prev.images];
            newImages[index] = { ...newImages[index], alt: value };
            return { ...prev, images: newImages };
        });
    };

    const handleAddImageWithFile = (event) => {
        const file = event.target.files[0];
        console.log("Adding new image file:", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("FileReader completed, adding image with preview");
                setFormData((prev) => {
                    const newImages = [...prev.images, { file: file, preview: reader.result, alt: "" }];
                    console.log("New images array:", newImages);
                    return { ...prev, images: newImages };
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset input để có thể chọn cùng file nhiều lần
        event.target.value = "";
    };

    const removeImageField = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.productName.trim()) {
            newErrors.productName = "Vui lòng nhập tên sản phẩm";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log("Form Data:", formData);
            alert("Form đã được submit! Kiểm tra console để xem dữ liệu.");
        }
    };

    const resetForm = () => {
        setFormData({
            productName: "",
            images: [{ file: null, preview: null, alt: "" }],
        });
        setErrors({});
    };

    return (
        <div className="mx-auto min-h-screen max-w-4xl bg-white p-6">
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Thêm Sản Phẩm</h1>
                <p className="text-gray-600">Nhập thông tin và hình ảnh sản phẩm của bạn</p>
            </div>

            <div className="space-y-6">
                {/* Tên sản phẩm */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Tên Sản Phẩm *</label>
                    <input
                        type="text"
                        value={formData.productName}
                        onChange={handleProductNameChange}
                        className={`w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                            errors.productName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nhập tên sản phẩm..."
                    />
                    {errors.productName && <p className="mt-1 text-sm text-red-600">{errors.productName}</p>}
                </div>

                {/* Phần hình ảnh */}
                <div>
                    <label className="mb-4 block text-sm font-medium text-gray-700">Hình Ảnh Sản Phẩm ({formData.images.length})</label>

                    <div className="flex flex-wrap items-start gap-4">
                        {formData.images.map((image, index) => (
                            <div
                                key={`image-${index}-${image.preview ? "with-preview" : "no-preview"}`}
                                className="relative w-32 flex-shrink-0"
                            >
                                <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 p-2 transition-colors hover:border-purple-400">
                                    {image.preview ? (
                                        <div className="relative h-full w-full">
                                            <img
                                                src={image.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="h-full w-full rounded-md object-cover"
                                            />
                                            <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center rounded-md bg-black opacity-0 transition-opacity hover:opacity-100">
                                                <div className="flex gap-2">
                                                    <label className="bg-opacity-90 hover:bg-opacity-100 cursor-pointer rounded bg-white px-2 py-1 text-xs font-medium text-gray-700">
                                                        <Upload className="mr-1 inline h-3 w-3" />
                                                        Thay ảnh
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleImageChange(index, e)}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-500 transition-colors hover:text-purple-600">
                                            <Image className="mb-1 h-6 w-6" />
                                            <span className="text-center text-xs font-medium">Chọn ảnh</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageChange(index, e)}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Alt text input */}
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={image.alt}
                                        onChange={(e) => handleAltChange(index, e.target.value)}
                                        placeholder="Mô tả..."
                                        className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>

                                {/* Image number */}
                                <div className="bg-opacity-50 absolute top-1 left-1 rounded bg-black px-1.5 py-0.5 text-xs text-white">
                                    {index + 1}
                                </div>

                                {/* Main image indicator */}
                                {index === 0 && (
                                    <div className="absolute top-1 right-1 rounded bg-purple-500 px-1.5 py-0.5 text-xs text-white">Chính</div>
                                )}
                            </div>
                        ))}

                        {/* Nút thêm ảnh */}
                        <div className="w-32 flex-shrink-0">
                            <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-purple-400 hover:text-purple-600">
                                <Plus className="mb-1 h-6 w-6" />
                                <span className="text-xs font-medium">Thêm ảnh</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAddImageWithFile}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Thông tin bổ sung */}
                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <Image className="mt-0.5 h-5 w-5 text-blue-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Gợi ý:</strong> Ảnh đầu tiên sẽ là ảnh chính của sản phẩm. Click vào nút "+" để thêm ảnh mới. Kéo ngang để
                                    xem tất cả ảnh.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 border-t pt-6">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex flex-1 items-center justify-center rounded-md bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Lưu Sản Phẩm
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        className="flex items-center rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Đặt lại
                    </button>
                </div>
            </div>

            {/* Debug info */}
            <div className="mt-8 rounded-md border bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Thông tin debug:</h3>
                <div className="space-y-1 text-xs text-gray-600">
                    <p>Số lượng ảnh: {formData.images.length}</p>
                    <p>Tên sản phẩm: {formData.productName || "(chưa nhập)"}</p>
                    <p>Ảnh đã chọn: {formData.images.filter((img) => img.file).length}</p>
                </div>
            </div>
        </div>
    );
};

export default MultiImageForm;

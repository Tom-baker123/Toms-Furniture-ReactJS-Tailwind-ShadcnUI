// ProductImages.jsx
import { Image, Plus, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const ProductImages = ({ images, setImages, imageErrors, setImageErrors, watch, isEditing, deleteSlider }) => {
    // Hàm định dạng số thứ tự thành chuỗi 3 chữ số (ví dụ: 1 -> "001")
    // **Sửa đổi**: Thêm hàm để định dạng số thứ tự
    const formatSliderIndex = (index) => String(index + 1).padStart(3, "0");

    // Hàm kiểm tra trùng lặp alt text trong danh sách images
    // **Sửa đổi**: Thêm hàm kiểm tra trùng lặp alt
    const checkDuplicateAlt = (alt, currentIndex) => {
        return images.some((img, index) => index !== currentIndex && img.alt === alt);
    };

    const handleImageChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => {
                    const newImages = [...prev];
                    // **Sửa đổi**: Sử dụng ProductName + số thứ tự nếu alt chưa được thay đổi
                    const productName = watch("ProductName");
                    const defaultAlt = productName ? `${productName} ${formatSliderIndex(index)}` : `Image ${formatSliderIndex(index)}`;
                    const currentAlt = newImages[index].alt && newImages[index].alt !== `Image ${index + 1}` ? newImages[index].alt : defaultAlt;
                    newImages[index] = {
                        ...newImages[index],
                        file: file,
                        preview: reader.result,
                        alt: currentAlt,
                    };
                    return newImages;
                });
            };
            reader.readAsDataURL(file);
        }
        event.target.value = "";
    };

    const handleAddImageWithFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => {
                    // **Sửa đổi**: Sử dụng ProductName + số thứ tự cho alt của ảnh mới
                    const productName = watch("ProductName");
                    const defaultAlt = productName ? `${productName} ${formatSliderIndex(prev.length)}` : `Image ${formatSliderIndex(prev.length)}`;
                    return [
                        ...prev,
                        {
                            file: file,
                            preview: reader.result,
                            alt: defaultAlt,
                            displayOrder: prev.length,
                        },
                    ];
                });
            };
            reader.readAsDataURL(file);
        }
        event.target.value = "";
    };

    const handleAltChange = (index, value) => {
        // **Sửa đổi**: Kiểm tra trùng lặp alt trước khi cập nhật
        if (value && checkDuplicateAlt(value, index)) {
            toast.error("Alt text must be unique");
            return;
        }
        setImages((prev) => {
            const newImages = [...prev];
            newImages[index] = { ...newImages[index], alt: value };
            return newImages;
        });
    };

    // Hàm validateImages và removeImageField không thay đổi, giữ nguyên logic
    const validateImages = () => {
        const newErrors = {};
        if (images.length === 0 || images.every((img) => !img.file && !img.preview)) {
            newErrors.images = "Please upload at least one image";
        }
        // **Sửa đổi**: Thêm kiểm tra trùng lặp alt trong validateImages
        const altValues = images.map((img) => img.alt);
        const duplicateAlts = altValues.filter((alt, index) => alt && altValues.indexOf(alt) !== index);
        if (duplicateAlts.length > 0) {
            newErrors.images = "Alt texts must be unique";
        }
        setImageErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Phần JSX giữ nguyên, chỉ hiển thị để đảm bảo ngữ cảnh
    return (
        <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Product Images ({images.length})</h2>
            <div className="space-y-6">
                <div className="flex flex-wrap items-start gap-4">
                    {images.map((image, index) => (
                        <div
                            key={`image-${index}-${image.preview ? "with-preview" : "no-preview"}`}
                            className="relative w-32 flex-shrink-0"
                        >
                            <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 p-2 transition-colors hover:border-indigo-400">
                                {image.preview ? (
                                    <div className="relative h-full w-full">
                                        <img
                                            src={image.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="h-full w-full rounded-md object-cover"
                                        />
                                        <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center rounded-md bg-black opacity-0 transition-opacity hover:opacity-90">
                                            <div className="flex gap-2">
                                                <label className="bg-opacity-90 hover:bg-opacity-100 cursor-pointer rounded bg-white px-2 py-1 text-xs font-medium text-gray-700">
                                                    <Upload className="mr-1 inline h-3 w-3" />
                                                    Replace
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
                                    <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-500 transition-colors hover:text-indigo-600">
                                        <Image className="mb-1 h-6 w-6" />
                                        <span className="text-center text-xs font-medium">Select Image</span>
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
                                    value={image.alt || ""}
                                    onChange={(e) => handleAltChange(index, e.target.value)}
                                    placeholder="Description..."
                                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => removeImageField(index, image.id)}
                                className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>

                            {/* Image number */}
                            <div className="bg-opacity-50 absolute top-1 left-1 rounded bg-black px-1.5 py-0.5 text-xs text-white">{index + 1}</div>
                        </div>
                    ))}

                    {/* Add image button */}
                    <div className="w-32 flex-shrink-0">
                        <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600">
                            <Plus className="mb-1 h-6 w-6" />
                            <span className="text-xs font-medium">Add Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAddImageWithFile}
                            />
                        </label>
                    </div>
                </div>

                {imageErrors.images && <p className="text-sm text-red-600">{imageErrors.images}</p>}

                {/* Image info */}
                <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Image className="mt-0.5 h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> The first image will be the main product image. Click the "+" button to add a new image. Scroll
                                horizontally to view all images.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductImages;
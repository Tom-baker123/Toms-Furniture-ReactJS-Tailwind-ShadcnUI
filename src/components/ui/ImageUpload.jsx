// src/components/ui/ImageUpload.jsx
import React from "react";
import { Image as ImageIcon } from "lucide-react";

const ImageUpload = ({
    imagePreview,
    onImageChange,
    accept = ".jpg,.jpeg,.png,.gif,.webp",
    required = false,
    error = null,
    label = "Select image",
    className = "",
}) => {
    return (
        <div className={className}>
            <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border bg-gray-50 p-2 transition outline-dashed hover:bg-gray-100">
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 rounded object-cover"
                    />
                ) : (
                    <>
                        <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500">{required ? `${label} (required)` : label}</span>
                    </>
                )}
                <input
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={onImageChange}
                />
            </label>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default ImageUpload;

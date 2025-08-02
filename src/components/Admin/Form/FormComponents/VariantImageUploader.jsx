import React from "react";
import { ImagePlus, Trash2, TestTube, Info } from "lucide-react";
import { getAllProductVariantImages } from "@/api/service/ProductService";

const VariantImageUploader = ({ variantIndex, images = [], onAddImages, onRemoveImage, onUpdateImageInfo, error = null }) => {
    const handleFileChange = (e) => {
        console.log("🔵 [VariantImageUploader] File change detected for variant:", variantIndex);
        const files = Array.from(e.target.files || []);
        console.log("📁 Files selected:", files.length);
        files.forEach((file, idx) => {
            console.log(`📁 File ${idx + 1}:`, { name: file.name, size: file.size, type: file.type });
            onAddImages(variantIndex, file);
        });
        e.target.value = ""; // Reset input
    };

    // Test function để kiểm tra API endpoint
    const testAPIEndpoint = async () => {
        console.log("🧪 [TEST] Testing ProductVariantImage API endpoint...");
        try {
            const result = await getAllProductVariantImages();
            console.log("✅ [TEST] API endpoint working:", result);
            alert("API endpoint is working! Check console for details.");
        } catch (error) {
            console.error("❌ [TEST] API endpoint failed:", error);
            alert(`API endpoint failed: ${error.message}`);
        }
    };

    // Debug function để hiển thị current state
    const debugCurrentState = () => {
        console.log("🔍 [DEBUG] Current variant images state:");
        console.log(`📝 Variant Index: ${variantIndex}`);
        console.log(`📂 Images Count: ${images.length}`);
        console.log(
            "📊 Images Details:",
            images.map((img, idx) => ({
                index: idx,
                id: img.id,
                hasFile: !!img.file,
                hasPreview: !!img.preview,
                attribute: img.attribute,
                displayOrder: img.displayOrder,
                fileName: img.file?.name,
            })),
        );
        console.log("🗂️ Raw Images:", images);

        alert(`Variant ${variantIndex}: ${images.length} images. Check console for details.`);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Variant Images</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={debugCurrentState}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-100"
                    >
                        <Info className="h-4 w-4" />
                        Debug
                    </button>
                    <button
                        type="button"
                        onClick={testAPIEndpoint}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-100"
                    >
                        <TestTube className="h-4 w-4" />
                        Test API
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id={`variant-image-upload-${variantIndex}`}
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor={`variant-image-upload-${variantIndex}`}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                    >
                        <ImagePlus className="h-4 w-4" />
                        Add Images
                    </label>
                </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.length > 0 ? (
                    images.map((image, imageIndex) => (
                        <div
                            key={imageIndex}
                            className="group relative"
                        >
                            {/* Image Status Badge */}
                            <div className="absolute top-2 left-2 z-10">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        image.id && image.id > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {image.id && image.id > 0 ? "✓ Saved" : "⋯ New"}
                                </span>
                            </div>

                            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                                <img
                                    src={image.preview}
                                    alt={`Variant image ${imageIndex + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Image Controls */}
                            <div className="bg-opacity-0 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-all group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(variantIndex, imageIndex)}
                                    className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Image Info */}
                            <div className="mt-2 space-y-1">
                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    value={image.attribute || ""}
                                    onChange={(e) => onUpdateImageInfo(variantIndex, imageIndex, "attribute", e.target.value)}
                                    className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                />
                                {/* Debug info for development */}
                                <div className="text-xs text-gray-400">
                                    ID: {image.id || "None"} | Order: {image.displayOrder || 0}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center sm:col-span-3">
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No images uploaded</p>
                        <p className="text-xs text-gray-400">Click "Add Images" to upload</p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default VariantImageUploader;

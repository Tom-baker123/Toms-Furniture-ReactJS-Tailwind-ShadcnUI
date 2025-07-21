import React from "react";

const ProductVariantsModalContent = ({ variants }) => {
    if (!variants || variants.length === 0) {
        return <div className="text-center text-gray-500">No variants available.</div>;
    }
    return (
        <div className="space-y-4">
            <h3 className="mb-2 text-lg font-bold">Product Variants</h3>
            <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                <table className="w-full min-w-[900px] border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-center whitespace-nowrap">#</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Image</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Color</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Size</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Material</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Unit</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Stock Qty</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Original Price</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Discounted Price</th>
                            <th className="px-3 py-2 text-center whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.map((variant, idx) => (
                            <tr
                                key={variant.id || idx}
                                className="border-t"
                            >
                                <td className="px-3 py-2 text-center">{idx + 1}</td>
                                <td className="px-3 py-2 text-center">
                                    {variant.images?.[0]?.imageUrl ? (
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <img
                                                src={variant.images[0].imageUrl}
                                                alt="variant"
                                                width={40}
                                                height={40}
                                                style={{ borderRadius: "6px", objectFit: "cover" }}
                                            />
                                        </div>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="px-3 py-2 text-center whitespace-nowrap">
                                    {variant.colorName ? (
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-block h-5 w-5 rounded-full shadow"
                                                style={{ backgroundColor: variant.colorCode || "#000000" }}
                                            ></span>
                                            {variant.colorCode || "N/A"}
                                        </div>
                                    ) : (
                                        "-"
                                    )}
                                    {/* <span style={{ background: variant.colorCode, padding: "2px 8px", borderRadius: "6px", color: variant.colorCode === '#000000' ? '#fff' : '#333', display: 'inline-block', minWidth: 60, textAlign: 'center' }}>
                                            {variant.colorName}
                                        </span> */}
                                </td>
                                <td className="px-3 py-2 text-center whitespace-nowrap">{variant.sizeName || "-"}</td>
                                <td className="px-3 py-2 text-center">{variant.materialName || "-"}</td>
                                <td className="px-3 py-2 text-center">{variant.unitName || "-"}</td>
                                <td className="px-3 py-2 text-center">{variant.stockQty ?? "-"}</td>
                                <td className="px-3 py-2 text-center">{variant.originalPrice ? `$${variant.originalPrice}` : "-"}</td>
                                <td className="px-3 py-2 text-center">{variant.discountedPrice ? `$${variant.discountedPrice}` : "-"}</td>
                                <td className="px-3 py-2 text-center">{variant.images?.[0]?.isActive ? "Active" : "Inactive"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductVariantsModalContent;

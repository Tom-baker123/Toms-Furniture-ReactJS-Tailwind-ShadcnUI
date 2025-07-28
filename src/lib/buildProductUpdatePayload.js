// Hàm build object cập nhật sản phẩm đúng chuẩn backend (PascalCase)
// Cho phép override các trường (ví dụ: trạng thái)
export default function buildProductUpdatePayload(product, override = {}) {
    return {
        Id: product.id,
        ProductName: product.productName,
        SpecificationDescription: product.specificationDescription,
        BrandId: product.brandId,
        CategoryId: product.categoryId,
        CountriesId: product.countriesId,
        SupplierId: product.supplierId,
        IsActive: override.isActive !== undefined ? override.isActive : product.isActive,
        ProductVariants: product.productVariants?.map(variant => ({
            Id: variant.id,
            OriginalPrice: variant.originalPrice,
            DiscountedPrice: variant.discountedPrice,
            StockQty: variant.stockQty,
            ColorId: variant.colorId,
            SizeId: variant.sizeId,
            MaterialId: variant.materialId,
            UnitId: variant.unitId,
            IsActive: variant.isActive
        }))
    };
}

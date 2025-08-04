// Test data và functions để verify category utils
import { buildCategoryHierarchy, divideCategoriesIntoColumns, createMegaMenuFromCategories } from './categoryUtils';

// Sample data từ response API
const sampleCategories = [
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754125806/ftm8iu6ttu2rify6skga.jpg",
        "createdDate": "2025-07-29T05:03:16.737",
        "updatedDate": "2025-08-02T09:09:58.203",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": null,
        "id": 1,
        "isActive": true,
        "categoryName": "Bàn",
        "descriptions": "Danh mục nói chung tổng thể cho bàn",
        "parentId": null,
        "roomTypeId": null
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126105/dhngolfy5pbnjugzx6o7.webp",
        "createdDate": "2025-07-29T05:04:00.847",
        "updatedDate": "2025-08-02T09:14:57.207",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": null,
        "id": 2,
        "isActive": true,
        "categoryName": "Ghế",
        "descriptions": "Danh mục tổng thể dành cho ghế",
        "parentId": null,
        "roomTypeId": null
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126120/zqyhxnvtdklasbhsfm1p.webp",
        "createdDate": "2025-07-29T05:48:11.187",
        "updatedDate": "2025-08-02T09:15:11.58",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": null,
        "id": 3,
        "isActive": true,
        "categoryName": "Tủ",
        "descriptions": "Danh mục tổng thể dành cho tủ",
        "parentId": null,
        "roomTypeId": null
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754273593/xgs6qsiq3kobxmxh2zhs.png",
        "createdDate": "2025-07-29T05:53:09.89",
        "updatedDate": "2025-08-04T07:13:53.8",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": "Phòng Ngủ",
        "id": 4,
        "isActive": true,
        "categoryName": "Giường",
        "descriptions": "Danh mục tổng thể dành cho giường",
        "parentId": null,
        "roomTypeId": 2
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126139/fyasz2rmxpbqi8263bd2.jpg",
        "createdDate": "2025-07-29T06:28:40.45",
        "updatedDate": "2025-08-02T09:15:30.563",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": null,
        "id": 5,
        "isActive": true,
        "categoryName": "Phụ Kiện",
        "descriptions": "Danh mục tổng thể dành cho phụ kiện",
        "parentId": null,
        "roomTypeId": null
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126158/ozlob3rupyvazqwxxop9.png",
        "createdDate": "2025-07-29T06:29:29.687",
        "updatedDate": "2025-08-02T09:15:49.603",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": null,
        "id": 6,
        "isActive": true,
        "categoryName": "Ghế đẩu",
        "descriptions": "Danh mục cho ghế đẩu",
        "parentId": 2,
        "roomTypeId": null
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126367/rpr3vvxx2pcvqk7lodb9.webp",
        "createdDate": "2025-07-29T07:27:43.8",
        "updatedDate": "2025-08-04T07:14:16.18",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": "Phòng khách",
        "id": 7,
        "isActive": true,
        "categoryName": "Ghế bar",
        "descriptions": "Danh mục thuộc ghế bar",
        "parentId": 2,
        "roomTypeId": 1
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126378/grjd4swisoqwyc06vko4.jpg",
        "createdDate": "2025-07-29T10:47:20.537",
        "updatedDate": "2025-08-02T09:19:29.483",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": null,
        "id": 8,
        "isActive": true,
        "categoryName": "Ghế Sofa",
        "descriptions": "Danh mục dành riêng cho ghế Sofa",
        "parentId": 2,
        "roomTypeId": null
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126463/b3i3chrtr0s1dwrxqs7e.webp",
        "createdDate": "2025-07-30T06:04:53.897",
        "updatedDate": "2025-08-04T07:14:25.173",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": "Phòng Ăn",
        "id": 9,
        "isActive": true,
        "categoryName": "Ghế Ăn",
        "descriptions": "Danh mục dành cho ghế ăn",
        "parentId": 2,
        "roomTypeId": 3
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126083/ozd51ga3sppds220fcoa.png",
        "createdDate": "2025-07-30T06:13:27.31",
        "updatedDate": "2025-08-04T07:14:34.283",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": "Phòng Làm Ciệc",
        "id": 10,
        "isActive": true,
        "categoryName": "Ghế Văn Phòng",
        "descriptions": "Danh mục dành cho văn phòng",
        "parentId": 2,
        "roomTypeId": 5
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1753856383/lcaqi0ahnzhdqikw28rn.webp",
        "createdDate": "2025-07-30T06:19:37.673",
        "updatedDate": "2025-08-04T07:14:52.767",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": "Phòng khách",
        "id": 11,
        "isActive": true,
        "categoryName": "Ghế Bành",
        "descriptions": "Danh mục cho ghế bành",
        "parentId": 2,
        "roomTypeId": 1
    },
    {
        "imageUrl": "https://res.cloudinary.com/duelcb8ki/image/upload/v1754126067/f0wgkktvnv4h8xkfdwgc.png",
        "createdDate": "2025-08-01T00:26:41.833",
        "updatedDate": "2025-08-04T07:15:29.373",
        "createdBy": null,
        "updatedBy": null,
        "roomTypeName": "Phòng khách",
        "id": 12,
        "isActive": true,
        "categoryName": "Bàn Ăn",
        "descriptions": "Danh mục dành cho bàn ăn",
        "parentId": 1,
        "roomTypeId": 1
    }
];

// Test functions
export const testCategoryUtils = () => {
    console.log('=== TESTING CATEGORY UTILS ===');

    // Test buildCategoryHierarchy
    const hierarchy = buildCategoryHierarchy(sampleCategories);
    console.log('Hierarchy:', hierarchy);

    // Test divideCategoriesIntoColumns
    const columns = divideCategoriesIntoColumns(hierarchy, 3);
    console.log('Columns:', columns);

    // Test createMegaMenuFromCategories
    const megaMenuConfig = createMegaMenuFromCategories(sampleCategories);
    console.log('Mega Menu Config:', megaMenuConfig);

    return {
        hierarchy,
        columns,
        megaMenuConfig
    };
};

// Export for use in components
export { sampleCategories };

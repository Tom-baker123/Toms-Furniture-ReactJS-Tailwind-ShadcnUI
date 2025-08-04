# Banner Management System - Hướng dẫn sử dụng

## Tổng quan

Hệ thống quản lý banner cho phép admin tạo, chỉnh sửa, xóa và quản lý các banner hiển thị trên website.

## Các file đã tạo/cập nhật

### 1. BannerService.js (`src/api/service/BannerService.js`)

- **Chức năng**: Chứa các API calls để tương tác với backend
- **Các methods**:
    - `getAllBanners()`: Lấy danh sách tất cả banner
    - `getBannerById(id)`: Lấy banner theo ID
    - `createBanner(bannerData, imageFile, imageFileMobile)`: Tạo banner mới
    - `updateBanner(bannerData, imageFile, imageFileMobile)`: Cập nhật banner
    - `deleteBanner(id)`: Xóa banner

### 2. BannerForm.jsx (`src/components/Admin/Form/BannerForm.jsx`)

- **Chức năng**: Giao diện quản lý banner
- **Layout**:
    - Bên trái: Danh sách banner hiện có
    - Bên phải: Form thêm/sửa banner
- **Tính năng**:
    - Hiển thị danh sách banner với preview ảnh
    - Tạo banner mới với upload ảnh desktop + mobile
    - Chỉnh sửa banner hiện có
    - Xóa banner với xác nhận
    - Validation form đầy đủ
    - Hiển thị trạng thái banner (hoạt động, tạm dừng, hết hạn, sắp tới)

## Luồng hoạt động

### 1. Hiển thị danh sách banner

- Khi vào trang, tự động tải danh sách banner từ API
- Hiển thị preview ảnh, tên, mô tả, trạng thái
- Trạng thái được tính toán dựa trên ngày hiện tại:
    - **Hoạt động**: Trong thời gian hiệu lực và IsActive = true
    - **Sắp tới**: Chưa đến ngày bắt đầu nhưng IsActive = true
    - **Hết hạn**: Đã qua ngày kết thúc
    - **Tạm dừng**: IsActive = false

### 2. Tạo banner mới

- Click "Tạo mới"
- Upload ảnh desktop và mobile (bắt buộc)
- Điền thông tin:
    - Tiêu đề (bắt buộc)
    - Mô tả (tùy chọn)
    - Link URL (bắt buộc)
    - Ngày bắt đầu và kết thúc (bắt buộc)
    - Thứ tự hiển thị (tùy chọn)
    - Vị trí hiển thị (tùy chọn)
    - Trạng thái hoạt động

### 3. Chỉnh sửa banner

- Click vào banner trong danh sách hoặc click icon edit
- Form sẽ được điền sẵn dữ liệu hiện tại
- Upload ảnh mới là tùy chọn (giữ nguyên ảnh cũ nếu không upload)
- Cập nhật thông tin và submit

### 4. Xóa banner

- Click icon trash
- Hiện popup xác nhận
- Xóa banner và cập nhật danh sách

## Validation

### Client-side validation:

- Tiêu đề không được để trống
- Link URL không được để trống và phải đúng format URL
- Ngày bắt đầu không được ở quá khứ (chỉ áp dụng cho banner mới)
- Ngày kết thúc phải sau ngày bắt đầu
- Ảnh desktop và mobile bắt buộc cho banner mới

### Server-side validation (từ backend):

- Kiểm tra trùng lặp tiêu đề
- Validate độ dài tiêu đề < 100 ký tự
- Kiểm tra định dạng ngày tháng
- Validate thứ tự hiển thị không âm

## Cách sử dụng

### 1. Truy cập trang quản lý banner

```
/admin/website-management → Tab "Banner"
```

### 2. Tạo banner mới

1. Click "Tạo mới"
2. Upload ảnh desktop (khuyến nghị: 1920x600px)
3. Upload ảnh mobile (khuyến nghị: 768x400px)
4. Điền thông tin banner
5. Click "Tạo mới"

### 3. Chỉnh sửa banner

1. Click vào banner cần sửa
2. Thay đổi thông tin cần thiết
3. Upload ảnh mới nếu cần
4. Click "Cập nhật"

### 4. Xóa banner

1. Click icon thùng rác
2. Xác nhận xóa

## Lưu ý kỹ thuật

### Format ảnh được hỗ trợ:

- .jpg, .jpeg, .png, .gif, .webp

### Cấu trúc dữ liệu banner:

```javascript
{
  Title: string,
  Description: string?,
  LinkUrl: string,
  StartDate: Date,
  EndDate: Date,
  DisplayOrder: number?,
  Position: string?,
  IsActive: boolean,
  UserId: number?
}
```

### Error handling:

- Tất cả lỗi API được hiển thị bằng toast notification
- Validation errors được hiển thị trực tiếp dưới input
- Loading state được hiển thị khi xử lý request

## Tích hợp với backend

- Sử dụng FormData để upload file
- API endpoint: `/api/Banner`
- Hỗ trợ CRUD đầy đủ
- Upload ảnh lên Cloudinary thông qua backend

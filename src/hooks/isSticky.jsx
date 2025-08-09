// Hook tối ưu phát hiện trạng thái "sticky" của header dựa trên vị trí cuộn.
// Sử dụng useSyncExternalStore (ổn định từ React 18, tiếp tục khuyến khích trong React 19)
// để đảm bảo Server Components / SSR an toàn và tránh re-render thừa.
// Cải tiến:
// 1. Không tạo state + effect riêng lẻ mỗi lần mà dùng cơ chế subscribe chuẩn.
// 2. Lắng nghe sự kiện scroll với passive: true để mượt hơn.
// 3. Tham số hoá ngưỡng (offset) – ví dụ sticky sau 32px.
// 4. An toàn SSR (trả về false trên server).
// 5. API giữ nguyên export default (isSticky) để không phá vỡ code cũ.
// 6. Có thêm export tên mới useSticky để rõ nghĩa chuẩn hook.

import { useCallback, useSyncExternalStore } from "react";

/**
 * useSticky
 * @param {number} offset - Ngưỡng (px) bắt đầu coi là sticky. Mặc định > 0.
 * @returns {boolean} true nếu window.scrollY > offset
 */
function useSticky(offset = 0) {
    const isClient = typeof window !== "undefined";

    // subscribe: đăng ký/unregister listener. Phụ thuộc offset để cập nhật logic khi đổi ngưỡng.
    const subscribe = useCallback(
        (callback) => {
            if (!isClient) return () => {};
            // Dùng 1 handler tối giản – chỉ gọi callback; React sẽ so sánh snapshot cũ/mới để quyết định re-render.
            const handler = () => callback();
            window.addEventListener("scroll", handler, { passive: true });
            return () => window.removeEventListener("scroll", handler);
        },
        [isClient, offset],
    );

    const getSnapshot = useCallback(() => {
        if (!isClient) return false;
        return window.scrollY > offset;
    }, [isClient, offset]);

    // Server snapshot luôn false (tránh mismatch HTML ban đầu).
    const getServerSnapshot = () => false;

    const sticky = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return sticky;
}

// Giữ tên cũ để tương thích (alias)
const isSticky = useSticky;

export { useSticky };
export default isSticky;

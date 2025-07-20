import { createContext, useContext, useState } from "react";

const AdminModalContext = createContext();

// Giải thích:

// ModalContext: Lưu trữ trạng thái và các hàm để mở/đóng modal.
// ModalProvider: Component bao bọc ứng dụng để cung cấp context.
// useModal: Hook tùy chỉnh để sử dụng modal ở bất kỳ đâu.
// openModal(content): Mở modal với nội dung được truyền vào (có thể là JSX).
// closeModal(): Đóng modal và xóa nội dung.

export const AdminModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalOptions, setModalOptions] = useState({});

    const openModal = (content, options = {}) => {
        setModalContent(content);
        setModalOptions(options);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(() => {
            setModalContent(null);
            setModalOptions({});
        }, 250);
    };

    return <AdminModalContext.Provider value={{ isOpen, modalContent, modalOptions, openModal, closeModal }}>{children}</AdminModalContext.Provider>;
};

export const useAdminModal = () => useContext(AdminModalContext);

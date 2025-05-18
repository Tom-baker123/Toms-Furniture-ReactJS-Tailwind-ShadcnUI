import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

// Giải thích:

// ModalContext: Lưu trữ trạng thái và các hàm để mở/đóng modal.
// ModalProvider: Component bao bọc ứng dụng để cung cấp context.
// useModal: Hook tùy chỉnh để sử dụng modal ở bất kỳ đâu.
// openModal(content): Mở modal với nội dung được truyền vào (có thể là JSX).
// closeModal(): Đóng modal và xóa nội dung.

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (content) => {
        setModalContent(content);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(() => setModalContent(null), 250);
    };

    return <ModalContext.Provider value={{ isOpen, modalContent, openModal, closeModal }}>{children}</ModalContext.Provider>;
};

export const useModal = () => useContext(ModalContext);

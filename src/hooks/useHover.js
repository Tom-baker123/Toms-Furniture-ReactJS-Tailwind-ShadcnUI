import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook để xử lý hover với delay
 * @param {number} delay - Thời gian delay trước khi trigger hover (ms)
 * @returns {object} - Object chứa state và handlers
 */
export const useHover = (delay = 100) => {
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeoutRef = useRef(null);

    const handleMouseEnter = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(true);
        }, delay);
    }, [delay]);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setIsHovered(false);
    }, []);

    const forceShow = useCallback(() => {
        setIsHovered(true);
    }, []);

    const forceHide = useCallback(() => {
        setIsHovered(false);
    }, []);

    return {
        isHovered,
        handleMouseEnter,
        handleMouseLeave,
        forceShow,
        forceHide
    };
};
